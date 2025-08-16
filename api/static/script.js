const stockTypes = ['seed', 'gear', 'egg', 'cosmetic'];

const defaultDurations = {
  seed: 300000, // 5 phút
  gear: 300000, // 5 phút
  egg: 1800000, // 30 phút
  cosmetic: 14400000 // 4 giờ
};

let nextRestockTimes = {
  seed: null,
  gear: null,
  egg: null,
  cosmetic: null
};

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
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

function renderWeatherCards(weathers) {
  const container = document.getElementById('weather-card-container');
  if (!container) {
    console.error('Weather card container not found');
    return;
  }
  container.innerHTML = '';

  if (!weathers?.length) {
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
        <span id="weather-timer-${index}" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Ends in: Calculating...</span>
      </div>
      <div class="flex items-center">
        <span id="weather-status-${index}" class="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Active</span>
        <ul id="weather-effects-${index}" class="ml-3 text-gray-600 dark:text-gray-300">
          ${weather.effects?.map(effect => `
            <li class="flex items-center">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              ${effect}
            </li>
          `).join('') || '<li>No effects available</li>'}
        </ul>
      </div>
    `;
    container.appendChild(card);
  });
}

async function fetchActiveWeather() {
  try {
    const response = await fetch('https://api.joshlei.com/v2/growagarden/weather', {
      headers: {
        'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('Weather data fetched:', data); // Debug log
    activeWeathers = data.weather?.filter(w => w.active) || [];
    renderWeatherCards(activeWeathers);
  } catch (err) {
    console.error("Weather fetch error:", err);
    activeWeathers = mockWeatherData().weather;
    renderWeatherCards(activeWeathers);
  }
}

function updateWeatherTimer() {
  if (!activeWeathers?.length) return;

  activeWeathers = activeWeathers.filter((weather, index) => {
    const timerEl = document.getElementById(`weather-timer-${index}`);
    if (!timerEl) return false;

    const now = Math.floor(Date.now() / 1000);
    const remaining = Math.max(0, weather.end_duration_unix - now);

    if (remaining <= 0) {
      return false;
    }

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    const formattedTime = hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}S`
      : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}S`;
    timerEl.textContent = `Ends in: ${formattedTime}`;
    return true;
  });

  if (activeWeathers.length !== document.querySelectorAll('[id^="weather-timer-"]').length) {
    renderWeatherCards(activeWeathers);
  }
}

function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return hours > 0
    ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function createOrUpdateTimer(type, remaining) {
  const el = document.getElementById(`${type}-timer`);
  if (!el) {
    console.error(`Timer element for ${type} not found`);
    return;
  }
  el.textContent = `Next update: ${formatTime(remaining)}`;
  el.className = remaining <= 10000
    ? "text-sm text-yellow-500 animate-pulse"
    : "text-sm text-white";
}

async function fetchSeedGearStock() {
  try {
    const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
      headers: {
        'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('Seed and Gear stock data fetched:', data); // Debug log
    
    const seedItems = data.seed_stock || [];
    const gearItems = data.gear_stock || [];
    
    updateTable('seed', seedItems);
    updateTable('gear', gearItems);
    
    updateRestockTime('seed', seedItems);
    updateRestockTime('gear', gearItems);
  } catch (e) {
    console.error('Fetch seed and gear stock failed, using mock data:', e);
    const mockData = mockStockData();
    updateTable('seed', mockData.seed_stock);
    updateTable('gear', mockData.gear_stock);
  }
}

async function fetchEggStock() {
  try {
    const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
      headers: {
        'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('Egg stock data fetched:', data); // Debug log
    const items = data.egg_stock || [];
    updateTable('egg', items);
    updateRestockTime('egg', items);
  } catch (e) {
    console.error('Fetch egg stock failed, using mock data:', e);
    updateTable('egg', mockStockData().egg_stock);
  }
}

async function fetchCosmeticStock() {
  try {
    const response = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
      headers: {
        'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    console.log('Cosmetic stock data fetched:', data); // Debug log
    const items = data.cosmetic_stock || [];
    updateTable('cosmetic', items);
    updateRestockTime('cosmetic', items);
  } catch (e) {
    console.error('Fetch cosmetic stock failed, using mock data:', e);
    updateTable('cosmetic', mockStockData().cosmetic_stock);
  }
}

function updateRestockTime(type, items) {
  if (items.length > 0) {
    const earliestEnd = items.reduce((min, i) => {
      const d = new Date(i.Date_End);
      return d < min ? d : min;
    }, new Date(items[0].Date_End));

    nextRestockTimes[type] = earliestEnd.toISOString();
    const stripped = items.map(({ Date_End, ...rest }) => rest)
      .sort((a, b) => a.display_name.localeCompare(b.display_name));
    localStorage.setItem(`last${type.charAt(0).toUpperCase() + type.slice(1)}Hash`, JSON.stringify(stripped));
  } else {
    console.warn(`No items for ${type}, setting default restock time`);
    nextRestockTimes[type] = new Date(Date.now() + defaultDurations[type]).toISOString();
  }
  localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
  document.getElementById('last-updated')?.textContent = new Date().toLocaleString();
}

function updateAllTimers() {
  const now = new Date();
  
  stockTypes.forEach(type => {
    const endTime = nextRestockTimes[type] ? new Date(nextRestockTimes[type]) : null;
    const remaining = endTime ? Math.max(0, endTime - now) : defaultDurations[type];
    createOrUpdateTimer(type, remaining);

    if (remaining <= 1000) {
      console.log(`Restock time reached for ${type}, fetching new data`); // Debug log
      const newEnd = new Date(now.getTime() + defaultDurations[type]);
      nextRestockTimes[type] = newEnd.toISOString();
      localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
      
      if (type === 'seed' || type === 'gear') {
        fetchSeedGearStock();
      } else if (type === 'egg') {
        fetchEggStock();
      } else if (type === 'cosmetic') {
        fetchCosmeticStock();
      }
    }
  });

  requestAnimationFrame(updateAllTimers);
}

function updateTable(type, items) {
  const total = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const countEl = document.getElementById(`${type}-count`);
  const labelEl = document.getElementById({
    seed: 'seed-varieties',
    gear: 'gear-categories',
    egg: 'egg-types',
    cosmetic: 'cosmetic-types'
  }[type]);
  const body = document.getElementById(`${type}-table-body`);

  if (!countEl || !labelEl || !body) {
    console.error(`Element missing for ${type}: countEl=${!!countEl}, labelEl=${!!labelEl}, body=${!!body}`);
    return;
  }

  countEl.textContent = total;
  labelEl.textContent = items.length;
  body.innerHTML = '';
  items.sort((a, b) => a.display_name.localeCompare(b.display_name)).forEach(item => {
    const icon = item.icon ? `<img src="${item.icon}" class="w-8 h-8 rounded-full mr-2" alt="${item.display_name}" onerror="this.style.display='none'">` : '';
    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-200 dark:border-gray-700";
    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="flex items-center">${icon}<span class="text-gray-800 dark:text-white">${item.display_name}</span></div>
      </td>
      <td class="px-4 py-3 text-gray-800 dark:text-white">${item.quantity}</td>
    `;
    body.appendChild(tr);
  });
  console.log(`Table updated for ${type}: ${items.length} items, total quantity: ${total}`); // Debug log
}

