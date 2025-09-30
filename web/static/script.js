const _0x35e8ae = _0x5c33;
(function(_0x36cb3c, _0x536956) {
    const _0x56ef0e = _0x5c33,
        _0x54a22f = _0x36cb3c();
    while (!![]) {
        try {
            const _0x10c612 = -parseInt(_0x56ef0e(0xbe)) / 0x1 * (-parseInt(_0x56ef0e(0x14c)) / 0x2) + parseInt(_0x56ef0e(0x99)) / 0x3 * (-parseInt(_0x56ef0e(0xd1)) / 0x4) + parseInt(_0x56ef0e(0xae)) / 0x5 * (-parseInt(_0x56ef0e(0x146)) / 0x6) + -parseInt(_0x56ef0e(0xa3)) / 0x7 + parseInt(_0x56ef0e(0xb6)) / 0x8 * (-parseInt(_0x56ef0e(0x121)) / 0x9) + parseInt(_0x56ef0e(0x131)) / 0xa * (parseInt(_0x56ef0e(0xdd)) / 0xb) + parseInt(_0x56ef0e(0x13b)) / 0xc * (parseInt(_0x56ef0e(0x11a)) / 0xd);
            if (_0x10c612 === _0x536956) break;
            else _0x54a22f['push'](_0x54a22f['shift']());
        } catch (_0x5a5d8b) {
            _0x54a22f['push'](_0x54a22f['shift']());
        }
    }
}(_0x559a, 0xe172b), (function() {
    let _0x147a9e = ![],
        _0x51f1ea = null;

    function _0x32a9a0() {
        const _0x5c8f36 = _0x5c33;
        _0x51f1ea = document[_0x5c8f36(0xa6)]('div'), _0x51f1ea['id'] = _0x5c8f36(0x161), _0x51f1ea[_0x5c8f36(0xa9)][_0x5c8f36(0xa0)] = _0x5c8f36(0xc0), _0x51f1ea[_0x5c8f36(0x12c)] = '\x0a\x20\x20\x20\x20\x20\x20<h1\x20style=\x22font-size:48px;\x20font-weight:bold;\x20margin-bottom:20px;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20Vietnam:\x20Trang\x20này\x20hiện\x20tại\x20không\x20có\x20gì\x20cả\x0a\x20\x20\x20\x20\x20\x20</h1>\x0a\x20\x20\x20\x20\x20\x20<h2\x20style=\x22font-size:32px;\x20font-weight:bold;\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20English:\x20This\x20page\x20currently\x20has\x20nothing\x0a\x20\x20\x20\x20\x20\x20</h2>\x0a\x20\x20\x20\x20', document[_0x5c8f36(0x112)][_0x5c8f36(0xe3)](_0x51f1ea);
    }

    function _0x32a9fb() {
        const _0xd29d70 = _0x5c33;
        _0x51f1ea && (_0x51f1ea[_0xd29d70(0x156)](), _0x51f1ea = null);
    }

    function _0x11bd06() {
        const _0x50879e = _0x5c33,
            _0x3fe0a0 = 0xa0,
            _0xa3daca = window[_0x50879e(0x130)] - window['innerWidth'] > _0x3fe0a0 || window[_0x50879e(0x163)] - window[_0x50879e(0x14e)] > _0x3fe0a0;
        if (_0xa3daca && !_0x147a9e) {
            _0x147a9e = !![];
            if (!_0x51f1ea) _0x32a9a0();
        } else !_0xa3daca && _0x147a9e && (_0x147a9e = ![], _0x32a9fb());
    }
    setInterval(_0x11bd06, 0x1f4);
}()));
const DARK_THEME = _0x35e8ae(0xf9),
    LIGHT_THEME = 'light',
    stockTypes = [_0x35e8ae(0x10b), 'gear', 'egg', _0x35e8ae(0xec)],
    defaultDurations = {
        'seed': 0x493e0,
        'gear': 0x493e0,
        'egg': 0x1b7740,
        'cosmetic': 0xdbba00
    };
let nextRestockTimes = {
    'seed': null,
    'gear': null,
    'egg': null,
    'cosmetic': null
};
const timerFlags = {};
let activeWeathers = [],
    lastFetchTimestamp = 0x0,
    lastTimerUpdate = 0x0;
const jstudio = _0x35e8ae(0x113);
stockTypes[_0x35e8ae(0xa2)](_0x38880d => {
    !nextRestockTimes[_0x38880d] && (nextRestockTimes[_0x38880d] = new Date(Date['now']() + defaultDurations[_0x38880d])['toISOString']()), timerFlags[_0x38880d] = ![];
});

