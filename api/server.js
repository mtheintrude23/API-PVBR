// Required dependencies
import express from 'express';
import { WebSocket } from 'ws';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// In-memory data store
let latestData = {
  weather: {},
  gearStock: [],
  seedsStock: [],
  eggStock: [],
  eventStock: [],
  cosmeticsStock: [],
};

let newData = {
  weather: {},
};

// Helper functions
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
}

function combineItemsByName(items) {
  const combined = {};
  for (const item of items) {
    const name = item.name;
    combined[name] = (combined[name] || 0) + (item.quantity || 0);
  }
  return Object.entries(combined).map(([name, quantity]) => ({
    name,
    quantity,
    item_id: normalizeName(name)
  }));
}

function cleanItems(items) {
  return items; // Modify if needed later
}

// WebSocket Listeners
async function websocketListener(uri, updateFn) {
  while (true) {
    try {
      const ws = new WebSocket(uri);

      ws.on('open', () => console.log(`✅ WebSocket Connected: ${uri}`));

      ws.on('message', (message) => {
        const data = JSON.parse(message);
        updateFn(data);
      });

      await new Promise((resolve, reject) => {
        ws.on('close', () => {
          console.log(`🔌 WebSocket disconnected: ${uri}`);
          resolve();
        });
        ws.on('error', (err) => {
          console.error(`❌ WebSocket error: ${err}`);
          resolve();
        });
      });
    } catch (err) {
      console.error(`❌ Failed to connect WebSocket: ${err}`);
    }

    await new Promise((res) => setTimeout(res, 5000));
  }
}

function updateStockData(data) {
  if (data.gear_stock) latestData.gearStock = cleanItems(data.gear_stock);
  if (data.seed_stock) latestData.seedsStock = cleanItems(data.seed_stock);
  if (data.egg_stock) latestData.eggStock = cleanItems(data.egg_stock);
  if (data.eventshop_stock) latestData.eventStock = cleanItems(data.eventshop_stock);
  if (data.cosmetic_stock) latestData.cosmeticsStock = cleanItems(data.cosmetic_stock);
}

function updateWeatherData(data) {
  if (data.weather) newData.weather = data.weather;
}

// Launch WebSocket listeners
websocketListener('wss://websocket.joshlei.com/growagarden?user_id=1390149379561885817/', updateStockData);
websocketListener('wss://websocket.joshlei.com/growagarden?user_id=1266035019390914649/', updateWeatherData);

// Middleware
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please try again later.' }
});

// Routes
app.get('/stocks', (req, res) => {
  res.sendFile(path.join(__dirname, 'stock.html'));
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api', limiter, (req, res) => {
  res.json({ status: '200' });
});

app.get('/api/stock', limiter, (req, res) => {
  res.json(latestData);
});

app.get('/api/stock/weather', limiter, (req, res) => {
  res.json(newData);
});

// Start Server
const PORT = process.env.PORT || 80;
app.listen(PORT, () => console.log(`🚀 API server running on port ${PORT}`));