function toggleDarkLightMode(isDark) {
  const toggleIcon = document.getElementById('toggle-icon');
  if (toggleIcon) {
    toggleIcon.textContent = isDark ? 'Dark Mode' : 'Light Mode';
  }
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
    stockTypes.forEach(type => {
      const storedData = localStorage.getItem(`last${type.charAt(0).toUpperCase() + type.slice(1)}Hash`);
      if (storedData) {
        console.log(`Restoring ${type} from localStorage`); // Debug log
        updateTable(type, JSON.parse(storedData));
      }
    });
  } catch (e) {
    console.error("Error restoring from localStorage:", e);
  }
}

function startCountdown() {
  const stored = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
  const now = new Date();

  stockTypes.forEach(type => {
    const savedTime = stored[type];
    nextRestockTimes[type] = (savedTime && new Date(savedTime) > now)
      ? savedTime
      : new Date(now.getTime() + defaultDurations[type]).toISOString();
  });

  updateAllTimers();
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, initializing...'); // Debug log
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
  fetchActiveWeather();
  setInterval(fetchActiveWeather, 60000);
  setInterval(updateWeatherTimer, 1000);
  startCountdown();
  fetchSeedGearStock();
  fetchEggStock();
  fetchCosmeticStock();

  // Làm mới stock định kỳ
  setInterval(() => {
    console.log('Periodic stock refresh triggered'); // Debug log
    fetchSeedGearStock();
    fetchEggStock();
    fetchCosmeticStock();
  }, 60000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastTheme', document.documentElement.getAttribute('data-theme'));
});