function mockStockData() {
    const _0x412385 = _0x35e8ae;
    return {
        'seed_stock': [{
            'display_name': _0x412385(0x14d),
            'quantity': 0x10,
            'icon': _0x412385(0xcd),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0x144),
            'quantity': 0x6,
            'icon': _0x412385(0x15d),
            'Date_End': new Date(Date['now']() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': 'Watermelon',
            'quantity': 0x4,
            'icon': _0x412385(0xde),
            'Date_End': new Date(Date['now']() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': 'Tomato',
            'quantity': 0x2,
            'icon': _0x412385(0x15a),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': 'Blueberry',
            'quantity': 0x5,
            'icon': _0x412385(0xa5),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)[_0x412385(0x127)]()
        }],
        'gear_stock': [{
            'display_name': 'Trading\x20Ticket',
            'quantity': 0x2,
            'icon': _0x412385(0x164),
            'Date_End': new Date(Date['now']() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0x157),
            'quantity': 0x2,
            'icon': _0x412385(0xf5),
            'Date_End': new Date(Date['now']() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': 'Favorite\x20Tool',
            'quantity': 0x3,
            'icon': _0x412385(0x107),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)['toISOString']()
        }, {
            'display_name': _0x412385(0x148),
            'quantity': 0x2,
            'icon': _0x412385(0x140),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0x133),
            'quantity': 0x2,
            'icon': _0x412385(0x152),
            'Date_End': new Date(Date['now']() + 0x493e0)['toISOString']()
        }, {
            'display_name': 'Harvest\x20Tool',
            'quantity': 0x3,
            'icon': _0x412385(0xee),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)['toISOString']()
        }, {
            'display_name': _0x412385(0xc5),
            'quantity': 0x3,
            'icon': _0x412385(0xb0),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0xbb),
            'quantity': 0x1,
            'icon': _0x412385(0x11c),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x493e0)['toISOString']()
        }],
        'egg_stock': [{
            'display_name': 'Common\x20Egg',
            'quantity': 0x1,
            'icon': 'https://api.joshlei.com/v2/growagarden/image/common_egg',
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x1b7740)['toISOString']()
        }, {
            'display_name': _0x412385(0xf1),
            'quantity': 0x1,
            'icon': _0x412385(0xc7),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x1b7740)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0xbf),
            'quantity': 0x1,
            'icon': _0x412385(0xed),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0x1b7740)[_0x412385(0x127)]()
        }],
        'cosmetics_stock': [{
            'display_name': _0x412385(0x104),
            'quantity': 0x1,
            'icon': _0x412385(0x116),
            'Date_End': new Date(Date['now']() + 0xdbba00)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0xd5),
            'quantity': 0x1,
            'icon': _0x412385(0xca),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0xdbba00)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0xe1),
            'quantity': 0x5,
            'icon': _0x412385(0xfe),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0xdbba00)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0xa1),
            'quantity': 0x3,
            'icon': _0x412385(0x10e),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0xdbba00)[_0x412385(0x127)]()
        }, {
            'display_name': 'Small\x20Wood\x20Flooring',
            'quantity': 0x5,
            'icon': 'https://api.joshlei.com/v2/growagarden/image/small_wood_flooring',
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0xdbba00)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0xe8),
            'quantity': 0x1,
            'icon': _0x412385(0x126),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0xdbba00)[_0x412385(0x127)]()
        }, {
            'display_name': 'Small\x20Stone\x20Table',
            'quantity': 0x1,
            'icon': _0x412385(0xf8),
            'Date_End': new Date(Date['now']() + 0xdbba00)[_0x412385(0x127)]()
        }, {
            'display_name': _0x412385(0xc1),
            'quantity': 0x1,
            'icon': _0x412385(0xb4),
            'Date_End': new Date(Date[_0x412385(0x11b)]() + 0xdbba00)[_0x412385(0x127)]()
        }]
    };
}

function mockWeatherData() {
    const _0x59914f = _0x35e8ae;
    return {
        'weather': [{
            'item_id': _0x59914f(0xb3),
            'display_name': _0x59914f(0xf3),
            'active': !![],
            'icon': _0x59914f(0xe7),
            'description': _0x59914f(0x108),
            'duration': _0x59914f(0x9c),
            'last_seen': Math[_0x59914f(0x9b)](Date['now']() / 0x3e8)[_0x59914f(0xfa)]()
        }, {
            'item_id': _0x59914f(0x151),
            'display_name': 'Sunny',
            'active': !![],
            'icon': _0x59914f(0x12e),
            'description': _0x59914f(0x134),
            'duration': _0x59914f(0x11e),
            'last_seen': Math[_0x59914f(0x9b)](Date[_0x59914f(0x11b)]() / 0x3e8)['toString']()
        }, {
            'item_id': _0x59914f(0xd6),
            'display_name': _0x59914f(0xd0),
            'active': !![],
            'icon': _0x59914f(0xd9),
            'description': 'Your\x20fruit\x20can\x20become\x20MOONLIT!',
            'duration': _0x59914f(0xcc),
            'last_seen': Math['floor'](Date[_0x59914f(0x11b)]() / 0x3e8)['toString']()
        }]
    };
}
async function fetchWeatherEffects(_0x9a06cb) {
    const _0xc751d1 = _0x35e8ae;
    if (!_0x9a06cb) return console['error'](_0xc751d1(0xc6)), '';
    try {
        const _0x2fe3db = _0xc751d1(0xaa) + _0x9a06cb,
            _0x326681 = await fetch(_0x2fe3db, {
                'headers': {
                    'jstudio-key': jstudio,
                    'Content-Type': _0xc751d1(0xc9)
                }
            });
        if (!_0x326681['ok']) throw new Error(_0xc751d1(0x9f) + _0x326681[_0xc751d1(0x12a)]);
        const _0x3fef59 = await _0x326681['json']();
        return _0x3fef59;
    } catch (_0x540592) {
        return console['error'](_0xc751d1(0x114) + _0x9a06cb + ':', _0x540592), '';
    }
}

function _0x5c33(_0x22859e, _0x5773d5) {
    const _0x559aee = _0x559a();
    return _0x5c33 = function(_0x5c33db, _0x31d16a) {
        _0x5c33db = _0x5c33db - 0x98;
        let _0x5ea2eb = _0x559aee[_0x5c33db];
        return _0x5ea2eb;
    }, _0x5c33(_0x22859e, _0x5773d5);
}

