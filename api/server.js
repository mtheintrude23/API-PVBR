
import express from 'express';
import cors from 'cors';
import { DateTime } from 'luxon';
import fs from "fs";
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';
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
  seed_stock: []
};

/* let newData = { weather: [] };*/

// Helpers
function normalizeName(name) {
  if (!name) return 'unknown';
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_seed$/, '');
}

function cleanItems(items) {
  return (Array.isArray(items) ? items : []).map(item => {
    const itemId = item?.item_id || normalizeName(item?.name ?? item?.display_name ?? 'unknown');
    let iconUrl = item?.icon || '';
    if (iconUrl.startsWith('https://api.joshlei.com/v2/growagarden/image/')) {
      iconUrl = `https://api-tmyd.onrender.com/api/v3/growagarden/image/${itemId}`;
    }

    const nowUtc = DateTime.utc();
    const roundedUtc = nowUtc.set({ second: 0, millisecond: 0 }).minus({ minutes: nowUtc.minute % 5 }); // làm tròn xuống bội số của 5 phút

    const startUtc = roundedUtc;
    const endUtc = startUtc.plus({ minutes: 5 });

    const startUnix = Math.floor(startUtc.toSeconds());
const endUnix = Math.floor(endUtc.toSeconds());

    return {
      id: itemId,
      name: item?.name || item?.display_name || "Unknown",
      quantity: item?.stock || 0,
      /* icon: iconUrl,*/
      Date_Start: startUtc.toISO(),
      Date_End: startUtc.plus({ minutes: 5 }).toISO(),
      start_time_unix: startUnix,
      end_time_unix: endUnix
    };
  });
}

function updateStockData(data) {
  if (data.gear_stock) latestData.gear_stock = cleanItems(data.gear_stock);
  if (data.seed_stock) latestData.seed_stock = cleanItems(data.seed_stock)
}
/* function updateMerchantData(data) {
  if (data.travelingmerchant_stock) latestData.travelingmerchant_stock = cleanItems(data.travelingmerchant_stock);
}*/
/* function updateWeatherData(data) {
  if (data?.weather) {
    for (const key in data.weather) {
      if (key === "timestamp") continue;
      const item = data.weather[key];
      if (!item) continue;
      let iconUrl = item.icon || '';
      if (iconUrl.startsWith('https://api.joshlei.com/v2/growagarden/image/')) {
        iconUrl = `https://api-tmyd.onrender.com/api/v3/growagarden/image/${item.weather_id ?? key}`;
      }
      newData.weather.push({
        ...item,
        icon: iconUrl,
        weather_id: item.weather_id ?? `unknown_${key}`
      });
    }
    newData.timestamp = Date.now();
  }
  return newData;
}*/
const swaggerDefinition = {
  openapi: '3.1.0',
  info: { title: 'Grow a Garden API', version: 'v3', description: 'API for Grow a Garden' }
};
const options = {
  swaggerDefinition,
  apis: ["./server.js"] // dùng JSDoc comment trong file này
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Init data
import fetch from "node-fetch";

async function initializeData() {
  try {
    const res = await fetch("https://stock-apis.vercel.app/api/plantsvsbrainrots/stocks");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const stockData = await res.json();

    logger.success("✅ Kết nối Stock API thành công");
    updateStockData(stockData);
  } catch (err) {
    logger.error(`❌ Lỗi khi khởi tạo Stock Data: ${err.message}`);
  }
}

// Poll fallback
function startPolling() {
  setInterval(async () => {
    try {
      const res = await fetch("https://stock-apis.vercel.app/api/plantsvsbrainrots/stocks");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const stockData = await res.json();

      updateStockData(stockData);
      logger.success("✅ Cập nhật Stock Data thành công");
    } catch (err) {
      logger.error("❌ Lỗi polling Stock API:", err.message);
    }
  }, 60000);
}
/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Kiểm tra tình trạng API
 *   - name: Stock
 *     description: Stock API
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
 * /api/v3/plantsvsbrainrots/stock:
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


app.set('trust proxy', 1);
// Middleware
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: "Plants Vs Brainrots API Docs", // 👈 Đổi title tab ở đây
  })
);
const limiter = (req, res, next) => {
  // Cho phép tất cả request đi qua, không giới hạn
  next();
};

// Routes

// API
/* app.get("/vietnam-today", (req, res) => {
  res.sendFile(path.join(__dirname, "baodientu.html")); 
  // news.html là file HTML bạn đã có sẵn
});*/ 
app.get("/", (req, res) => {
  res.redirect(`${req.protocol}://${req.get("host")}/docs`);
});

