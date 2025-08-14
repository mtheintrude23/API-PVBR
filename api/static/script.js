tailwind.config = {
  darkMode: 'class'
}

// Mock data for testing when API fails
function mockStockData() {
  return {
    seed_stock: [
      { display_name: "Carrot", quantity: 16, icon: "https://api.joshlei.com/v2/growagarden/image/carrot", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Strawberry", quantity: 6, icon: "https://api.joshlei.com/v2/growagarden/image/strawberry", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Watermelon", quantity: 4, icon: "https://api.joshlei.com/v2/growagarden/image/watermelon", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Tomato", quantity: 2, icon: "https://api.joshlei.com/v2/growagarden/image/tomato", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Blueberry", quantity: 5, icon: "https://api.joshlei.com/v2/growagarden/image/blueberry", Date_End: new Date(Date.now() + 300000).toISOString() }
    ],
    gear_stock: [
      { display_name: "Trading Ticket", quantity: 2, icon: "https://api.joshlei.com/v2/growagarden/image/trading_ticket", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Cleaning Spray", quantity: 2, icon: "https://api.joshlei.com/v2/growagarden/image/cleaning_spray", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Favorite Tool", quantity: 3, icon: "https://api.joshlei.com/v2/growagarden/image/favorite_tool", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Recall Wrench", quantity: 2, icon: "https://api.joshlei.com/v2/growagarden/image/recall_wrench", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Watering Can", quantity: 2, icon: "https://api.joshlei.com/v2/growagarden/image/watering_can", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Harvest Tool", quantity: 3, icon: "https://api.joshlei.com/v2/growagarden/image/harvest_tool", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Trowel", quantity: 3, icon: "https://api.joshlei.com/v2/growagarden/image/trowel", Date_End: new Date(Date.now() + 300000).toISOString() },
      { display_name: "Godly Sprinkler", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/godly_sprinkler", Date_End: new Date(Date.now() + 300000).toISOString() }
    ],
    egg_stock: [
      { display_name: "Common Egg", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/common_egg", Date_End: new Date(Date.now() + 1800000).toISOString() },
      { display_name: "Common Egg", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/common_egg", Date_End: new Date(Date.now() + 1800000).toISOString() },
      { display_name: "Rare Summer Egg", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/rare_summer_egg", Date_End: new Date(Date.now() + 1800000).toISOString() }
    ],
    cosmetic_stock: [
      { display_name: "Lemonade Stand", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/lemonade_stand", Date_End: new Date(Date.now() + 14400000).toISOString() },
      { display_name: "Wheelbarrow", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/wheelbarrow", Date_End: new Date(Date.now() + 14400000).toISOString() },
      { display_name: "Small Circle Tile", quantity: 5, icon: "https://api.joshlei.com/v2/growagarden/image/small_circle_tile", Date_End: new Date(Date.now() + 14400000).toISOString() },
      { display_name: "Torch", quantity: 3, icon: "https://api.joshlei.com/v2/growagarden/image/torch", Date_End: new Date(Date.now() + 14400000).toISOString() },
      { display_name: "Small Wood Flooring", quantity: 5, icon: "https://api.joshlei.com/v2/growagarden/image/small_wood_flooring", Date_End: new Date(Date.now() + 14400000).toISOString() },
      { display_name: "Compost Bin", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/compost_bin", Date_End: new Date(Date.now() + 14400000).toISOString() },
      { display_name: "Small Stone Table", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/small_stone_table", Date_End: new Date(Date.now() + 14400000).toISOString() },
      { display_name: "Bookshelf", quantity: 1, icon: "https://api.joshlei.com/v2/growagarden/image/bookshelf", Date_End: new Date(Date.now() + 14400000).toISOString() }
    ]
  };
}

function mockWeatherData() {
  return {
    weather: [
      {
        weather_name: "Rainy",
        active: true,
        icon: "https://uxwing.com/wp-content/themes/uxwing/download/weather/rainy-icon.png",
        effects: ["Plants grow 20% faster", "Watering consumption reduced"],
        end_duration_unix: Math.floor(Date.now() / 1000) + 1800
      },
      {
        weather_name: "Sunny",
        active: true,
        icon: "https://uxwing.com/wp-content/themes/uxwing/download/weather/sun-icon.png",
        effects: ["Harvest yield increased by 10%"],
        end_duration_unix: Math.floor(Date.now() / 1000) + 3600
      }
    ]
  };
}

let activeWeathers = [];
let lastFetchTimestamp = 0;

function renderWeatherCards(weathers) {
  const container = document.getElementById('weather-card-container');
  if (!container) {
    console.error('Weather card container not found');
    return;
  }
  container.innerHTML = '';

  if (weathers.length === 0) {
    container.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex justify-between items-center mb-2">
          <h3 id="weather-name-0" class="text-lg font-medium text-gray-800 dark:text-white">Normal</h3>
          <span id="weather-timer-0" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">No active event</span>
        </div>
        <div class="flex items-center">
          <span id="weather-status-0" class="px-3 py-1 text-sm rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Inactive</span>
          <ul id="weather-effects-0" class="ml-3 text-gray-600 dark:text-gray-300">
            <li class="flex items-center">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              No active weather effects
            </li>
          </ul>
        </div>
      </div>
    `;
    return;
  }

  weathers.forEach((weather, index) => {
    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow';
    card.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h3 id="weather-name-${index}" class="text-lg font-medium text-gray-800 dark:text-white">${weather.weather_name}</h3>
        <span id="weather-timer-${index}" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Ends in: 00:00</span>
      </div>
      <div class="flex items-center">
        <span id="weather-status-${index}" class="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Active</span>
        <ul id="weather-effects-${index}" class="ml-3 text-gray-600 dark:text-gray-300">
          ${weather.effects.map(effect => `
            <li class="flex items-center">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              ${effect}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
    container.appendChild(card);
  });
}

async function fetchActiveWeather() {
  try {
    const mainRes = await fetch('https://api.joshlei.com/v2/growagarden/weather', {
      headers: {
        'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
      }
    });
    if (!mainRes.ok) throw new Error(`HTTP error! Status: ${mainRes.status}`);
    const mainData = await mainRes.json();
    activeWeathers = mainData.weather?.filter(w => w.active === true) || [];
    console.log('Fetched active weather:', activeWeathers);
    renderWeatherCards(activeWeathers);
  } catch (err) {
    console.error("Weather fetch error:", err);
    activeWeathers = mockWeatherData().weather;
    renderWeatherCards(activeWeathers);
  }
}

function updateWeatherTimer() {
  activeWeathers.forEach((weather, index) => {
    const timerEl = document.getElementById(`weather-timer-${index}`);
    const nameEl = document.getElementById(`weather-name-${index}`);
    const statusEl = document.getElementById(`weather-status-${index}`);
    const effectsEl = document.getElementById(`weather-effects-${index}`);

    if (!timerEl || !nameEl || !statusEl || !effectsEl) {
      console.warn(`Weather card elements missing for index ${index}`);
      return;
    }

    const now = Math.floor(Date.now() / 1000);
    const remaining = Math.max(0, weather.end_duration_unix - now);

    if (remaining <= 0) {
      activeWeathers.splice(index, 1);
      renderWeatherCards(activeWeathers);
    } else {
      const hours = Math.floor(remaining / 3600);
      const minutes = Math.floor((remaining % 3600) / 60);
      const seconds = remaining % 60;
      let formattedTime = `${minutes.toString().padStart(2, '0')}P:${seconds.toString().padStart(2, '0')}S`;
      if (hours > 0) {
        formattedTime = `${hours.toString().padStart(2, '0')}H:${formattedTime}`;
      }
      timerEl.textContent = `Ends in: ${formattedTime}`;
    }
  });
}

let nextRestockTimes = {
  seed: null,
  gear: null,
  egg: null,
  event: null
};

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const hours = Math.floor(totalMinutes / 60);

  let formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  if (hours > 0) {
    formatted = `${hours.toString().padStart(2, '0')}:${formatted}`;
  }
  return formatted;
}

function createOrUpdateTimer(type, remaining) {
  const timerEl = document.getElementById(`${type}-timer`);
  if (timerEl) {
    const seconds = Math.floor(remaining / 1000);
    timerEl.textContent = `Next update: ${formatTime(remaining)}`;
    timerEl.className = seconds <= 10
      ? "text-sm text-yellow-500 animate-pulse"
      : "text-sm text-white";
    console.log(`Updated ${type}-timer: ${formatTime(remaining)} (remaining: ${seconds}s)`);
  } else {
    console.warn(`Timer element ${type}-timer not found`);
  }
}

function startCountdown() {
  const storedEndTimes = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
  const now = new Date();
  Object.keys(storedEndTimes).forEach(type => {
    const endTime = new Date(storedEndTimes[type]);
    if (!isNaN(endTime) && endTime > now) {
      nextRestockTimes[type] = endTime.toISOString();
      console.log(`Restored ${type} restock time from localStorage: ${nextRestockTimes[type]}`);
    } else {
      console.log(`Invalid or expired ${type} restock time in localStorage, will fetch new data`);
    }
  });

  // Fetch initial data to ensure we have valid timers
  safeFetchStockData();
}

function updateAllTimers() {
  const now = new Date();
  let shouldFetch = false;
  ['seed', 'gear', 'egg', 'event'].forEach(type => {
    if (!nextRestockTimes[type]) {
      console.warn(`${type} restock time not set, waiting for fetch`);
      return;
    }

    const endTime = new Date(nextRestockTimes[type]);
    const remaining = Math.max(0, endTime - now);
    createOrUpdateTimer(type, remaining);

    if (remaining <= 1000) {
      console.log(`${type} restock triggered at ${new Date().toLocaleString()}, remaining: ${remaining}ms`);
      shouldFetch = true;
    }
  });

  if (shouldFetch) {
    safeFetchStockData();
  }
  requestAnimationFrame(updateAllTimers);
}

function safeFetchStockData() {
  const now = Date.now();
  if (now - lastFetchTimestamp > 5000) {
    lastFetchTimestamp = now;
    fetchStockData();
  }
}

const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function toggleDarkLightMode(isDark) {
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleIcon) {
    toggleIcon.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  } else {
    console.warn('Toggle icon element not found');
  }
}

function switchTheme(event) {
  const isDark = event.target.checked;
  document.documentElement.setAttribute('data-theme', isDark ? DARK_THEME : LIGHT_THEME);
  localStorage.setItem('theme', isDark ? DARK_THEME : LIGHT_THEME);
  document.documentElement.classList.toggle('dark', isDark);
  toggleDarkLightMode(isDark);
}

async function fetchStockData() {
  try {
    let data;
    try {
      const res = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
        headers: {
          'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
        }
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      data = await res.json();
      console.log('Fetched stock data:', JSON.stringify(data, null, 2));
    } catch (e) {
      console.log("API fetch failed, using mock stock data:", e);
      data = mockStockData();
    }

    // Update tables with new data
    updateTable('seed', data.seed_stock);
    updateTable('gear', data.gear_stock);
    updateTable('egg', data.egg_stock);
    updateTable('event', data.cosmetic_stock);

    // Process each type
    const defaultDurations = {
      seed: 300000,
      gear: 300000,
      egg: 1800000,
      event: 14400000
    };

    ['seed', 'gear', 'egg', 'event'].forEach(type => {
      const items = data[`${type === 'event' ? 'cosmetic' : type}_stock`];
      if (items && items.length > 0) {
        // Create hash based on display_name and quantity only
        const itemsForHash = items.map(item => ({
          display_name: item.display_name || 'Unknown',
          quantity: item.quantity || 0
        })).sort((a, b) => a.display_name.localeCompare(b.display_name));
        const newHash = JSON.stringify(itemsForHash);

        // Get old hash
        const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
        const oldHash = localStorage.getItem(`last${capitalType}Hash`);

        if (newHash === oldHash && nextRestockTimes[type] && new Date(nextRestockTimes[type]) > new Date()) {
          // Stock unchanged and timer still valid, keep current timer
          console.log(`${type} stock unchanged, keeping timer: ${nextRestockTimes[type]}`);
        } else {
          // Stock changed or timer invalid/expired, update with earliest Date_End
          const earliestEnd = items.reduce((min, item) => {
            const itemEnd = new Date(item.Date_End || new Date(Date.now() + defaultDurations[type]));
            return itemEnd < min ? itemEnd : min;
          }, new Date(Date.now() + defaultDurations[type]));
          nextRestockTimes[type] = earliestEnd.toISOString();
          console.log(`${type} stock changed or timer invalid, updated to: ${nextRestockTimes[type]}`);
          localStorage.setItem(`last${capitalType}Hash`, newHash);
        }
      } else {
        // No items, set default timer if not set
        if (!nextRestockTimes[type]) {
          nextRestockTimes[type] = new Date(Date.now() + defaultDurations[type]).toISOString();
          console.log(`${type} no items, set default timer: ${nextRestockTimes[type]}`);
        }
      }
    });

    document.getElementById('last-updated').textContent = new Date().toLocaleString();
    localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
    localStorage.setItem('lastFetchTime', new Date().toISOString());
  } catch (e) {
    console.error("Error fetching stock data:", e);
    const connectionStatus = document.getElementById('connection-status');
    if (connectionStatus) {
      connectionStatus.className = "bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center";
      connectionStatus.innerHTML = '<span class="w-2 h-2 bg-white rounded-full mr-2"></span>Disconnected';
    }
  }
}

function updateTable(type, items) {
  if (!items) {
    console.warn(`No items provided for ${type} table`);
    return;
  }
  const total = items.reduce((a, b) => a + (b.quantity || 0), 0);
  const countEl = document.getElementById(`${type}-count`);
  const labelEl = document.getElementById({
    seed: 'seed-varieties',
    gear: 'gear-categories',
    egg: 'egg-types',
    event: 'event-upcoming'
  }[type]);
  const body = document.getElementById(`${type}-table-body`);

  if (countEl) countEl.textContent = total;
  if (labelEl) labelEl.textContent = items.length;
  if (!body) {
    console.warn(`Table body for ${type} not found`);
    return;
  }

  body.innerHTML = '';
  items.forEach(item => {
    const icon = item.icon ? `<img src="${item.icon}" class="w-8 h-8 rounded-full mr-2" alt="${item.display_name || 'item'}">` : '';
    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-200 dark:border-gray-700";
    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="flex items-center">${icon}<span class="text-gray-800 dark:text-white">${item.display_name || 'Unknown'}</span></div>
      </td>
      <td class="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">${item.quantity || 0}</td>
    `;
    body.appendChild(tr);
  });

  // Save items to localStorage for restoration
  localStorage.setItem(`last${type.charAt(0).toUpperCase() + type.slice(1)}Hash`, JSON.stringify(items.map(item => ({
    display_name: item.display_name || 'Unknown',
    quantity: item.quantity || 0
  })).sort((a, b) => a.display_name.localeCompare(b.display_name))));
}

function restoreFromLocalStorage() {
  try {
    ['seed', 'gear', 'egg', 'event'].forEach(type => {
      const storedData = localStorage.getItem(`last${type.charAt(0).toUpperCase() + type.slice(1)}Hash`);
      if (storedData) {
        updateTable(type, JSON.parse(storedData));
        console.log(`Restored ${type} from localStorage`);
      }
    });
  } catch (e) {
    console.error("Error restoring from localStorage:", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('theme-toggle');
  if (!toggleSwitch) console.warn('Theme toggle element not found');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.classList.toggle('dark', currentTheme === DARK_THEME);
  if (toggleSwitch) {
    toggleSwitch.checked = currentTheme === DARK_THEME;
    toggleSwitch.addEventListener('change', switchTheme);
  }
  toggleDarkLightMode(currentTheme === DARK_THEME);

  restoreFromLocalStorage();
  fetchActiveWeather();
  setInterval(fetchActiveWeather, 60000);
  setInterval(updateWeatherTimer, 1000);

  startCountdown();
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastTheme', document.documentElement.getAttribute('data-theme'));
});