function renderWeatherCards(_0x33f176) {
    const _0x5ccd53 = _0x35e8ae,
        _0x4d1029 = document['getElementById']('weather-card-container');
    if (!_0x4d1029) {
        console[_0x5ccd53(0xd7)]('Weather\x20card\x20container\x20not\x20found');
        return;
    }
    _0x4d1029[_0x5ccd53(0x12c)] = '';
    if (!Array[_0x5ccd53(0x153)](_0x33f176) || _0x33f176[_0x5ccd53(0x98)] === 0x0) {
        _0x4d1029['innerHTML'] = _0x5ccd53(0x120);
        return;
    }
    _0x33f176[_0x5ccd53(0xa2)]((_0x25b49c, _0x20e0f0) => {
        const _0x31829c = _0x5ccd53;
        if (!_0x25b49c || !_0x25b49c[_0x31829c(0x12b)]) return;
        const _0x1f066b = document[_0x31829c(0xa6)]('div');
        _0x1f066b[_0x31829c(0x9d)] = _0x31829c(0x115);
        const _0x13c857 = document[_0x31829c(0xa6)](_0x31829c(0x111));
        _0x13c857[_0x31829c(0x9d)] = _0x31829c(0xac), _0x13c857[_0x31829c(0x12c)] = _0x31829c(0xd3) + (_0x25b49c['icon'] ? '<img\x20src=\x22' + _0x25b49c[_0x31829c(0x125)] + '\x22\x20class=\x22w-6\x20h-6\x20mr-2\x20rounded-full\x22\x20alt=\x22' + _0x25b49c[_0x31829c(0x12b)] + _0x31829c(0xb9) : '') + _0x31829c(0xe5) + _0x20e0f0 + _0x31829c(0x9a) + _0x25b49c[_0x31829c(0x12b)] + _0x31829c(0xf0) + _0x20e0f0 + _0x31829c(0xf7), _0x1f066b[_0x31829c(0xe3)](_0x13c857);
        const _0x156c13 = document['createElement'](_0x31829c(0x111));
        _0x156c13[_0x31829c(0x9d)] = _0x31829c(0xcb), _0x156c13[_0x31829c(0x12c)] = '\x0a\x20\x20\x20\x20\x20\x20<span\x20id=\x22weather-status-' + _0x20e0f0 + '\x22\x20class=\x22px-3\x20py-1\x20text-sm\x20rounded-full\x20bg-green-100\x20dark:bg-green-900\x20text-green-800\x20dark:text-green-200\x22>Active</span>\x0a\x20\x20\x20\x20', _0x1f066b[_0x31829c(0xe3)](_0x156c13);
        const _0x4581df = document[_0x31829c(0xa6)](_0x31829c(0x111));
        _0x4581df['className'] = _0x31829c(0xc4);
        const _0x1981a0 = document[_0x31829c(0xa6)]('p');
        _0x1981a0[_0x31829c(0x9d)] = 'text-gray-600\x20dark:text-gray-300\x20whitespace-pre-wrap', _0x1981a0[_0x31829c(0xb8)] = Array[_0x31829c(0x153)](_0x25b49c[_0x31829c(0x15b)]) ? _0x25b49c[_0x31829c(0x15b)]['join']('\x0a') : _0x25b49c[_0x31829c(0x15b)] || _0x31829c(0xdf), _0x4581df[_0x31829c(0xe3)](_0x1981a0), _0x1f066b['appendChild'](_0x4581df), _0x4d1029[_0x31829c(0xe3)](_0x1f066b);
    });
}
async function fetchActiveWeather() {
    const _0xf36843 = _0x35e8ae;
    try {
        const _0x461925 = await fetch(_0xf36843(0xf2), {
            'headers': {
                'jstudio-key': jstudio,
                'Content-Type': _0xf36843(0xc9)
            }
        });
        if (!_0x461925['ok']) throw new Error(_0xf36843(0x9f) + _0x461925[_0xf36843(0x12a)]);
        const _0x2e041f = await _0x461925[_0xf36843(0x129)]();
        if (!_0x2e041f || typeof _0x2e041f !== _0xf36843(0x149)) throw new Error(_0xf36843(0xcf));
        const _0x5a2bf4 = Object['entries'](_0x2e041f)[_0xf36843(0x132)](([_0x372585]) => _0x372585 !== _0xf36843(0x10d))[_0xf36843(0x110)](([_0x3253cb, _0x456454]) => _0x456454),
            _0xf71624 = _0x5a2bf4[_0xf36843(0x132)](_0x1041b6 => _0x1041b6['active'] === !![]);
        activeWeathers = await Promise[_0xf36843(0x12f)](_0xf71624[_0xf36843(0x110)](async _0x1ac3d1 => {
            const _0x521231 = _0xf36843;
            let _0x583602 = {
                'item_id': _0x1ac3d1['weather_id'] || '',
                'display_name': _0x1ac3d1[_0x521231(0x139)] || '',
                'icon': _0x1ac3d1['icon'] || '',
                'description': _0x1ac3d1['description'] || '',
                'active': !![],
                'start_time_unix': _0x1ac3d1[_0x521231(0x100)] || Math['floor'](Date[_0x521231(0x11b)]() / 0x3e8),
                'end_duration_unix': _0x1ac3d1[_0x521231(0x102)] || Math[_0x521231(0x9b)](Date['now']() / 0x3e8) + (_0x1ac3d1[_0x521231(0x141)] || 0xe10)
            };
            if (_0x583602[_0x521231(0x10f)] !== _0x521231(0x10c)) try {
                const _0x811ed8 = await fetchWeatherEffects(_0x583602[_0x521231(0x10f)]);
                _0x811ed8 && _0x811ed8['description'] && (_0x583602[_0x521231(0x15b)] = _0x811ed8[_0x521231(0x15b)]);
            } catch (_0x45f6c2) {
                console[_0x521231(0x142)](_0x521231(0xfb) + _0x583602[_0x521231(0x10f)] + ':', _0x45f6c2['message']);
            }
            return _0x583602;
        })), localStorage['setItem'](_0xf36843(0x9e), JSON[_0xf36843(0xff)](activeWeathers)), renderWeatherCards(activeWeathers);
    } catch (_0x2e1054) {
        console[_0xf36843(0xd7)]('Weather\x20fetch\x20error:', _0x2e1054[_0xf36843(0x103)]);
        let _0x340aca = JSON[_0xf36843(0xfd)](localStorage[_0xf36843(0xb5)](_0xf36843(0x9e)) || '[]');
        activeWeathers = _0x340aca[_0xf36843(0x132)](_0x243c89 => _0x243c89[_0xf36843(0x154)] && _0x243c89[_0xf36843(0x102)] > Math[_0xf36843(0x9b)](Date[_0xf36843(0x11b)]() / 0x3e8)), !activeWeathers[_0xf36843(0x98)] && (activeWeathers = mockWeatherData()['weather'][_0xf36843(0x132)](_0x32a2c0 => _0x32a2c0[_0xf36843(0x154)] === !![])), renderWeatherCards(activeWeathers);
    }
}

