const { DateTime, Duration } = luxon;
const stockTypes = ['seed', 'gear', 'egg', 'cosmetic'];
const defaultDurations = {
  seed: 300000, // 5 minutes
  gear: 300000, // 5 minutes
  egg: 1800000, // 30 minutes
  cosmetic: 14400000 // 4 hours
};
let nextRestockTimes = { seed: null, gear: null, egg: null, cosmetic: null };
let timerIntervals = {};
let activeWeathers = [];
let lastFetchTimestamp = 0;
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function normalizeName(name) {
  return name.toLowerCase().replace(/\s+/g, '_');
}

function formatDuration(ms) {
  return Duration.fromMillis(ms).toFormat('hh:mm:ss');
}

function createOrUpdateTimer(type, remainingMs) {
  const el = document.getElementById(`${type}-timer`);
  if (!el) return;

  if (timerIntervals[type]) clearInterval(timerIntervals[type]);

  const update = () => {
    if (remainingMs <= 0) {
      clearInterval(timerIntervals[type]);
      el.textContent = `${type.toUpperCase()} Restock: Now`;
      updateRestockTimesFromAPI();
      return;
    }
    el.textContent = `${type.toUpperCase()} Restock: ${formatDuration(remainingMs)}`;
    el.className = remainingMs <= 10000 ? "timer text-yellow-500 animate-pulse" : "timer text-gray-800 dark:text-white";
    remainingMs -= 1000;
  };

  update();
  timerIntervals[type] = setInterval(update, 1000);
}

function updateWeatherTimer() {
  if (!Array.isArray(activeWeathers) || !activeWeathers.length) return;

  let hasChanges = false;
  const now = DateTime.now().setZone('Asia/Ho_Chi_Minh').toUnixInteger();
  activeWeathers = activeWeathers.filter((weather, index) => {
    const timerEl = document.getElementById(`weather-timer-${index}`);
    if (!timerEl || !weather || !weather.end_duration_unix) return false;

    const remaining = Math.max(0, weather.end_duration_unix - now);
    if (remaining <= 0) {
      hasChanges = true;
      return false;
    }

    timerEl.textContent = `Ends in: ${formatDuration(remaining * 1000)}`;
    return true;
  });

  if (hasChanges) {
    renderWeatherCards(activeWeathers);
    try {
      localStorage.setItem('activeWeathers', JSON.stringify(activeWeathers));
    } catch (e) {
      console.error('updateWeatherTimer: Error saving activeWeathers:', e);
    }
  }
}

