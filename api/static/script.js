const stockTypes = ['seed', 'gear', 'egg', 'cosmetic'];

const defaultDurations = {
  seed: 300000, // 5 phút
  gear: 300000, // 5 phút
  egg: 1800000, // 30 phút
  cosmetic: 14400000 // 4 giờ
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

async function fetchWeatherEffects(weatherId) {
  if (!weatherId) {
    return null;
  }
  try {
    const response = await fetch(`https://api.joshlei.com/v2/growagarden/info/${weatherId}`, {
      headers: {
        'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
      }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    return data; // ⚡ Quan trọng: trả về kết quả API
  } catch (err) {
    return null;
  }
}

function renderWeatherCards(weathers) {
  const container = document.getElementById('weather-card-container');
  if (!container) return;
  container.innerHTML = '';

  if (!Array.isArray(weathers) || weathers.length === 0) {
    container.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="flex justify-between items-center mb-2">
          <div class="flex items-center">
            <h3 class="text-lg font-medium text-gray-800 dark:text-white">Normal</h3>
          </div>
          <span class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">No active event</span>
        </div>
        <div class="flex items-center">
          <span class="px-3 py-1 text-sm rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">Inactive</span>
        </div>
      </div>
    `;
    return;
  }

  weathers.forEach((weather, index) => {
    if (!weather) return;

    const name = weather.display_name || "Unknown Weather";
    const description = weather.description && weather.description.trim() !== ""
      ? weather.description
      : "No description available";

    const card = document.createElement('div');
    card.className = 'bg-white dark:bg-gray-800 rounded-lg p-4 shadow';

    card.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <div class="flex items-center">
          ${weather.icon ? `<img src="${weather.icon}" class="w-6 h-6 mr-2 rounded-full" alt="${name} icon" onerror="this.style.display='none'">` : ''}
          <h3 class="text-lg font-medium text-gray-800 dark:text-white">${name}</h3>
        </div>
        <span id="weather-timer-${index}" class="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          Ends in: Calculating...
        </span>
      </div>
      <div class="flex items-center">
        <span class="px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">Active</span>
        <p class="ml-3 text-gray-600 dark:text-gray-300">${description}</p>
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

    if (!data || !Array.isArray(data.weather)) throw new Error('Invalid weather data format');

    // Lọc active = true và lấy dữ liệu cơ bản
    const activeList = data.weather.filter(w => w.active === true);

    activeWeathers = await Promise.all(
      activeList.map(async (w) => {
        let weather = {
          item_id: w.weather_id || '',
          display_name: w.display_name || '',
          icon: w.icon || '',
          description: w.description || '',   // Nếu API đã có description thì lấy luôn
          active: true,
          start_time_unix: w.start_time_unix || Math.floor(Date.now() / 1000),
          end_duration_unix: w.end_duration_unix || Math.floor(Date.now() / 1000) + 3600
        };

        // Nếu chưa có description và item_id hợp lệ thì gọi fetchEffect
        if (!weather.description && weather.weather_id !== 'unknown') {
          try {
            const effect = await fetchWeatherEffects(weather.weather_id);
            weather.description = (effect && effect.description) ? effect.description : 'No description available';
            weather.display_name = (effect && effect.display_name) ? effect.display_name: 'UnKnown';
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
  if (!Array.isArray(activeWeathers) || !activeWeathers.length) return;

  let hasChanges = false;
  activeWeathers = activeWeathers.filter((weather, index) => {
    const timerEl = document.getElementById(`weather-timer-${index}`);
    if (!timerEl || !weather || !weather.end_duration_unix) return false;

    const now = Math.floor(Date.now() / 1000);
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
    } catch (e) {}
  }
}

const nextRestockTimes = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
const timerFlags = {}; // ngăn reset nhiều lần

// Khởi tạo nếu chưa có
stockTypes.forEach(type => {
  if (!nextRestockTimes[type]) {
    nextRestockTimes[type] = new Date(Date.now() + defaultDurations[type]).toISOString();
  }
});

// --- FORMAT TIME ---
function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);
  return hours > 0
    ? `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`
    : `${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;
}

// --- UPDATE TIMER ELEMENT ---
function createOrUpdateTimer(type, remaining) {
  const el = document.getElementById(`${type}-timer`);
  if (!el) return;
  el.textContent = `Next update: ${formatTime(remaining)}`;
  el.className = remaining <= 10000
    ? "text-sm text-yellow-500 animate-pulse"
    : "text-sm text-white";
}

// --- FETCH DATA FUNCTIONS ---
async function fetchSeedGearStock() {
  try {
    const res = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
      headers: { 'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    updateTable('seed', data.seed_stock || []);
    updateTable('gear', data.gear_stock || []);
    updateRestockTime('seed', data.seed_stock || []);
    updateRestockTime('gear', data.gear_stock || []);
  } catch(e) {
    const mock = mockStockData();
    updateTable('seed', mock.seed_stock);
    updateTable('gear', mock.gear_stock);
  }
}

async function fetchEggStock() {
  try {
    const res = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
      headers: { 'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    updateTable('egg', data.egg_stock || []);
    updateRestockTime('egg', data.egg_stock || []);
  } catch(e) {
    updateTable('egg', mockStockData().egg_stock);
  }
}

async function fetchCosmeticStock() {
  try {
    const res = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
      headers: { 'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272' }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    updateTable('cosmetic', data.cosmetic_stock || []);
    updateRestockTime('cosmetic', data.cosmetic_stock || []);
  } catch(e) {
    updateTable('cosmetic', mockStockData().cosmetic_stock);
  }
}

// --- UPDATE RESTOCK TIME ---
function updateRestockTime(type, items) {
  if (!stockTypes.includes(type)) return;
  if (!Array.isArray(items)) items = [];

  let earliestEnd = items.length > 0
    ? items.reduce((min, i) => i.Date_End ? (new Date(i.Date_End) < min ? new Date(i.Date_End) : min) : min, new Date(items[0].Date_End))
    : new Date(Date.now() + defaultDurations[type]);

  if (isNaN(earliestEnd.getTime())) {
    earliestEnd = new Date(Date.now() + defaultDurations[type]);
  }

  nextRestockTimes[type] = earliestEnd.toISOString();
  localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));

  const lastUpdatedEl = document.getElementById('last-updated');
  if (lastUpdatedEl) lastUpdatedEl.textContent = new Date().toLocaleString();
}

// --- UPDATE ALL TIMERS ---
function updateAllTimers() {
  const now = new Date();

  stockTypes.forEach(type => {
    const endTime = nextRestockTimes[type] ? new Date(nextRestockTimes[type]) : null;
    const remaining = endTime ? Math.max(0, endTime - now) : defaultDurations[type];
    createOrUpdateTimer(type, remaining);

    if (remaining <= 0 && !timerFlags[type]) {
      timerFlags[type] = true;

      const fetchFn = type === 'seed' || type === 'gear' ? fetchSeedGearStock
                     : type === 'egg' ? fetchEggStock
                     : fetchCosmeticStock;

      fetchFn().finally(() => {
        const newEnd = new Date(Date.now() + defaultDurations[type]);
        nextRestockTimes[type] = newEnd.toISOString();
        localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
        timerFlags[type] = false;
      });
    }
  });

  requestAnimationFrame(updateAllTimers);
}


function updateTable(type, items = []) {
  const typeToIdMap = {
    seed: 'seed-varieties',
    gear: 'gear-categories',
    egg: 'egg-types',
    cosmetic: 'cosmetic-types'
  };

  const total = items.reduce((sum, { quantity = 0 }) => sum + quantity, 0);
  const countEl = document.getElementById(`${type}-count`);
  const labelEl = document.getElementById(typeToIdMap[type]);
  const body = document.getElementById(`${type}-table-body`);

  if (!countEl || !labelEl || !body) return;

  // Cập nhật số lượng
  countEl.textContent = total;
  labelEl.textContent = items.length;
  body.innerHTML = '';
  items.sort((a, b) => a.display_name.localeCompare(b.display_name));
  for (const { display_name, quantity = 0, icon } of items) {
    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-200 dark:border-gray-700";

    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="flex items-center">
          ${icon ? `<img src="${icon}" 
                      class="w-8 h-8 rounded-full mr-2" 
                      alt="${display_name}" 
                      onerror="this.remove()">` : ''}
          <span class="text-gray-800 dark:text-white">${display_name}</span>
        </div>
      </td>
      <td class="px-4 py-3 text-gray-800 dark:text-white">${quantity}</td>
    `;

    body.appendChild(tr);
  }
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
  }, 300000);
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastTheme', document.documentElement.getAttribute('data-theme'));
});