function updateWeatherTimer() {
    const _0x2c17ac = _0x35e8ae;
    if (!Array[_0x2c17ac(0x153)](activeWeathers) || !activeWeathers[_0x2c17ac(0x98)]) return;
    let _0x495b21 = ![];
    const _0x1051ee = Math[_0x2c17ac(0x9b)](Date[_0x2c17ac(0x11b)]() / 0x3e8);
    activeWeathers = activeWeathers[_0x2c17ac(0x132)]((_0x59bd13, _0x43f12f) => {
        const _0x204ca8 = _0x2c17ac,
            _0x98025c = document[_0x204ca8(0x122)](_0x204ca8(0x11d) + _0x43f12f);
        if (!_0x98025c || !_0x59bd13 || !_0x59bd13['end_duration_unix']) return ![];
        const _0x49d3df = Math[_0x204ca8(0x13e)](0x0, _0x59bd13[_0x204ca8(0x102)] - _0x1051ee);
        if (_0x49d3df <= 0x0) return _0x495b21 = !![], ![];
        const _0xf68bc1 = Math[_0x204ca8(0x9b)](_0x49d3df / 0xe10),
            _0x771a23 = Math[_0x204ca8(0x9b)](_0x49d3df % 0xe10 / 0x3c),
            _0x7f2454 = _0x49d3df % 0x3c,
            _0x1a66b6 = _0xf68bc1 > 0x0 ? _0xf68bc1[_0x204ca8(0xfa)]()[_0x204ca8(0x13d)](0x2, '0') + ':' + _0x771a23[_0x204ca8(0xfa)]()['padStart'](0x2, '0') + ':' + _0x7f2454[_0x204ca8(0xfa)]()['padStart'](0x2, '0') : _0x771a23['toString']()[_0x204ca8(0x13d)](0x2, '0') + ':' + _0x7f2454[_0x204ca8(0xfa)]()[_0x204ca8(0x13d)](0x2, '0');
        return _0x98025c[_0x204ca8(0xb8)] = _0x204ca8(0xe4) + _0x1a66b6, !![];
    });
    if (_0x495b21) {
        renderWeatherCards(activeWeathers);
        try {
            localStorage['setItem'](_0x2c17ac(0x9e), JSON[_0x2c17ac(0xff)](activeWeathers));
        } catch (_0x4e8ccd) {
            console['error'](_0x2c17ac(0x147), _0x4e8ccd);
        }
    }
}

function formatTime(_0x2e0baf) {
    const _0x43bf8c = _0x35e8ae,
        _0x22592b = Math[_0x43bf8c(0x9b)](_0x2e0baf / 0x3e8),
        _0x54f246 = _0x22592b % 0x3c,
        _0x1ff6a0 = Math['floor'](_0x22592b / 0x3c) % 0x3c,
        _0x288287 = Math[_0x43bf8c(0x9b)](_0x22592b / 0xe10);
    return _0x288287 > 0x0 ? _0x288287[_0x43bf8c(0xfa)]()['padStart'](0x2, '0') + ':' + _0x1ff6a0[_0x43bf8c(0xfa)]()['padStart'](0x2, '0') + ':' + _0x54f246[_0x43bf8c(0xfa)]()[_0x43bf8c(0x13d)](0x2, '0') : _0x1ff6a0[_0x43bf8c(0xfa)]()[_0x43bf8c(0x13d)](0x2, '0') + ':' + _0x54f246[_0x43bf8c(0xfa)]()[_0x43bf8c(0x13d)](0x2, '0');
}

