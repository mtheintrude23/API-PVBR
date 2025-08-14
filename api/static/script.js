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
    const mainData = await mainRes.json();
    activeWeathers = mainData.weather?.filter(w => w.active === true) || [];
    renderWeatherCards(activeWeathers);
  } catch (err) {
    console.error("Weather error:", err);
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

    if (!timerEl || !nameEl || !statusEl || !effectsEl) return;

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
  }
}

function startCountdown() {
  const storedEndTimes = JSON.parse(localStorage.getItem('restockEndTimes') || '{}');
  const now = new Date();
  Object.keys(storedEndTimes).forEach(type => {
    const endTime = new Date(storedEndTimes[type]);
    if (endTime > now) {
      nextRestockTimes[type] = endTime.toISOString();
    } else {
      const defaultTimes = {
        seed: new Date(now.getTime() + 300000),
        gear: new Date(now.getTime() + 300000),
        egg: new Date(now.getTime() + 1800000),
        event: new Date(now.getTime() + 14400000)
      };
      nextRestockTimes[type] = defaultTimes[type].toISOString();
      safeFetchStockData();
    }
  });

  const defaultTimes = {
    seed: new Date(now.getTime() + 300000),
    gear: new Date(now.getTime() + 300000),
    egg: new Date(now.getTime() + 1800000),
    event: new Date(now.getTime() + 14400000)
  };

  ['seed', 'gear', 'egg', 'event'].forEach(type => {
    if (!nextRestockTimes[type]) {
      nextRestockTimes[type] = defaultTimes[type].toISOString();
    }
  });

  updateAllTimers();
}

function updateAllTimers() {
  const now = new Date();
  let shouldFetch = false;
  ['seed', 'gear', 'egg', 'event'].forEach(type => {
    if (!nextRestockTimes[type]) {
      const defaultTime = new Date(now.getTime() + (
        type === 'seed' ? 300000 :
        type === 'gear' ? 300000 :
        type === 'egg' ? 1800000 :
        14400000
      ));
      nextRestockTimes[type] = defaultTime.toISOString();
      console.log(`Initialized ${type} restock time:`, nextRestockTimes[type]);
    }

    const endTime = new Date(nextRestockTimes[type]);
    const remaining = Math.max(0, endTime - now);
    createOrUpdateTimer(type, remaining);

    // Chỉ reset nếu thời gian còn lại thực sự <= 1 giây
    if (remaining <= 1000) {
      console.log(`${type} restock triggered at ${new Date().toLocaleString()}, remaining: ${remaining}ms`);
      const newEndTime = new Date(now.getTime() + (
        type === 'seed' ? 300000 :
        type === 'gear' ? 300000 :
        type === 'egg' ? 1800000 :
        14400000
      ));
      nextRestockTimes[type] = newEndTime.toISOString();
      localStorage.setItem('restockEndTimes', JSON.stringify(nextRestockTimes));
      shouldFetch = true;
    } else if (type === 'egg' && remaining <= 1790000 && remaining >= 1789000) {
      console.warn(`Egg timer near 29:49, remaining: ${remaining / 1000}s`); // Debug tại 29:49
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
  toggleIcon.textContent = isDark ? 'Dark Mode' : 'Light Mode';
}

function switchTheme(event) {
  const isDark = event.target.checked;
  document.documentElement.setAttribute('data-theme', isDark ? DARK_THEME : LIGHT_THEME);
  localStorage.setItem('theme', isDark ? DARK_THEME : LIGHT_THEME);
  document.documentElement.classList.toggle('dark', isDark);
  toggleDarkLightMode(isDark);
}

javascriptasync function fetchStockData() {
  try {
    let data;
    try {
      const res = await fetch('https://api.joshlei.com/v2/growagarden/stock', {
        headers: {
          'jstudio-key': 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272'
        }
      });
      data = await res.json();
    } catch (e) {
      console.log("API fetch failed, using mock stock data");
      data = mockStockData();
    }

    // Update tables with new data (always update UI with latest)
    updateTable('seed', data.seed_stock);
    updateTable('gear', data.gear_stock);
    updateTable('egg', data.egg_stock);
    updateTable('event', data.cosmetic_stock);

    // Process each type
    ['seed', 'gear', 'egg', 'event'].forEach(type => {
      const items = data[`${type === 'event' ? 'cosmetic' : type}_stock`];
      if (items && items.length > 0) {
        // Create hash without Date_End (sort by display_name to avoid order issues)
        const itemsForHash = items.map(({ Date_End, ...rest }) => rest)
          .sort((a, b) => (a.display_name || '').localeCompare(b.display_name || ''));
        const newHash = JSON.stringify(itemsForHash);

        // Get old hash
        const capitalType = type.charAt(0).toUpperCase() + type.slice(1);
        const oldHash = localStorage.getItem(`last${capitalType}Hash`);

        if (newHash === oldHash) {
          // Stock unchanged (ignore Date_End), keep current timer
          console.log(`${type} stock unchanged, keeping existing timer`);
        } else {
          // Stock changed, update timer with new earliest Date_End
          const earliestEnd = items.reduce((min, item) => {
            const itemEnd = new Date(item.Date_End);
            return itemEnd < min ? itemEnd : min;
          }, new Date(items[0].Date_End));
          nextRestockTimes[type] = earliestEnd.toISOString();
          console.log(`${type} stock changed, updating timer to ${nextRestockTimes[type]}`);
        }

        // Always save new hash (without Date_End)
        localStorage.setItem(`last${capitalType}Hash`, newHash);
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
  if (!items) return;
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
  if (!body) return;

  body.innerHTML = '';
  items.forEach(item => {
    const icon = item.icon ? `<img src="${item.icon}" class="w-8 h-8 rounded-full mr-2" alt="${item.display_name}">` : '';
    const tr = document.createElement('tr');
    tr.className = "border-b border-gray-200 dark:border-gray-700";
    tr.innerHTML = `
      <td class="px-4 py-3 whitespace-nowrap">
        <div class="flex items-center">${icon}<span class="text-gray-800 dark:text-white">${item.display_name}</span></div>
      </td>
      <td class="px-4 py-3 whitespace-nowrap text-gray-800 dark:text-white">${item.quantity}</td>
    `;
    body.appendChild(tr);
  });
}

function restoreFromLocalStorage() {
  try {
    ['seed', 'gear', 'egg', 'event'].forEach(type => {
      const storedData = localStorage.getItem(`last${type.charAt(0).toUpperCase() + type.slice(1)}Hash`);
      if (storedData) {
        updateTable(type, JSON.parse(storedData));
      }
    });
  } catch (e) {
    console.error("Error restoring from localStorage:", e);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', currentTheme);
  document.documentElement.classList.toggle('dark', currentTheme === DARK_THEME);
  toggleSwitch.checked = currentTheme === DARK_THEME;
  toggleDarkLightMode(currentTheme === DARK_THEME);
  toggleSwitch.addEventListener('change', switchTheme);

  restoreFromLocalStorage();
  fetchActiveWeather();
  setInterval(fetchActiveWeather, 60000);
  setInterval(updateWeatherTimer, 1000);

  const lastFetchTime = localStorage.getItem('lastFetchTime');
  const now = new Date();
  if (!lastFetchTime || (now - new Date(lastFetchTime)) > 300000) {
    fetchStockData();
  } else {
    startCountdown();
  }

  setInterval(fetchStockData, 30000);
  updateAllTimers();
});

window.addEventListener('beforeunload', () => {
  localStorage.setItem('lastTheme', document.documentElement.getAttribute('data-theme'));
});
