const stockTypes = ['seed', 'gear', 'egg', 'cosmetic'];

const defaultDurations = {
  seed: 300000, // 5 minutes
  gear: 300000, // 5 minutes
  egg: 1800000, // 30 minutes
  cosmetic: 14400000 // 4 hours
};

let nextRestockTimes = {
  seed: null,
  gear: null,
  egg: null,
  cosmetic: null
};

const timerFlags = {};
let activeWeathers = [];
let lastFetchTimestamp = 0;
let lastTimerUpdate = 0;
const DARK_THEME = 'dark';
const LIGHT_THEME = 'light';

// Khởi tạo nếu chưa có
stockTypes.forEach(type => {
  if (!nextRestockTimes[type]) {
    nextRestockTimes[type] = new Date(Date.now() + defaultDurations[type]).toISOString();
  }
  timerFlags[type] = false;
});

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
      { item_id: "rainy", display_name: "Rainy", active: true, icon: "https://uxwing.com/wp-content/themes/uxwing/download/weather/rainy-icon.png", description: "Plants grow faster in the rain!", duration: "1800", last_seen: Math.floor(Date.now() / 1000).toString() },
      { item_id: "sunny", display_name: "Sunny", active: true, icon: "https://uxwing.com/wp-content/themes/uxwing/download/weather/sun-icon.png", description: "Bright sun boosts your harvest!", duration: "3600", last_seen: Math.floor(Date.now() / 1000).toString() },
      { item_id: "nightevent", display_name: "Night Event", active: true, icon: "https://api.joshlei.com/v2/growagarden/image/nightevent", description: "Your fruit can become MOONLIT!", duration: "600", last_seen: Math.floor(Date.now() / 1000).toString() }
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
    const jstudio = 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'; // Thay bằng key thực tế
    const response = await fetch(url, {
      headers: {
        'jstudio-key': jstudio,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data
  } catch (err) {
    console.error(`Error fetching description for weather ${weatherId}:`, err);
    return '';
  }
}

function renderWeatherCards(weathers) {
  const container = document.getElementById('weather-card-container');
  if (!container) {
    console.error('Weather card container not found');
    return;
  }
  container.innerHTML = '';

  if (!Array.isArray(weathers) || weathers.length === 0) {
    container.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            <h3 id="weather-name-0" class="text-lg font-medium text-gray-800 dark:text-white">Normal</h3>
          </div>
          <span id="weather-timer-0" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">No active event</span>
        </div>
        <div class="flex items-center">
          <span id="weather-status-0" class="px-3 py-1 text-sm rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Inactive</span>
        </div>
      </div>
    `;
    return;
  }

  weathers.forEach((weather, index) => {
    if (!weather || !weather.display_name) return;

    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow';

    // Header
    const header = document.createElement('div');
    header.className = 'flex justify-between items-center mb-2';
    header.innerHTML = `
      <div class="flex items-center">
        ${weather.icon ? `<img src="${weather.icon}" class="w-6 h-6 mr-2 rounded-full" alt="${weather.display_name} icon" onerror="this.style.display='none'">` : ''}
        <h3 id="weather-name-${index}" class="text-lg font-medium text-gray-800 dark:text-white">${weather.display_name}</h3>
      </div>
      <span id="weather-timer-${index}" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">Ends in: Calculating...</span>
    `;
    card.appendChild(header);

    // Status
    const statusWrapper = document.createElement('div');
    statusWrapper.className = 'flex items-center mb-2';
    statusWrapper.innerHTML = `
      <span id="weather-status-${index}" class="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Active</span>
    `;
    card.appendChild(statusWrapper);

    // Description
    const descWrapper = document.createElement('div');
    descWrapper.className = 'flex items-center';
    const descP = document.createElement('p');
    descP.className = 'text-gray-600 dark:text-gray-300 whitespace-pre-wrap';
    descP.textContent = Array.isArray(weather.description)
      ? weather.description.join("\n")
      : (weather.description || 'No description available');
    descWrapper.appendChild(descP);
    card.appendChild(descWrapper);

    container.appendChild(card);
  });
}

async function fetchActiveWeather() {
  try {
    const response = await fetch('https://api-yvj3.onrender.com/api/v3/growagarden/weather');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (!data || typeof data !== 'object') throw new Error('Invalid weather data format');

    // Bỏ timestamp, convert object → array
    const weatherArray = Object.entries(data)
      .filter(([key]) => key !== 'timestamp')
      .map(([_, value]) => value);

    // Lọc active = true
    const activeList = weatherArray.filter(w => w.active === true);

    activeWeathers = await Promise.all(
      activeList.map(async (w) => {
        let weather = {
          item_id: w.weather_id || '',
          display_name: w.weather_name || '',
          icon: w.icon || '',
          description: w.description || '', // thường rỗng
          active: true,
          start_time_unix: w.start_time_unix || Math.floor(Date.now() / 1000),
          end_duration_unix: w.end_duration_unix || Math.floor(Date.now() / 1000) + (w.duration || 3600)
        };
        if (weather.item_id !== 'unknown') {
          try {
            const effect = await fetchWeatherEffects(weather.item_id);
            if (effect && effect.description) {
              weather.description = effect.description;
            }
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
    let cached = JSON.parse(localStorage.getItem('activeWeathers') || '[]');
    activeWeathers = cached.filter(w => w.active && w.end_duration_unix > Math.floor(Date.now() / 1000));
    if (!activeWeathers.length) {
      activeWeathers = mockWeatherData().weather.filter(w => w.active === true);
    }

    renderWeatherCards(activeWeathers);
  }
}


function updateWeatherTimer() {
  if (!Array.isArray(activeWeathers) || !activeWeathers.length) {
    return;
  }

  let hasChanges = false;
  const now = Math.floor(Date.now() / 1000);
  activeWeathers = activeWeathers.filter((weather, index) => {
    const timerEl = document.getElementById(`weather-timer-${index}`);
    if (!timerEl || !weather || !weather.end_duration_unix) {
      return false;
    }

    const remaining = Math.max(0, weather.end_duration_unix - now);

    if (remaining <= 0) {
      hasChanges = true;
      return false;
    }

    const hours = Math.floor(remaining / 3600);
    const minutes = Math.floor((remaining % 3600) / 60);
    const seconds = remaining % 60;
    const formattedTime = hours > 0
      ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timerEl.textContent = `Ends in: ${formattedTime}`;
    return true;
  });

  if (hasChanges) {
    renderWeatherCards(activeWeathers);
    try {
      localStorage.setItem('activeWeathers', JSON.stringify(activeWeathers));
    } catch (e) {
      console.error('updateWeatherTimer: Error saving activeWeathers to localStorage:', e);
    }
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
    return;
  }
  el.textContent = `Next update: ${formatTime(remaining)}`;
  el.className = remaining <= 10000
    ? "text-sm text-yellow-500 animate-pulse"
    : "text-sm text-white";
}

async function fetchEggStock(isInitial = false) {
  const now = Date.now();
  if (!isInitial && now - lastFetchTimestamp < 30000) {
    return;
  }
  lastFetchTimestamp = now;

  try {
    const url = `https://api.joshlei.com/v2/growagarden/stock`;
    const jstudio = 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'; // Thay bằng key thực tế
    const response = await fetch(url, {
      headers: {
        'jstudio-key': jstudio,
        'Content-Type': 'application/json'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const items = Array.isArray(data.egg_stock) ? data.egg_stock : [];
    updateTable('egg', items);
    updateRestockTime('egg', items);
  } catch (e) {
    console.error('fetchEggStock: Fetch egg stock failed:', e);
    const mockData = mockStockData();
    updateTable('egg', mockData.egg_stock);
    updateRestockTime('egg', mockData.egg_stock);
  }
}

async function fetchSeedGearStock(isInitial = false) {
  const now = Date.now();
  if (!isInitial && now - lastFetchTimestamp < 30000) {
    return;
  }
  lastFetchTimestamp = now;

  try {
    const response = await fetch('https://api-yvj3.onrender.com/api/v3/growagarden/stock');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const seedItems = Array.isArray(data.seed_stock) ? data.seed_stock : [];
    const gearItems = Array.isArray(data.gear_stock) ? data.gear_stock : [];
    updateTable('seed', seedItems);
    updateTable('gear', gearItems);
    updateRestockTime('seed', seedItems);
    updateRestockTime('gear', gearItems);
  } catch (e) {
    console.error('fetchSeedGearStock: Fetch seed and gear stock failed:', e);
    const mockData = mockStockData();
    updateTable('seed', mockData.seed_stock);
    updateTable('gear', mockData.gear_stock);
    updateRestockTime('seed', mockData.seed_stock);
    updateRestockTime('gear', mockData.gear_stock);
  }
}

async function fetchCosmeticStock(isInitial = false) {
  const now = Date.now();
  if (!isInitial && now - lastFetchTimestamp < 30000) {
    return;
  }
  lastFetchTimestamp = now;

  try {
    const response = await fetch('https://api-yvj3.onrender.com/api/v3/growagarden/stock');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const items = Array.isArray(data.cosmetics_stock) ? data.cosmetics_stock : [];
    updateTable('cosmetic', items);
    updateRestockTime('cosmetic', items);
  } catch (e) {
    console.error('fetchCosmeticStock: Fetch cosmetic stock failed:', e);
    const mockData = mockStockData();
    updateTable('cosmetic', mockData.cosmetic_stock);
    updateRestockTime('cosmetic', mockData.cosmetic_stock);
  }
}

function updateRestockTime(type, items) {
  const stored = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
  const now = Date.now();
  let earliest = null;

  if (Array.isArray(items) && items.length > 0) {
    const validDates = items
      .map(i => i.Date_End ? new Date(i.Date_End).getTime() : null)
      .filter(t => t && !isNaN(t));
    if (validDates.length) {
      earliest = new Date(Math.min(...validDates));
    }
  }

  if (!earliest && stored[type] && new Date(stored[type]).getTime() > now) {
    earliest = new Date(stored[type]);
  }

  if (!earliest) {
    earliest = new Date(now + defaultDurations[type]);
  }

  nextRestockTimes[type] = earliest.toISOString();
  localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));

  // Tính remaining để hiển thị
  const remainingMs = Math.max(0, earliest.getTime() - now);
  createOrUpdateTimer(type, remainingMs);

  // Update last updated time
  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) {
    lastUpdatedEl.textContent = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
  }
}

function updateSeedGearTimer(type) {
  const now = Date.now();
  const endTime = nextRestockTimes[type] ? new Date(nextRestockTimes[type]) : null;
  const remaining = endTime && !isNaN(endTime.getTime()) ? Math.max(0, endTime - now) : 0;
  createOrUpdateTimer(type, remaining);

  if (remaining <= 0 && !timerFlags[type]) {
    timerFlags[type] = true;
    setTimeout(() => {
      if (now - lastFetchTimestamp >= 5000) {
        fetchSeedGearStock().finally(() => {
          try {
            const stored = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
            const savedTime = stored[type] ? new Date(stored[type]) : null;
            nextRestockTimes[type] = (savedTime && savedTime > now)
              ? savedTime.toISOString()
              : new Date(now + defaultDurations[type]).toISOString();
            localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
          } catch (e) {
            console.error(`updateSeedGearTimer: Error saving restockEndTimes for ${type}:`, e);
          } finally {
            timerFlags[type] = false;
          }
        });
      } else {
        timerFlags[type] = false;
      }
    }, 5000);
  }
}

function updateEggTimer(type) {
  const now = Date.now();
  const endTime = nextRestockTimes[type] ? new Date(nextRestockTimes[type]) : null;
  const remaining = endTime && !isNaN(endTime.getTime()) ? Math.max(0, endTime - now) : 0;
  createOrUpdateTimer(type, remaining);

  if (remaining <= 0 && !timerFlags[type]) {
    timerFlags[type] = true;
    setTimeout(() => {
      const fetchTime = Date.now();
      if (fetchTime - lastFetchTimestamp >= 5000) {
        lastFetchTimestamp = fetchTime;
        fetchEggStock().finally(() => {
          try {
            const stored = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
            const savedTime = stored[type] ? new Date(stored[type]) : null;
            // Ưu tiên thời gian từ localStorage nếu còn hợp lệ, nếu không thì chờ fetchEggStock cập nhật
            if (!nextRestockTimes[type] || (savedTime && savedTime > fetchTime)) {
              nextRestockTimes[type] = savedTime ? savedTime.toISOString() : new Date(fetchTime + defaultDurations[type]).toISOString();
            }
            try {
              localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
            } catch (e) {
              console.error(`updateEggTimer: Lỗi lưu restockEndTimes cho ${type}:`, e);
              window.restockEndTimes = { ...nextRestockTimes }; // Dự phòng in-memory
            }
          } catch (e) {
            console.error(`updateEggTimer: Lỗi parse restockEndTimes cho ${type}:`, e);
          } finally {
            timerFlags[type] = false;
          }
        });
      } else {
        timerFlags[type] = false;
      }
    }, 5000);
  }
}

function updateCosmeticTimer(type) {
  const now = Date.now();
  const endTime = nextRestockTimes[type] ? new Date(nextRestockTimes[type]) : null;
  const remaining = endTime && !isNaN(endTime.getTime()) ? Math.max(0, endTime - now) : 0;
  createOrUpdateTimer(type, remaining);

  if (remaining <= 0 && !timerFlags[type]) {
    timerFlags[type] = true;
    setTimeout(() => {
      if (now - lastFetchTimestamp >= 5000) {
        fetchCosmeticStock().finally(() => {
          try {
            const stored = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
            const savedTime = stored[type] ? new Date(stored[type]) : null;
            nextRestockTimes[type] = (savedTime && savedTime > now)
              ? savedTime.toISOString()
              : new Date(now + defaultDurations[type]).toISOString();
            localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
          } catch (e) {
            console.error(`updateCosmeticTimer: Error saving restockEndTimes for ${type}:`, e);
          } finally {
            timerFlags[type] = false;
          }
        });
      } else {
        timerFlags[type] = false;
      }
    }, 5000);
  }
}

function updateAllTimers() {
  const now = Date.now();
  if (now - lastTimerUpdate < 1000) {
    requestAnimationFrame(updateAllTimers);
    return;
  }
  lastTimerUpdate = now;

  stockTypes.forEach((type) => {
    if (type === 'seed' || type === 'gear') {
      updateSeedGearTimer(type);
    } else if (type === 'egg') {
      updateEggTimer(type);
    } else if (type === 'cosmetic') {
      updateCosmeticTimer(type);
    }
  });

  requestAnimationFrame(updateAllTimers);
}

function updateTable(type, items) {
  if (!stockTypes.includes(type)) {
    console.error(`updateTable: Invalid stock type: ${type}`);
    return;
  }

  if (!Array.isArray(items)) {
    items = [];
  }

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

  if (!countEl || !labelEl || !body) {
    return;
  }

  countEl.textContent = total;
  labelEl.textContent = items.length;
  body.innerHTML = '';
  items.sort((a, b) => (a.display_name || '').localeCompare(b.display_name || '')).forEach(item => {
    if (!item.display_name) {
      return;
    }
    const icon = item.icon ? `<img src="${item.icon}" class="w-8 h-8 rounded-full mr-2" alt="${item.display_name}" onerror="this.style.display='none'">` : '';
    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-200 dark:border-gray-700";
    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="flex items-center">${icon}<span class="text-gray-800 dark:text-white">${item.display_name}</span></div>
      </td>
      <td class="px-4 py-3 text-gray-800 dark:text-white">${item.quantity || 0}</td>
    `;
    body.appendChild(tr);
  });
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
        updateTable(type, JSON.parse(storedData));
      }
    });

    const storedWeathers = localStorage.getItem('activeWeathers');
    if (storedWeathers) {
      activeWeathers = JSON.parse(storedWeathers);
      const now = Math.floor(Date.now() / 1000);
      activeWeathers = activeWeathers.map(w => ({
        ...w,
        display_name: w.display_name || w.name || w.title || 'Unknown Weather',
        item_id: w.weather_id || w.item_id || 'unknown'
      })).filter(weather => weather && weather.active === true && weather.end_duration_unix > now);
      renderWeatherCards(activeWeathers);
    }
  } catch (e) {
    console.error('restoreFromLocalStorage: Error restoring from localStorage:', e);
  }
}

function startCountdown() {
  const stored = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
  const now = new Date();

  stockTypes.forEach(type => {
    const savedTime = stored[type] && new Date(stored[type]);
    if (savedTime && !isNaN(savedTime.getTime()) && savedTime > now) {
      nextRestockTimes[type] = savedTime.toISOString();
    } else {
      nextRestockTimes[type] = new Date(now.getTime() + defaultDurations[type]).toISOString();
    }
  });

  try {
    localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
  } catch (e) {
    console.error('startCountdown: Error saving restockEndTimes to localStorage:', e);
  }

  updateAllTimers();
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
  fetchActiveWeather();
  setInterval(fetchActiveWeather, 60000);
  setInterval(updateWeatherTimer, 1000);
  startCountdown();
  fetchSeedGearStock(true);
  fetchEggStock(true);
  fetchCosmeticStock(true);

  setInterval(() => {
    fetchSeedGearStock();
    fetchEggStock();
    fetchCosmeticStock();
  }, 300000);
});

window.addEventListener('beforeunload', () => {
  try {
    localStorage.setItem('lastTheme', document.documentElement.getAttribute('data-theme'));
  } catch (e) {
    console.error('Error saving lastTheme to localStorage:', e);
  }
});