function createOrUpdateTimer(_0xaac780, _0x4d1139) {
    const _0x4b6fba = _0x35e8ae,
        _0x66710f = document[_0x4b6fba(0x122)](_0xaac780 + _0x4b6fba(0x109));
    if (!_0x66710f) return;
    _0x66710f['textContent'] = _0x4d1139 !== undefined ? _0x4b6fba(0x145) + formatTime(_0x4d1139) : _0x4b6fba(0x159), _0x66710f[_0x4b6fba(0x9d)] = _0x4d1139 !== undefined && _0x4d1139 <= 0x2710 ? _0x4b6fba(0x11f) : _0x4b6fba(0xdb);
}
async function fetchAllStock(_0x4937af = ![]) {
    const _0x4884c1 = _0x35e8ae,
        _0x1b3986 = Date[_0x4884c1(0x11b)]();
    if (!_0x4937af && _0x1b3986 - lastFetchTimestamp < 0x1388) return;
    lastFetchTimestamp = _0x1b3986;
    try {
        const _0x40cc6a = await fetch(_0x4884c1(0x14a), {
            'headers': {
                'jstudio-key': jstudio,
                'Content-Type': _0x4884c1(0xc9)
            }
        });
        if (!_0x40cc6a['ok']) throw new Error('HTTP\x20' + _0x40cc6a[_0x4884c1(0x12a)]);
        const _0x8d247f = await _0x40cc6a[_0x4884c1(0x129)]();
        updateTable(_0x4884c1(0x10b), Array[_0x4884c1(0x153)](_0x8d247f[_0x4884c1(0x117)]) ? _0x8d247f[_0x4884c1(0x117)] : []), updateTable(_0x4884c1(0xe9), Array[_0x4884c1(0x153)](_0x8d247f[_0x4884c1(0xb7)]) ? _0x8d247f[_0x4884c1(0xb7)] : []), updateTable('egg', Array['isArray'](_0x8d247f[_0x4884c1(0x128)]) ? _0x8d247f[_0x4884c1(0x128)] : []), updateTable('cosmetic', Array['isArray'](_0x8d247f[_0x4884c1(0x135)]) ? _0x8d247f[_0x4884c1(0x135)] : []), updateRestockTimesFromAPI(_0x8d247f);
    } catch (_0x1a06cc) {
        console['error'](_0x4884c1(0x13c), _0x1a06cc);
        const _0x8a73f4 = mockStockData();
        updateTable(_0x4884c1(0x10b), _0x8a73f4[_0x4884c1(0x117)]), updateTable(_0x4884c1(0xe9), _0x8a73f4[_0x4884c1(0xb7)]), updateTable('egg', _0x8a73f4['egg_stock']), updateTable('cosmetic', _0x8a73f4['cosmetic_stock']), updateRestockTimesFromAPI(_0x8a73f4);
    }
}
async function updateRestockTimesFromAPI(_0x337316) {
    const _0x36f1a3 = _0x35e8ae,
        _0x4a03e1 = Date[_0x36f1a3(0x11b)](),
        _0x33efc1 = {
            'seed': _0x337316[_0x36f1a3(0x117)],
            'gear': _0x337316[_0x36f1a3(0xb7)],
            'egg': _0x337316[_0x36f1a3(0x128)],
            'cosmetic': _0x337316[_0x36f1a3(0x135)]
        };
    stockTypes[_0x36f1a3(0xa2)](_0x42e59e => {
        const _0x2ba7c2 = _0x36f1a3;
        let _0x5b912d = null;
        const _0x475aa5 = Array[_0x2ba7c2(0x153)](_0x33efc1[_0x42e59e]) ? _0x33efc1[_0x42e59e] : [];
        if (_0x475aa5[_0x2ba7c2(0x98)] > 0x0) {
            const _0x321d3c = _0x475aa5['map'](_0x507885 => {
                const _0x3a0e5e = _0x2ba7c2;
                if (!_0x507885[_0x3a0e5e(0x106)]) return null;
                const _0x47604e = new Date(_0x507885[_0x3a0e5e(0x106)])[_0x3a0e5e(0xbc)]();
                return _0x47604e > _0x4a03e1 ? _0x47604e : null;
            })[_0x2ba7c2(0x132)](_0x366711 => _0x366711 !== null);
            _0x321d3c[_0x2ba7c2(0x98)] && (_0x5b912d = Math[_0x2ba7c2(0xaf)](..._0x321d3c), nextRestockTimes[_0x42e59e] = new Date(_0x5b912d)[_0x2ba7c2(0x127)]());
        }!_0x5b912d && (nextRestockTimes[_0x42e59e] = new Date(_0x4a03e1 + defaultDurations[_0x42e59e])['toISOString']());
        const _0x59b26d = new Date(nextRestockTimes[_0x42e59e])['getTime']() - _0x4a03e1;
        createOrUpdateTimer(_0x42e59e, _0x59b26d);
    });
    try {
        localStorage[_0x36f1a3(0x105)](_0x36f1a3(0x150), JSON[_0x36f1a3(0xff)](nextRestockTimes));
        const _0x56fa1c = document['getElementById'](_0x36f1a3(0x15f));
        _0x56fa1c && (_0x56fa1c[_0x36f1a3(0xb8)] = new Date(_0x4a03e1)['toLocaleString']());
    } catch (_0x1dcfa5) {
        console['error'](_0x36f1a3(0xa4), _0x1dcfa5);
    }
}

function updateTimer(_0x40b01d) {
    const _0x30d647 = _0x35e8ae,
        _0x549e5a = Date['now'](),
        _0x1e5e68 = nextRestockTimes[_0x40b01d] ? new Date(nextRestockTimes[_0x40b01d]) : null,
        _0x488dea = _0x1e5e68 && !isNaN(_0x1e5e68[_0x30d647(0xbc)]()) ? Math[_0x30d647(0x13e)](0x0, _0x1e5e68 - _0x549e5a) : 0x0;
    createOrUpdateTimer(_0x40b01d, _0x488dea), _0x488dea <= 0x0 && !timerFlags[_0x40b01d] && (timerFlags[_0x40b01d] = !![], setTimeout(() => {
        const _0x24dc59 = _0x30d647;
        fetchAllStock()[_0x24dc59(0xab)](() => {
            timerFlags[_0x40b01d] = ![];
        });
    }, 0x3e8));
}

function updateAllTimers() {
    const _0x41e249 = _0x35e8ae,
        _0x2c92f9 = Date['now']();
    if (_0x2c92f9 - lastTimerUpdate < 0x3e8) {
        requestAnimationFrame(updateAllTimers);
        return;
    }
    lastTimerUpdate = _0x2c92f9, stockTypes[_0x41e249(0xa2)](_0x98ad36 => updateTimer(_0x98ad36)), updateWeatherTimer(), requestAnimationFrame(updateAllTimers);
}

