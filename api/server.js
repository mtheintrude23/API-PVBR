
import express from 'express';
import cors from 'cors';
import { DateTime } from 'luxon';
import fs from "fs";
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import jstudio from 'jstudio';
import { logger } from 'console-wizard';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const client = jstudio.connect('js_4ece47b66df9cf728ed9a0508e82c9b66af86e5a988e5461bcd0e487eaead8a2');

// In-memory data
let latestData = {
  gear_stock: [],
  seed_stock: [],
  egg_stock: [],
  eventshop_stock: [],
  cosmetics_stock: [],
};

let newData = { weather: [] };

// Helpers
function normalizeName(name) {
  if (!name) return 'unknown'; // fallback nếu name undefined/null
  return name.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
}

function cleanItems(items) {
  return items.map(item => {
    let iconUrl = item?.icon || '';
    const itemId = item?.item_id || normalizeName(item?.name ?? item?.display_name ?? 'unknown');

    if (iconUrl.startsWith('https://api.joshlei.com/v2/growagarden/image/')) {
      iconUrl = `https://api-tmyd.onrender.com/api/v3/growagarden/image/${itemId}`;
    }

    const dateStart = item?.Date_Start;
    const dateEnd = item?.Date_End;

    return {
      ...item,
      quantity: item?.quantity || 0,
      icon: iconUrl,
      Date_Start: dateStart,
      Date_End: dateEnd,
    };
  });
}

function updateStockData(data) {
  if (data.gear_stock) latestData.gear_stock = cleanItems(data.gear_stock);
  if (data.seed_stock) latestData.seed_stock = cleanItems(data.seed_stock);
  if (data.egg_stock) latestData.egg_stock = cleanItems(data.egg_stock);
  if (data.eventshop_stock) latestData.eventshop_stock = cleanItems(data.eventshop_stock);
  if (data.cosmetic_stock) latestData.cosmetics_stock = cleanItems(data.cosmetic_stock);
}
const swaggerDefinition = {
  openapi: '3.1.0',
  info: { title: 'Grow a Garden API', version: 'v3', description: 'API for Grow a Garden' },
  servers: [{ url: 'https://api-tmyd.onrender.com/', description: 'URL' }]
};
const options = {
  swaggerDefinition,
  apis: [__filename] // dùng JSDoc comment trong file này
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
function updateWeatherData(data) {
  if (data?.weather) {
    const weatherObj = {};
    for (const key in data.weather) {
      if (key === "timestamp") continue;
      const item = data.weather[key];
      if (!item) continue;

      // Rehost icon của weather nếu có
      let iconUrl = item.icon || '';
      if (iconUrl.startsWith('https://api.joshlei.com/v2/growagarden/image/')) {
        iconUrl = `https://api-tmyd.onrender.com/api/v3/growagarden/image/${item.weather_id ?? key}`;
      }

      weatherObj[item.weather_id ?? `unknown_${key}`] = {
        ...item,
        icon: iconUrl
      };
    }
    weatherObj.timestamp = Date.now();
    newData.weather = weatherObj;
  }
}

// Init data
async function initializeData() {
  try {
    const stockData = await client.stocks.all();
    logger.success('✅ Kết nối Stock API Joshlei SDK thành công');
    updateStockData(stockData);

    const weatherData = await client.weather.all();
    logger.success('✅ Kết nối Weather API Joshlei SDK thành công');
    updateWeatherData(weatherData);
  } catch (err) {
    logger.error(`❌ Lỗi khi khởi tạo: ${err}`);
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
/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Kiểm tra tình trạng API
 *   - name: Stock
 *     description: Các API liên quan tới stock
 *   - name: Weather
 *     description: Các API liên quan tới thời tiết
 *   - name: Calculation
 *     description: Tính toán giá trị fruit
 *   - name: Info
 *     description: Thông tin item
 *   - name: Image
 *     description: Ảnh item
 *   - name: Event
 *     description: Sự kiện trong game
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check
 *     tags: [Health]
 *     description: Kiểm tra API còn hoạt động hay không
 *     responses:
 *       200:
 *         description: API hoạt động bình thường
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: '200'
 */

/**
 * @swagger
 * /api/v3/growagarden/stock:
 *   get:
 *     summary: Lấy stock hiện tại
 *     tags: [Stock]
 *     description: Trả về toàn bộ dữ liệu stock hiện có
 *     responses:
 *       200:
 *         description: Dữ liệu stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /api/v3/growagarden/weather:
 *   get:
 *     summary: Lấy thời tiết hiện tại
 *     tags: [Weather]
 *     description: Trả về dữ liệu thời tiết đang diễn ra trong game
 *     responses:
 *       200:
 *         description: Dữ liệu weather
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /api/v3/growagarden/calculate:
 *   get:
 *     summary: Tính toán giá trị ước lượng hoặc thông tin fruit
 *     tags: [Calculation]
 *     description: Cung cấp Name, Weight, Variant, Mutation để tính toán
 *     parameters:
 *       - in: query
 *         name: Name
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: Weight
 *         required: true
 *         schema:
 *           type: number
 *       - in: query
 *         name: Variant
 *         required: false
 *         schema:
 *           type: string
 *       - in: query
 *         name: Mutation
 *         required: false
 *         schema:
 *           type: string
 *           description: Danh sách Mutation, phân tách bằng dấu phẩy
 *     responses:
 *       200:
 *         description: Kết quả tính toán
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /api/v3/growagarden/info/{item_id}:
 *   get:
 *     summary: Lấy thông tin chi tiết 1 item
 *     tags: [Info]
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của item cần lấy
 *     responses:
 *       200:
 *         description: Thông tin chi tiết của item
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

/**
 * @swagger
 * /api/v3/growagarden/info:
 *   get:
 *     summary: Lấy danh sách item theo type
 *     tags: [Info]
 *     parameters:
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *           description: "Loại item: seed, gear, egg, cosmetic, event, weather"
 *           enum: ["seed", "gear", "egg", "cosmetic", "event", "weather"]
 *     responses:
 *       200:
 *         description: Danh sách item
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */

/**
 * @swagger
 * /api/v3/growagarden/image/{item_id}:
 *   get:
 *     summary: Lấy ảnh item
 *     tags: [Image]
 *     parameters:
 *       - in: path
 *         name: item_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của item cần lấy ảnh
 *     responses:
 *       200:
 *         description: Trả về ảnh item
 *         content:
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 */

/**
 * @swagger
 * /api/v3/growagarden/currentevent:
 *   get:
 *     summary: Lấy sự kiện hiện tại
 *     tags: [Event]
 *     description: Trả về dữ liệu sự kiện đang diễn ra, bao gồm icon đã rehost
 *     responses:
 *       200:
 *         description: Dữ liệu event hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */

app.set('trust proxy', 1);
// Middleware
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Grow a Garden API Docs", // 👈 Đổi title tab ở đây
  })
);
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500,
  message: { error: 'Too many requests, please try again later.' },
});

