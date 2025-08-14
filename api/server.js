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
  gearStock: [],
  seedsStock: [],
  eggStock: [],
  eventStock: [],
  cosmeticsStock: [],
};

let newData = {
  weather: [] // Holds multiple weather entries
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
  return items;
}

// WebSocket Listener
async function websocketListener(uri, updateFn) {
  while (true) {
    try {
      const ws = new WebSocket(uri);

      ws.on('open', () => console.log(`✅ WebSocket Connected: ${uri}`));

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message);
          updateFn(data);
        } catch (err) {
          console.error('❌ Failed to parse message:', err);
        }
      });

      await new Promise((resolve) => {
        ws.on('close', (code, reason) => {
          console.log(`🔌 Disconnected: code=${code}, reason=${reason.toString()}`);
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

// Data update functions
function updateStockData(data) {
  if (data.gear_stock) latestData.gearStock = cleanItems(data.gear_stock);
  if (data.seed_stock) latestData.seedsStock = cleanItems(data.seed_stock);
  if (data.egg_stock) latestData.eggStock = cleanItems(data.egg_stock);
  if (data.eventshop_stock) latestData.eventStock = cleanItems(data.eventshop_stock);
  if (data.cosmetic_stock) latestData.cosmeticsStock = cleanItems(data.cosmetic_stock);
}

function updateWeatherData(data) {
  if (data.weather) {
    const entry = {
      timestamp: Date.now(),
      ...data.weather
    };
    newData.weather.push(entry);

    // Limit to 100 most recent entries
    if (newData.weather.length > 100) {
      newData.weather.shift(); // Remove oldest
    }
  }
}

// Start WebSocket
const websocketKey = 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272';
websocketListener(
  `wss://websocket.joshlei.com/growagarden?jstudio-key=${websocketKey}`,
  (data) => {
    if (data.weather) updateWeatherData(data);
    else updateStockData(data);
  }
);

// Middleware
app.use(cors());
app.use('/assets', express.static(path.join(__dirname, 'assets