function updateTable(_0x559f2e, _0x451de4) {
    const _0x1cd457 = _0x35e8ae;
    if (!stockTypes[_0x1cd457(0xa8)](_0x559f2e)) {
        console['error'](_0x1cd457(0x14b) + _0x559f2e);
        return;
    }!Array[_0x1cd457(0x153)](_0x451de4) && (_0x451de4 = []);
    const _0x2f350a = {
            'seed': _0x1cd457(0xe0),
            'gear': _0x1cd457(0x158),
            'egg': _0x1cd457(0x137),
            'cosmetic': _0x1cd457(0xea)
        },
        _0x565fe8 = _0x451de4[_0x1cd457(0xf6)]((_0x228119, _0x27faa6) => _0x228119 + (_0x27faa6[_0x1cd457(0x124)] || 0x0), 0x0),
        _0x2763ef = document[_0x1cd457(0x122)](_0x559f2e + _0x1cd457(0x13f)),
        _0x951381 = document[_0x1cd457(0x122)](_0x2f350a[_0x559f2e]),
        _0x5a6a67 = document[_0x1cd457(0x122)](_0x559f2e + _0x1cd457(0xeb));
    if (!_0x2763ef || !_0x951381 || !_0x5a6a67) return;
    _0x2763ef[_0x1cd457(0xb8)] = _0x565fe8, _0x951381[_0x1cd457(0xb8)] = _0x451de4['length'], _0x5a6a67[_0x1cd457(0x12c)] = '', _0x451de4[_0x1cd457(0xdc)]((_0x34f1b3, _0x4a37a5) => (_0x34f1b3[_0x1cd457(0x12b)] || '')[_0x1cd457(0x155)](_0x4a37a5[_0x1cd457(0x12b)] || ''))[_0x1cd457(0xa2)](_0x105355 => {
        const _0x30aeb2 = _0x1cd457;
        if (!_0x105355[_0x30aeb2(0x12b)]) return;
        const _0x4a3395 = _0x105355[_0x30aeb2(0x125)] ? '<img\x20src=\x22' + _0x105355[_0x30aeb2(0x125)] + _0x30aeb2(0xb1) + _0x105355[_0x30aeb2(0x12b)] + _0x30aeb2(0x13a) : '',
            _0x5e7cdb = document[_0x30aeb2(0xa6)]('tr');
        _0x5e7cdb[_0x30aeb2(0x9d)] = _0x30aeb2(0xb2), _0x5e7cdb[_0x30aeb2(0x12c)] = '\x0a\x20\x20\x20\x20\x20\x20<td\x20class=\x22px-4\x20py-3\x20whitespace-nowrap\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22flex\x20items-center\x22>' + _0x4a3395 + _0x30aeb2(0x14f) + _0x105355[_0x30aeb2(0x12b)] + _0x30aeb2(0xc2) + (_0x105355['quantity'] || 0x0) + _0x30aeb2(0x15c), _0x5a6a67[_0x30aeb2(0xe3)](_0x5e7cdb);
    });
}