// Routes

// API
app.get('/api/health', limiter, async (req, res) => {
  const endpoints = [
    `https://api-tmyd.onrender.com/api/v3/growagarden/stock`,
    `https://api-tmyd.onrender.com/api/v3/growagarden/image/cactus`,
    `https://api-tmyd.onrender.com/api/v3/growagarden/weather`
  ];

  try {
    // Test tất cả endpoint song song
    const results = await Promise.allSettled(endpoints.map(url => axios.get(url)));
    const hasFailure = results.some(r => r.status === "rejected");

    const imgFile = hasFailure ? "500.png" : "200.png";
    const imgPath = path.join(__dirname, "assets", imgFile);

    // Nếu client muốn HTML (browser) → trả trang full screen
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Health Check</title>
          <style>
            html, body {
              margin: 0;
              padding: 0;
              width: 100%;
              height: 100%;
              background: black;
            }
            img {
              width: 100%;
              height: 100%;
              object-fit: contain; /* hoặc cover */
            }
          </style>
        </head>
        <body>
          <img src="data:image/png;base64,${fs.existsSync(imgPath) ? fs.readFileSync(imgPath).toString("base64") : ""}" alt="Health Status">
        </body>
        </html>
      `);
    }

    // Còn lại (API/tool) → trả ảnh raw stream
    if (fs.existsSync(imgPath)) {
      res.setHeader("Content-Type", "image/png");
      return fs.createReadStream(imgPath).pipe(res);
    }

    return res
      .status(hasFailure ? 500 : 200)
      .json({ status: hasFailure ? "500 INTERNAL SERVER ERROR" : "200 OK" });

  } catch (err) {
    const errPath = path.join(__dirname, "assets", "500.png");
    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.send(`
        <!DOCTYPE html>
        <html><body style="margin:0;background:black;">
        <img src="data:image/png;base64,${fs.existsSync(errPath) ? fs.readFileSync(errPath).toString("base64") : ""}" style="width:100%;height:100%;object-fit:contain;">
        </body></html>
      `);
    }
    if (fs.existsSync(errPath)) {
      res.setHeader("Content-Type", "image/png");
      return fs.createReadStream(errPath).pipe(res);
    }
    res.status(500).json({ status: "failed", error: err.message });
  }
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

    if (item?.icon) {
      item.icon = item.icon.replace(
        /^https:\/\/api\.joshlei\.com\/v2\/growagarden\/image\//,
        'https://api-tmyd.onrender.com/api/v3/growagarden/image/'
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
    if (!item_id) return res.status(400).json({ error: 'Missing item_id' });

    const imageUrl = client.images.getUrl(item_id);

    const response = await axios.get(imageUrl, { responseType: 'stream' });

    res.setHeader("Content-Type", response.headers["content-type"] || "image/png");
    response.data.pipe(res);
  } catch (error) {
    const status = error.response?.status;
    if (status === 404 || status === 500) {
      const fallbackPath = path.join(__dirname, "assets", "Logo.png");
      res.setHeader("Content-Type", "image/png");
      fs.createReadStream(fallbackPath).pipe(res);
    } else {
      logger.error(`Error rehosting image: ${error.message}`);
      res.status(500).json({ error: 'Failed to rehost image' });
    }
  }
});

app.get('/api/v3/growagarden/currentevent', limiter, async (req, res) => {
  try {
    const currentEvent = await client.getCurrentEvent();

    const modifiedEvent = {
      ...currentEvent,
      current: {
        ...currentEvent.current,
        icon: currentEvent.current?.icon
          ? currentEvent.current.icon.replace(
            /^https:\/\/api\.joshlei\.com\/v2\/growagarden\/image\//,
            "https://api-tmyd.onrender.com/api/v3/growagarden/image/"
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

// Proxy ảnh (duplicate route giữ nguyên)
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
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 API server chạy ở cổng ${PORT}`);
  initializeData();
  startPolling();
});
