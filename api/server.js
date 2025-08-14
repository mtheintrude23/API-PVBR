import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import fs from 'fs';
import path from 'path';
import jstudio from 'jstudio';
import logger from 'console-wizard';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const client = jstudio.connect('js_4ece47b66df9cf728ed9a0508e82c9b66af86e5a988e5461bcd0e487eaead8a2');

// In-memory data store
let latestData = {
  gearStock: [],
  seedsStock: [],
  eggStock: [],
  eventStock: [],
  cosmeticsStock: [],
};

let newData = {
  weather: [] // Array to hold multiple weather entries
};

// Helper functions
function normalizeName(name) {
  return name.trim().toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, '_');
}

function combineItemsByName(items) {
  const combined = {};
  for (const item of items) {
    const name = item.name || item.display_name; // Handle both 'name' and 'display_name'
    combined[name] = (combined[name] || 0) + (item.quantity || 0);
  }
  return Object.entries(combined).map(([name, quantity]) => ({
    name,
    quantity,
    item_id: normalizeName(name)
  }));
}

function cleanItems(items) {
  return items.map(item => ({
    ...item,
    name: item.name || item.display_name, // Normalize name field
    quantity: item.quantity || 0,
    icon: item.icon || '',
    Date_End: item.Date_End || new Date(Date.now() + 300000).toISOString() // Default Date_End
  }));
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

// Initialize data and set up jstudio listeners
async function initializeData() {
  try {
    // Fetch initial stock data
    const stockData = await client.stocks.all();
    logger.success('Kết nối đến API Stock thành công'); // Debug
    updateStockData(stockData);

    // Fetch initial weather data
    const weatherData = await client.weather.all();
    logger.success('Kết nối đến API Weather thành công'); // Debug
    updateWeatherData(weatherData);
  } catch (error) {
    logger.error('Error initializing data:', error);
  }
}

// Fallback: Polling if jstudio doesn't support real-time events
function startPolling() {
  setInterval(async () => {
    try {
      const stockData = await client.stocks.all();
      updateStockData(stockData);

      const weatherData = await client.weather.all();
      updateWeatherData(weatherData);
    } catch (error) {
      logger.error('Error polling data:', error);
    }
  }, 60000); // Poll every 60 seconds
}

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
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'home.html'));
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

app.get('/api/weather', limiter, (req, res) => {
  res.json(newData.weather);
});

// Start server and initialize data
const PORT = process.env.PORT || 443;
app.listen(PORT, '0.0.0.0', () => {
  logger.info(`🚀 API server running on port ${PORT}`);
  initializeData(); // Initialize data on server start
  startPolling(); // Start polling as fallback
});