function _0x559a() {
    const _0x3d868d = ['fetchActiveWeather:', 'https://api.joshlei.com/v2/growagarden/image/nightevent', 'Unknown\x20Weather', 'text-sm\x20text-white', 'sort', '11ABkYJe', 'https://api.joshlei.com/v2/growagarden/image/watermelon', 'No\x20description\x20available', 'seed-varieties', 'Small\x20Circle\x20Tile', 'DOMContentLoaded', 'appendChild', 'Ends\x20in:\x20', '\x0a\x20\x20\x20\x20\x20\x20\x20\x20<h3\x20id=\x22weather-name-', 'slice', 'https://uxwing.com/wp-content/themes/uxwing/download/weather/rainy-icon.png', 'Compost\x20Bin', 'gear', 'cosmetic-types', '-table-body', 'cosmetic', 'https://api.joshlei.com/v2/growagarden/image/rare_summer_egg', 'https://api.joshlei.com/v2/growagarden/image/harvest_tool', 'weather_id', '</h3>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20<span\x20id=\x22weather-timer-', 'Common\x20Egg', 'https://api.joshlei.com/v2/growagarden/weather', 'Rainy', 'data-theme', 'https://api.joshlei.com/v2/growagarden/image/cleaning_spray', 'reduce', '\x22\x20class=\x22px-3\x20py-1\x20text-sm\x20rounded-full\x20bg-gray-200\x20dark:bg-gray-700\x20text-gray-800\x20dark:text-gray-200\x22>Ends\x20in:\x20Calculating...</span>\x0a\x20\x20\x20\x20', 'https://api.joshlei.com/v2/growagarden/image/small_stone_table', 'dark', 'toString', 'Could\x20not\x20fetch\x20effect\x20for\x20', 'getAttribute', 'parse', 'https://api.joshlei.com/v2/growagarden/image/small_circle_tile', 'stringify', 'start_time_unix', 'toUpperCase', 'end_duration_unix', 'message', 'Lemonade\x20Stand', 'setItem', 'Date_End', 'https://api.joshlei.com/v2/growagarden/image/favorite_tool', 'Plants\x20grow\x20faster\x20in\x20the\x20rain!', '-timer', 'toggle', 'seed', 'unknown', 'timestamp', 'https://api.joshlei.com/v2/growagarden/image/torch', 'item_id', 'map', 'div', 'body', 'js_69f33a60196198e91a0aa35c425c8018d20a37778a6835543cba6fe2f9df6272', 'Error\x20fetching\x20description\x20for\x20weather\x20', 'bg-white\x20dark:bg-gray-800\x20rounded-lg\x20p-4\x20shadow', 'https://api.joshlei.com/v2/growagarden/image/lemonade_stand', 'seed_stock', 'title', 'setAttribute', '2860741ZPicNZ', 'now', 'https://api.joshlei.com/v2/growagarden/image/godly_sprinkler', 'weather-timer-', '3600', 'text-sm\x20text-yellow-500\x20animate-pulse', '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22bg-white\x20dark:bg-gray-800\x20rounded-lg\x20p-4\x20shadow\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22flex\x20justify-between\x20items-center\x20mb-2\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22flex\x20items-center\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<h3\x20id=\x22weather-name-0\x22\x20class=\x22text-lg\x20font-medium\x20text-gray-800\x20dark:text-white\x22>Normal</h3>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20id=\x22weather-timer-0\x22\x20class=\x22px-3\x20py-1\x20text-sm\x20rounded-full\x20bg-gray-200\x20dark:bg-gray-700\x20text-gray-800\x20dark:text-gray-200\x22>No\x20active\x20event</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20\x20\x20<div\x20class=\x22flex\x20items-center\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20\x20\x20<span\x20id=\x22weather-status-0\x22\x20class=\x22px-3\x20py-1\x20text-sm\x20rounded-full\x20bg-red-100\x20dark:bg-red-900\x20text-red-800\x20dark:text-red-200\x22>Inactive</span>\x0a\x20\x20\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20\x20\x20</div>\x0a\x20\x20\x20\x20', '2781sPEIGH', 'getElementById', 'target', 'quantity', 'icon', 'https://api.joshlei.com/v2/growagarden/image/compost_bin', 'toISOString', 'egg_stock', 'json', 'status', 'display_name', 'innerHTML', 'restoreFromLocalStorage:\x20Error\x20restoring\x20from\x20localStorage:', 'https://uxwing.com/wp-content/themes/uxwing/download/weather/sun-icon.png', 'all', 'outerWidth', '4425370kEYFsL', 'filter', 'Watering\x20Can', 'Bright\x20sun\x20boosts\x20your\x20harvest!', 'cosmetic_stock', 'name', 'egg-types', 'lastTheme', 'weather_name', '\x22\x20onerror=\x22this.style.display=\x27none\x27\x22>', '216JtukIE', 'fetchAllStock:\x20Fetch\x20failed:', 'padStart', 'max', '-count', 'https://api.joshlei.com/v2/growagarden/image/recall_wrench', 'duration', 'warn', 'change', 'Strawberry', 'Restock\x20in:\x20', '245928bogfFT', 'updateWeatherTimer:\x20Error\x20saving\x20activeWeathers\x20to\x20localStorage:', 'Recall\x20Wrench', 'object', 'https://api.joshlei.com/v2/growagarden/stock', 'updateTable:\x20Invalid\x20stock\x20type:\x20', '30956HtqtQo', 'Carrot', 'innerHeight', '<span\x20class=\x22text-gray-800\x20dark:text-white\x22>', 'restockEndTimes', 'sunny', 'https://api.joshlei.com/v2/growagarden/image/watering_can', 'isArray', 'active', 'localeCompare', 'remove', 'Cleaning\x20Spray', 'gear-categories', 'Next\x20update:\x2000:00', 'https://api.joshlei.com/v2/growagarden/image/tomato', 'description', '</td>\x0a\x20\x20\x20\x20', 'https://api.joshlei.com/v2/growagarden/image/strawberry', 'Hash', 'last-updated', 'theme-toggle', 'devtools-overlay', 'startCountdown:\x20Error\x20saving\x20restockEndTimes\x20to\x20localStorage:', 'outerHeight', 'https://api.joshlei.com/v2/growagarden/image/trading_ticket', 'length', '8826rtEqtW', '\x22\x20class=\x22text-lg\x20font-medium\x20text-gray-800\x20dark:text-white\x22>', 'floor', '1800', 'className', 'activeWeathers', 'HTTP\x20', 'cssText', 'Torch', 'forEach', '4463361vrrHng', 'updateRestockTimesFromAPI:\x20Error\x20saving\x20to\x20localStorage:', 'https://api.joshlei.com/v2/growagarden/image/blueberry', 'createElement', 'last', 'includes', 'style', 'https://api.joshlei.com/v2/growagarden/info/', 'finally', 'flex\x20justify-between\x20items-center\x20mb-2', 'checked', '170nBqKfV', 'min', 'https://api.joshlei.com/v2/growagarden/image/trowel', '\x22\x20class=\x22w-8\x20h-8\x20rounded-full\x20mr-2\x22\x20alt=\x22', 'border-b\x20border-gray-200\x20dark:border-gray-700', 'rainy', 'https://api.joshlei.com/v2/growagarden/image/bookshelf', 'getItem', '16808HotDMo', 'gear_stock', 'textContent', '\x20icon\x22\x20onerror=\x22this.style.display=\x27none\x27\x22>', 'addEventListener', 'Godly\x20Sprinkler', 'getTime', 'Light\x20Mode', '16sIYNXz', 'Rare\x20Summer\x20Egg', '\x0a\x20\x20\x20\x20\x20\x20position:\x20fixed;\x0a\x20\x20\x20\x20\x20\x20top:\x200;\x20left:\x200;\x0a\x20\x20\x20\x20\x20\x20width:\x20100%;\x20height:\x20100%;\x0a\x20\x20\x20\x20\x20\x20background:\x20white;\x0a\x20\x20\x20\x20\x20\x20color:\x20black;\x0a\x20\x20\x20\x20\x20\x20display:\x20flex;\x0a\x20\x20\x20\x20\x20\x20flex-direction:\x20column;\x0a\x20\x20\x20\x20\x20\x20align-items:\x20center;\x0a\x20\x20\x20\x20\x20\x20justify-content:\x20center;\x0a\x20\x20\x20\x20\x20\x20font-family:\x20sans-serif;\x0a\x20\x20\x20\x20\x20\x20z-index:\x20999999;\x0a\x20\x20\x20\x20\x20\x20text-align:\x20center;\x0a\x20\x20\x20\x20', 'Bookshelf', '</span></div>\x0a\x20\x20\x20\x20\x20\x20</td>\x0a\x20\x20\x20\x20\x20\x20<td\x20class=\x22px-4\x20py-3\x20text-gray-800\x20dark:text-white\x22>', 'Error\x20saving\x20lastTheme\x20to\x20localStorage:', 'flex\x20items-center', 'Trowel', 'fetchWeatherEffects:\x20weatherId\x20is\x20undefined\x20or\x20empty', 'https://api.joshlei.com/v2/growagarden/image/common_egg', 'theme', 'application/json', 'https://api.joshlei.com/v2/growagarden/image/wheelbarrow', 'flex\x20items-center\x20mb-2', '600', 'https://api.joshlei.com/v2/growagarden/image/carrot', 'documentElement', 'Invalid\x20weather\x20data\x20format', 'Night\x20Event', '1424RYLiGj', 'beforeunload', '\x0a\x20\x20\x20\x20\x20\x20<div\x20class=\x22flex\x20items-center\x22>\x0a\x20\x20\x20\x20\x20\x20\x20\x20', 'classList', 'Wheelbarrow', 'nightevent', 'error'];
    _0x559a = function() {
        return _0x3d868d;
    };
    return _0x559a();
}

