import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import jstudio from 'jstudio';
import { logger } from 'console-wizard';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const client = jstudio.connect('js_4ece47b66df9cf728ed9a0508e82c9b66af86e5a988e5461bcd0e487eaead8a2');

// In-memory data
let latestData = {
  gear_stock: [],
  seed_stock: [],
  egg_stock: [],
  eventshop_tock: [],
  cosmetics_stock: [],
};

let newData = { weather: [] };

// Helpers
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
}

function cleanItems(items) {
  return items.map(item => {
    let iconUrl = item.icon || '';
    if (iconUrl.startsWith('https://api.joshlei.com/v2/growagarden/image/')) {
      const itemId = item.item_id || normalizeName(item.name || item.display_name);
      iconUrl = `https://api-yvj3.onrender.com/api/v3/growagarden/image/${itemId}`;
    }

    return {
      ...item,
      quantity: item.quantity || 0,
      icon: iconUrl,
      Date_End: item.Date_End || new Date(Date.now() + 300000).toISOString(),
    };
  });
}

function updateStockData(data) {
  if (data.gear_stock) latestData.gearStock = cleanItems(data.gear_stock);
  if (data.seed_stock) latestData.seedsStock = cleanItems(data.seed_stock);
  if (data.egg_stock) latestData.eggStock = cleanItems(data.egg_stock);
  if (data.eventshop_stock) latestData.eventStock = cleanItems(data.eventshop_stock);
  if (data.cosmetic_stock) latestData.cosmeticsStock = cleanItems(data.cosmetic_stock);
}

function updateWeatherData(data) {
  if (data.weather) {
    const weatherObj = {};
    for (const key in data.weather) {
      if (key === "timestamp") continue;
      const item = data.weather[key];
      weatherObj[item.weather_id] = cleanItems(item);
    }
    weatherObj.timestamp = Date.now();
    newData.weather = weatherObj;
  }
}

// Init data
async function initializeData() {
  try {
    const stockData = await client.stocks.all();
    logger.success('✅ Kết nối Stock thành công');
    updateStockData(stockData);

    const weatherData = await client.weather.all();
    logger.success('✅ Kết nối Weather thành công');
    updateWeatherData(weatherData);
  } catch (err) {
    logger.error('❌ Lỗi khi khởi tạo:', err);
  }
}

// Poll fallback
function startPolling() {
  setInterval(async () => {
    try {
      const stockData = await client.stocks.all();
      updateStockData(stockData);

      const weatherData = await client.weather.all();
      updateWeatherData(weatherData);
    } catch (err) {
      logger.error('❌ Lỗi polling:', err);
    }
  }, 60000);
}
app.set('trust proxy', 1);
// Middleware
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'static')));

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' },
});

// Routes
app.get('/stocks', (req, res) => {
  res.sendFile(path.join(__dirname, 'stock.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
});
app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// API
app.get('/api/health', limiter, (req, res) => {
  res.json({ status: '200' });
});

app.get('/api/v3/growagarden/stock', limiter, (req, res) => {
  res.json(latestData);
});

app.get('/api/v3/growagarden/weather', limiter, (req, res) => {
  res.json(newData.weather);
});
app.get('/api/v3/growagarden/calculate', limiter, async (req, res) => {
  try {
    const { Name, Weight, Variant, Mutation } = req.query;

    if (!Name || !Weight) {
      return res.status(400).json({ error: 'Missing required fields: Name, Weight' });
    }

    const result = await client.calculator.calculate({
      Name,
      Weight,
      Variant: Variant || '',
      Mutation: Mutation
        ? Mutation.split(',').map(m => m.trim())
        : []
    });

    res.json(result);
  } catch (error) {
    logger.error(`Error calculating item: ${error.message}`);
    res.status(500).json({ error: 'Failed to calculate item' });
  }
});

// API: Lấy thông tin chi tiết item
app.get('/api/v3/growagarden/info/:item_id', limiter, async (req, res) => {
  try {
    const { item_id } = req.params;
    const item = await client.items.get(item_id); // Gọi API jstudio

    // Nếu item có icon, thì rewrite sang domain rehost
    if (item?.icon) {
      item.icon = item.icon.replace(
        /^https:\/\/api\.joshlei\.com\/v2\/growagarden\/image\//,
        'https://api-yvj3.onrender.com/api/v3/growagarden/image/'
      );
    }

    res.json(item);
  } catch (error) {
    logger.error(`Error fetching item info: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch item info' });
  }
});

app.get('/api/v3/growagarden/info', limiter, async (req, res) => {
  try {
    const { type } = req.query;

    // Chuẩn hoá type (chấp nhận số nhiều)
    const aliasMap = {
      seeds: 'seed',
      eggs: 'egg',
      cosmetics: 'cosmetic',
      events: 'event',
    };
    const allowed = new Set([
      'seed', 'seeds',
      'gear',
      'egg', 'eggs',
      'cosmetic', 'cosmetics',
      'event', 'events'
    ]);

    let normalizedType;
    if (typeof type === 'string' && type.trim()) {
      const t = type.toLowerCase().trim();
      if (!allowed.has(t)) {
        return res.status(400).json({ error: 'Invalid type' });
      }
      normalizedType = aliasMap[t] || t;
    }

    const items = normalizedType
      ? await client.items.all(normalizedType)
      : await client.items.all();

    res.json({
      type: normalizedType || 'all',
      count: Array.isArray(items) ? items.length : 0,
      items: items || []
    });
  } catch (error) {
    logger.error(`Error fetching items list: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch items list' });
  }
});
app.get('/api/v3/growagarden/image/:item_id', limiter, async (req, res) => {
  try {
    const { item_id } = req.params;
    if (!item_id) {
      return res.status(400).json({ error: 'Missing item_id' });
    }
    const imageUrl = client.images.getUrl(item_id);
    const response = await axios.get(imageUrl, { responseType: 'stream' });
    res.setHeader("Content-Type", response.headers["content-type"] || "image/png");
    response.data.pipe(res);
  } catch (error) {
    logger.error(`Error rehosting image: ${error.message}`);
    res.status(500).json({ error: 'Failed to rehost image' });
  }
});

app.get('/api/v3/growagarden/currentevent', limiter, async (req, res) => {
  try {
    const currentEvent = await client.getCurrentEvent();

    // Clone object để tránh mutate dữ liệu gốc
    const modifiedEvent = {
      ...currentEvent,
      current: {
        ...currentEvent.current,
        icon: currentEvent.current?.icon
          ? currentEvent.current.icon.replace(
              /^https:\/\/api\.joshlei\.com\/v2\/growagarden\/image\//,
              "https://api-yvj3.onrender.com/api/v3/growagarden/image/"
            )
          : null
      }
    };

    res.json(modifiedEvent);
  } catch (error) {
    logger.error(`Error fetching current event: ${error.message}`);
    res.status(500).json({ error: 'Failed to get current event' });
  }
});
// Proxy ảnh
app.get('/api/v3/growagarden/image/:item_id', async (req, res) => {
  const { item_id } = req.params;
  try {
    const response = await axios.get(
      `https://api.joshlei.com/v2/growagarden/image/${item_id}`,
      { responseType: 'arraybuffer' }
    );

    res.set('Content-Type', response.headers['content-type'] || 'image/png');
    res.send(response.data);
  } catch (err) {
    logger.error(`❌ Lỗi tải ảnh cho ${item_id}:`, err.message);
    res.status(500).send('Không tải được ảnh');
  }
});

// Start server
const PORT = process.env.PORT || 443;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 API server chạy ở cổng ${PORT}`);
  initializeData();
  startPolling();
});