app.get("/api/health", limiter, async (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  const endpoints = [
    `${baseUrl}/api/plantsvsbrainrots/stock`,
    /*`${baseUrl}/api/plantsvsbrainrots/image/cactus`,*/
    // `${baseUrl}/api/plantsvsbrainrots/weather`  /* Bỏ weather */
    // `${baseUrl}/api/plantsvsbrainrots/info`     /* Bỏ info */
  ];

  try {
    const results = await Promise.allSettled(endpoints.map(url => axios.get(url)));
    const hasFailure = results.some(r => r.status === "rejected");

    const imgFile = hasFailure ? "500.png" : "200.png";
    const imgPath = path.join(__dirname, "assets", imgFile);

    if (req.headers.accept && req.headers.accept.includes("text/html")) {
      return res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>Health Check</title>
          <style>
            html, body {margin:0;padding:0;width:100%;height:100%;background:black;}
            img {width:100%;height:100%;object-fit:contain;}
          </style>
        </head>
        <body>
          <img src="data:image/png;base64,${fs.existsSync(imgPath) ? fs.readFileSync(imgPath).toString("base64") : ""}" alt="Health Status">
        </body>
        </html>
      `);
    }

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

app.get("/api/v3/plantsvsbrainrots/stock", limiter, (req, res) => {
  res.json(latestData);
});

/* app.get('/api/v3/growagarden/weather', limiter, (req, res) => {
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
    if (!item_id) return res.status(400).json({ error: `Invalid request: "item_id" is required. Usage: ${req.protocol}://${req.get('host')}/api/v3/growagarden/info/YOUR_ITEM_ID` });
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
      gear: 'gear',
      weather: 'weather',
    };
    const allowed = new Set([
      'seed', 'seeds',
      'gear',
      'egg', 'eggs',
      'cosmetic', 'cosmetics',
      'event', 'events',
      'weather'
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

    // 🔥 Rehost icon từ domain của bạn
    const host = `${req.protocol}://${req.get("host")}`;
    const updatedItems = (items || []).map(item => {
      return {
        ...item,
        icon: `${host}/api/v3/growagarden/image/${item.item_id}`
      };
    });

    res.json({
      type: normalizedType || 'all',
      count: updatedItems.length,
      items: updatedItems
    });
  } catch (error) {
    logger.error(`Error fetching items list: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch items list' });
  }
});


app.get('/api/v3/growagarden/image/:item_id', limiter, async (req, res) => {
  try {
    const { item_id } = req.params;
    if (!item_id) return res.status(400).json({ error: `Invalid request: "item_id" is required. Usage: ${req.protocol}://${req.get('host')}/api/v3/growagarden/image/YOUR_ITEM_ID` });

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
});*/
app.get('/api/v3/plantsvsbrainrots/gameinfo', limiter, async (req, res) => {
  const universeId = 8316902627;

  try {
    https.get(`https://games.roblox.com/v1/games?universeIds=${universeId}`, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          res.json(jsonData);
        } catch (err) {
          logger.error("❌ Lỗi parse JSON:", err.message);
          res.status(500).json({ error: "Failed to parse Roblox API response" });
        }
      });

    }).on("error", (err) => {
      logger.error("❌ Lỗi gọi API Roblox:", err.message);
      res.status(500).json({ error: "Failed to fetch Roblox API" });
    });
  } catch (error) {
    logger.error("❌ Lỗi Roblox endpoint:", error.message);
    res.status(500).json({ error: "Unexpected error" });
  }
});

// Proxy ảnh (duplicate route giữ nguyên)
/* app.get('/api/v3/growagarden/image/:item_id', async (req, res) => {
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
});*/
// ======= XỬ LÝ 404 =======
app.use((req, res, next) => {
  res.status(404).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error Page</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js"></script>
    <script src="https://unpkg.com/feather-icons"></script>
    <style>
        .gradient-text {
            background: linear-gradient(90deg, #ef4444, #f97316);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
    </style>
</head>
<body class="bg-gray-50 min-h-screen flex items-center justify-center">
    <div class="max-w-md w-full p-8 bg-white rounded-xl shadow-lg text-center" data-aos="fade-up">
        <div class="mb-6">
            <i data-feather="alert-triangle" class="w-16 h-16 text-red-500 mx-auto"></i>
        </div>
        <h1 class="text-3xl font-bold gradient-text mb-2">404 Error</h1>
        <h2 class="text-xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
        
        <div class="bg-gray-100 p-4 rounded-lg mb-6 text-left">
            <div class="flex items-center mb-2">
                <i data-feather="alert-circle" class="w-5 h-5 text-yellow-500 mr-2"></i>
                <span class="font-medium">Warning:</span>
            </div>
            <p class="text-gray-600">Target URL returned error 404: Not Found</p>
            <p class="text-gray-500 text-sm mt-2">Cannot GET ${req.originalUrl}</p>
        </div>

        <div class="space-y-4">
            <a href="/docs" class="block w-full px-4 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-medium hover:opacity-90 transition">
                Go to Homepage
            </a>
            <button onclick="window.location.href='/docs'" class="w-full px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition">
                Go Back
            </button>
        </div>
    </div>

    <script>
        AOS.init();
        feather.replace();
    </script>
</body>
</html>
  `);
});
// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 API server chạy ở cổng ${PORT}`);
  initializeData();
  startPolling();
});