function toggleDarkLightMode(_0x39dfd9) {
    const _0x1e169d = _0x35e8ae,
        _0x17214e = document[_0x1e169d(0x122)]('toggle-icon');
    _0x17214e && (_0x17214e['textContent'] = _0x39dfd9 ? 'Dark\x20Mode' : _0x1e169d(0xbd));
}

function switchTheme(_0x1007da) {
    const _0x39a135 = _0x35e8ae,
        _0x39f404 = _0x1007da[_0x39a135(0x123)][_0x39a135(0xad)];
    document[_0x39a135(0xce)]['setAttribute'](_0x39a135(0xf4), _0x39f404 ? DARK_THEME : LIGHT_THEME), document[_0x39a135(0xce)][_0x39a135(0xd4)][_0x39a135(0x10a)](_0x39a135(0xf9), _0x39f404), localStorage[_0x39a135(0x105)](_0x39a135(0xc8), _0x39f404 ? DARK_THEME : LIGHT_THEME), toggleDarkLightMode(_0x39f404);
}

function restoreFromLocalStorage() {
    const _0x488ad9 = _0x35e8ae;
    try {
        stockTypes[_0x488ad9(0xa2)](_0x3e9280 => {
            const _0xbfaf1b = _0x488ad9,
                _0x1d411d = localStorage[_0xbfaf1b(0xb5)](_0xbfaf1b(0xa7) + (_0x3e9280['charAt'](0x0)[_0xbfaf1b(0x101)]() + _0x3e9280[_0xbfaf1b(0xe6)](0x1)) + _0xbfaf1b(0x15e));
            _0x1d411d && updateTable(_0x3e9280, JSON[_0xbfaf1b(0xfd)](_0x1d411d));
        });
        const _0x292023 = localStorage[_0x488ad9(0xb5)]('activeWeathers');
        if (_0x292023) {
            activeWeathers = JSON[_0x488ad9(0xfd)](_0x292023);
            const _0x4769b7 = Math[_0x488ad9(0x9b)](Date[_0x488ad9(0x11b)]() / 0x3e8);
            activeWeathers = activeWeathers[_0x488ad9(0x110)](_0x3510a5 => ({
                ..._0x3510a5,
                'display_name': _0x3510a5[_0x488ad9(0x12b)] || _0x3510a5[_0x488ad9(0x136)] || _0x3510a5[_0x488ad9(0x118)] || _0x488ad9(0xda),
                'item_id': _0x3510a5[_0x488ad9(0xef)] || _0x3510a5['item_id'] || _0x488ad9(0x10c)
            }))[_0x488ad9(0x132)](_0x356805 => _0x356805 && _0x356805[_0x488ad9(0x154)] === !![] && _0x356805[_0x488ad9(0x102)] > _0x4769b7), renderWeatherCards(activeWeathers);
        }
    } catch (_0x366653) {
        console['error'](_0x488ad9(0x12d), _0x366653);
    }
}

function startCountdown() {
    const _0x1776b1 = _0x35e8ae,
        _0x19ff32 = JSON[_0x1776b1(0xfd)](localStorage[_0x1776b1(0xb5)](_0x1776b1(0x150)) || '{}'),
        _0x166067 = Date['now']();
    stockTypes[_0x1776b1(0xa2)](_0x359cc8 => {
        const _0x2139b9 = _0x1776b1,
            _0x2eb280 = _0x19ff32[_0x359cc8] && new Date(_0x19ff32[_0x359cc8]);
        _0x2eb280 && !isNaN(_0x2eb280[_0x2139b9(0xbc)]()) && _0x2eb280 > _0x166067 ? nextRestockTimes[_0x359cc8] = _0x2eb280[_0x2139b9(0x127)]() : nextRestockTimes[_0x359cc8] = new Date(_0x166067 + defaultDurations[_0x359cc8])['toISOString']();
    });
    try {
        localStorage[_0x1776b1(0x105)](_0x1776b1(0x150), JSON['stringify'](nextRestockTimes));
    } catch (_0x54a795) {
        console['error'](_0x1776b1(0x162), _0x54a795);
    }
    updateAllTimers();
}
document['addEventListener'](_0x35e8ae(0xe2), () => {
    const _0x11cd26 = _0x35e8ae;
    console['log']('renderWeatherCards:', typeof renderWeatherCards, renderWeatherCards), console['log'](_0x11cd26(0xd8), typeof fetchActiveWeather, fetchActiveWeather);
    const _0x371ab3 = document[_0x11cd26(0x122)](_0x11cd26(0x160)),
        _0x3c7202 = localStorage[_0x11cd26(0xb5)](_0x11cd26(0xc8)) || LIGHT_THEME;
    document['documentElement'][_0x11cd26(0x119)]('data-theme', _0x3c7202), document[_0x11cd26(0xce)][_0x11cd26(0xd4)][_0x11cd26(0x10a)](_0x11cd26(0xf9), _0x3c7202 === DARK_THEME), _0x371ab3 && (_0x371ab3[_0x11cd26(0xad)] = _0x3c7202 === DARK_THEME, _0x371ab3['addEventListener'](_0x11cd26(0x143), switchTheme)), toggleDarkLightMode(_0x3c7202 === DARK_THEME), restoreFromLocalStorage(), fetchActiveWeather(), setInterval(fetchActiveWeather, 0xea60), setInterval(updateWeatherTimer, 0x3e8), startCountdown(), fetchAllStock(!![]), setInterval(() => fetchAllStock(), 0x7530);
}), window[_0x35e8ae(0xba)](_0x35e8ae(0xd2), () => {
    const _0x3e5b3f = _0x35e8ae;
    try {
        localStorage[_0x3e5b3f(0x105)](_0x3e5b3f(0x138), document['documentElement'][_0x3e5b3f(0xfc)]('data-theme'));
    } catch (_0x334452) {
        console[_0x3e5b3f(0xd7)](_0x3e5b3f(0xc3), _0x334452);
    }
});