function mockStockData() {
  const now = DateTime.now().setZone('Asia/Ho_Chi_Minh');
  return {
    seed_stock: [
      { display_name: "Carrot", quantity: 16, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/carrot", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Strawberry", quantity: 6, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/strawberry", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Watermelon", quantity: 4, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/watermelon", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Tomato", quantity: 2, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/tomato", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Blueberry", quantity: 5, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/blueberry", Date_End: now.plus({ milliseconds: 300000 }).toISO() }
    ],
    gear_stock: [
      { display_name: "Trading Ticket", quantity: 2, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/trading_ticket", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Cleaning Spray", quantity: 2, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/cleaning_spray", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Favorite Tool", quantity: 3, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/favorite_tool", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Recall Wrench", quantity: 2, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/recall_wrench", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Watering Can", quantity: 2, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/watering_can", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Harvest Tool", quantity: 3, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/harvest_tool", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Trowel", quantity: 3, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/trowel", Date_End: now.plus({ milliseconds: 300000 }).toISO() },
      { display_name: "Godly Sprinkler", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/godly_sprinkler", Date_End: now.plus({ milliseconds: 300000 }).toISO() }
    ],
    egg_stock: [
      { display_name: "Common Egg", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/common_egg", Date_End: now.plus({ milliseconds: 1800000 }).toISO() },
      { display_name: "Common Egg", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/common_egg", Date_End: now.plus({ milliseconds: 1800000 }).toISO() },
      { display_name: "Rare Summer Egg", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/rare_summer_egg", Date_End: now.plus({ milliseconds: 1800000 }).toISO() }
    ],
    cosmetics_stock: [
      { display_name: "Lemonade Stand", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/lemonade_stand", Date_End: now.plus({ milliseconds: 14400000 }).toISO() },
      { display_name: "Wheelbarrow", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/wheelbarrow", Date_End: now.plus({ milliseconds: 14400000 }).toISO() },
      { display_name: "Small Circle Tile", quantity: 5, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/small_circle_tile", Date_End: now.plus({ milliseconds: 14400000 }).toISO() },
      { display_name: "Torch", quantity: 3, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/torch", Date_End: now.plus({ milliseconds: 14400000 }).toISO() },
      { display_name: "Small Wood Flooring", quantity: 5, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/small_wood_flooring", Date_End: now.plus({ milliseconds: 14400000 }).toISO() },
      { display_name: "Compost Bin", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/compost_bin", Date_End: now.plus({ milliseconds: 14400000 }).toISO() },
      { display_name: "Small Stone Table", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/small_stone_table", Date_End: now.plus({ milliseconds: 14400000 }).toISO() },
      { display_name: "Bookshelf", quantity: 1, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/bookshelf", Date_End: now.plus({ milliseconds: 14400000 }).toISO() }
    ]
  };
}

function mockWeatherData() {
  const now = DateTime.now().setZone('Asia/Ho_Chi_Minh');
  return {
    weather: [
      { item_id: "rainy", display_name: "Rainy", active: true, icon: "https://uxwing.com/wp-content/themes/uxwing/download/weather/rainy-icon.png", description: "Plants grow faster in the rain!", duration: 1800, end_duration_unix: now.plus({ seconds: 1800 }).toUnixInteger() },
      { item_id: "sunny", display_name: "Sunny", active: true, icon: "https://uxwing.com/wp-content/themes/uxwing/download/weather/sun-icon.png", description: "Bright sun boosts your harvest!", duration: 3600, end_duration_unix: now.plus({ seconds: 3600 }).toUnixInteger() },
      { item_id: "nightevent", display_name: "Night Event", active: true, icon: "https://api-yvj3.onrender.com/api/v3/growagarden/image/nightevent", description: "Your fruit can become MOONLIT!", duration: 600, end_duration_unix: now.plus({ seconds: 600 }).toUnixInteger() }
    ]
  };
}

async function fetchWeatherEffects(weatherId) {
  if (!weatherId) {
    console.error('fetchWeatherEffects: weatherId is undefined or empty');
    return '';
  }
  try {
    const url = `https://api.joshlei.com/v2/growagarden/info/${weatherId}`;
    const jstudio = 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272';
    const response = await fetch(url, { headers: { 'jstudio-key': jstudio, 'Content-Type': 'application/json' } });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error(`Error fetching description for weather ${weatherId}:`, err);
    return '';
  }
}

function renderWeatherCards(weathers) {
  const container = document.getElementById('weather-card-container');
  if (!container) return console.error('Weather card container not found');

  container.innerHTML = '';
  if (!Array.isArray(weathers) || !weathers.length) {
    container.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex justify-between items-center mb-2">
          <h3 id="weather-name-0" class="text-lg font-medium text-gray-800 dark:text-white">Normal</h3>
          <span id="weather-timer-0" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">No active event</span>
        </div>
        <div class="flex items-center">
          <span id="weather-status-0" class="px-3 py-1 text-sm rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Inactive</span>
        </div>
      </div>`;
    return;
  }

  weathers.forEach((weather, index) => {
    if (!weather || !weather.display_name) return;
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow';
    card.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          ${weather.icon ? `<img src="${weather.icon}" class="w-6 h-6 mr-2 rounded-full" alt="${weather.display_name} icon" onerror="this.style.display='none'">` : ''}
          <h3 id="weather-name-${index}" class="text-lg font-medium text-gray-800 dark:text-white">${weather.display_name}</h3>
        </div>
        <span id="weather-timer-${index}" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Ends in: ${formatDuration((weather.end_duration_unix - DateTime.now().setZone('Asia/Ho_Chi_Minh').toUnixInteger()) * 1000)}</span>
      </div>
      <div class="flex items-center mb-2">
        <span id="weather-status-${index}" class="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Active</span>
      </div>
      <div class="flex items-center">
        <p class="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">${Array.isArray(weather.description) ? weather.description.join("\n") : (weather.description || 'No description available')}</p>
      </div>`;
    container.appendChild(card);
  });
}

async function fetchActiveWeather() {
  try {
    const response = await fetch('https://api-yvj3.onrender.com/api/v3/growagarden/weather');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    if (!data || typeof data !== 'object') throw new Error('Invalid weather data format');

    const weatherArray = Object.entries(data)
      .filter(([key]) => key !== 'timestamp')
      .map(([_, value]) => value);

    activeWeathers = await Promise.all(
      weatherArray.filter(w => w.active === true).map(async w => {
        let weather = {
          item_id: w.weather_id || '',
          display_name: w.weather_name || '',
          icon: w.icon || '',
          description: w.description || '',
          active: true,
          start_time_unix: w.start_time_unix || DateTime.now().setZone('Asia/Ho_Chi_Minh').toUnixInteger(),
          end_duration_unix: w.end_duration_unix || DateTime.now().setZone('Asia/Ho_Chi_Minh').plus({ seconds: w.duration || 3600 }).toUnixInteger()
        };
        if (weather.item_id !== 'unknown') {
          try {
            const effect = await fetchWeatherEffects(weather.item_id);
            if (effect && effect.description) weather.description = effect.description;
          } catch (e) {
            console.warn(`Could not fetch effect for ${weather.item_id}:`, e.message);
          }
        }
        return weather;
      })
    );

    localStorage.setItem('activeWeathers', JSON.stringify(activeWeathers));
    renderWeatherCards(activeWeathers);
  } catch (err) {
    console.error('Weather fetch error:', err.message);
    activeWeathers = JSON.parse(localStorage.getItem('activeWeathers') || '[]')
      .filter(w => w.active && w.end_duration_unix > DateTime.now().setZone('Asia/Ho_Chi_Minh').toUnixInteger());
    if (!activeWeathers.length) activeWeathers = mockWeatherData().weather.filter(w => w.active);
    renderWeatherCards(activeWeathers);
  }
}

function updateTable(type, items) {
  if (!stockTypes.includes(type)) return console.error(`updateTable: Invalid stock type: ${type}`);
  if (!Array.isArray(items)) items = [];

  const typeToIdMap = {
    seed: 'seed-varieties',
    gear: 'gear-categories',
    egg: 'egg-types',
    cosmetic: 'cosmetic-types'
  };

  const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const countEl = document.getElementById(`${type}-count`);
  const labelEl = document.getElementById(typeToIdMap[type]);
  const body = document.getElementById(`${type}-table-body`);

  if (!countEl || !labelEl || !body) return;

  countEl.textContent = total;
  labelEl.textContent = items.length;
  body.innerHTML = '';
  items.sort((a, b) => (a.display_name || '').localeCompare(b.display_name || '')).forEach(item => {
    if (!item.display_name) return;
    const icon = item.icon ? `<img src="${item.icon}" class="w-8 h-8 rounded-full mr-2" alt="${item.display_name}" onerror="this.style.display='none'">` : '';
    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-200 dark:border-gray-700";
    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="flex items-center">${icon}<span class="text-gray-800 dark:text-white">${item.display_name}</span></div>
      </td>
      <td class="px-4 py-3 text-gray-800 dark:text-white">${item.quantity || 0}</td>`;
    body.appendChild(tr);
  });

  try {
    localStorage.setItem(`last${type.charAt(0).toUpperCase() + type.slice(1)}Hash`, JSON.stringify(items));
  } catch (e) {
    console.error(`updateTable: Error saving ${type} to localStorage:`, e);
  }
}

async function updateRestockTimesFromAPI() {
  const now = DateTime.now().setZone('Asia/Ho_Chi_Minh');
  if (now.toMillis() - lastFetchTimestamp < 5000) return;

  lastFetchTimestamp = now.toMillis();
  try {
    const res = await fetch("https://api-yvj3.onrender.com/api/v3/growagarden/stock");
    if (!res.ok) throw new Error(`API error: ${res.status}`);
    const data = await res.json();

    const typeMap = {
      seed: data.seed_stock,
      gear: data.gear_stock,
      egg: data.egg_stock,
      cosmetic: data.cosmetics_stock
    };

    stockTypes.forEach(type => {
      let earliest = null;
      const items = Array.isArray(typeMap[type]) ? typeMap[type] : [];
      updateTable(type, items);

      if (items.length > 0) {
        const validDates = items
          .map(i => i.Date_End ? DateTime.fromISO(i.Date_End).setZone('Asia/Ho_Chi_Minh').toMillis() : null)
          .filter(t => t && !isNaN(t) && t > now.toMillis());
        if (validDates.length) {
          earliest = DateTime.fromMillis(Math.min(...validDates)).setZone('Asia/Ho_Chi_Minh');
        }
      }

      if (!earliest) {
        earliest = now.plus({ milliseconds: defaultDurations[type] });
      }

      const earliestFormatted = earliest.toISO({ includeOffset: true });
      nextRestockTimes[type] = earliestFormatted;
      console.log(`updateRestockTimesFromAPI: ${type} - nextRestockTimes: ${nextRestockTimes[type]}`);
      createOrUpdateTimer(type, earliest.toMillis() - now.toMillis());
    });

    try {
      localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
    } catch (e) {
      console.error("updateRestockTimesFromAPI: Error saving restockEndTimes:", e);
      window.restockEndTimes = { ...nextRestockTimes };
    }

    const lastUpdatedEl = document.getElementById('last-updated');
    if (lastUpdatedEl) {
      lastUpdatedEl.textContent = `Last Updated: ${now.toFormat('yyyy-MM-dd HH:mm:ss')}`;
    }
  } catch (err) {
    console.error("updateRestockTimesFromAPI: Fetch failed:", err);
    const mockData = mockStockData();
    stockTypes.forEach(type => {
      updateTable(type, mockData[`${type}_stock`]);
      const earliest = now.plus({ milliseconds: defaultDurations[type] });
      nextRestockTimes[type] = earliest.toISO({ includeOffset: true });
      createOrUpdateTimer(type, defaultDurations[type]);
    });
    try {
      localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
    } catch (e) {
      console.error("updateRestockTimesFromAPI: Error saving mock restockEndTimes:", e);
    }
  }
}

function toggleDarkLightMode(isDark) {
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleIcon) toggleIcon.textContent = isDark ? 'Dark Mode' : 'Light Mode';
}

function switchTheme(event) {
  const isDark = event.target.checked;
  document.documentElement.setAttribute('data-theme', isDark ? DARK_THEME : LIGHT_THEME);
  document.documentElement.classList.toggle('dark', isDark);
  localStorage.setItem('theme', isDark ? DARK_THEME : LIGHT_THEME);
  toggleDarkLightMode(isDark);
}

function restoreFromLocalStorage() {
  try {
    const now = DateTime.now().setZone('Asia/Ho_Chi_Minh').toMillis();
    const storedTimes = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
    stockTypes.forEach(type => {
      const savedTime = storedTimes[type] ? DateTime.fromISO(storedTimes[type]).setZone('Asia/Ho_Chi_Minh') : null;
      if (savedTime && savedTime.isValid && savedTime.toMillis() > now) {
        nextRestockTimes[type] = savedTime.toISO({ includeOffset: true });
        createOrUpdateTimer(type, savedTime.toMillis() - now);
      } else {
        nextRestockTimes[type] = DateTime.now().setZone('Asia/Ho_Chi_Minh').plus({ milliseconds: defaultDurations[type] }).toISO({ includeOffset: true });
        createOrUpdateTimer(type, defaultDurations[type]);
      }

      const storedData = localStorage.getItem(`last${type.charAt(0).toUpperCase() + type.slice(1)}Hash`);
      if (storedData) updateTable(type, JSON.parse(storedData));
    });

    activeWeathers = JSON.parse(localStorage.getItem('activeWeathers') || '[]')
      .filter(w => w.active && w.end_duration_unix > DateTime.now().setZone('Asia/Ho_Chi_Minh').toUnixInteger());
    renderWeatherCards(activeWeathers);
  } catch (e) {
    console.error('restoreFromLocalStorage: Error restoring from localStorage:', e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || LIGHT_THEME;
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.classList.toggle('dark', currentTheme === DARK_THEME);
  if (toggleSwitch) {
    toggleSwitch.checked = currentTheme === DARK_THEME;
    toggleSwitch.addEventListener('change', switchTheme);
  }
  toggleDarkLightMode(currentTheme === DARK_THEME);

  restoreFromLocalStorage();
  updateRestockTimesFromAPI();
  fetchActiveWeather();
  setInterval(updateRestockTimesFromAPI, 5 * 60 * 1000); // Update stock every 5 minutes
  setInterval(fetchActiveWeather, 60 * 1000); // Update weather every 1 minute
  setInterval(updateWeatherTimer, 1000); // Update weather timer every second
});

window.addEventListener('beforeunload', () => {
  try {
    localStorage.setItem('lastTheme', document.documentElement.getAttribute('data-theme'));
  } catch (e) {
    console.error('Error saving lastTheme to localStorage:', e);
  }
});
