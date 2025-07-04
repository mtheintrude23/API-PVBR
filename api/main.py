import asyncio
import re
import json
from collections import defaultdict
from contextlib import asynccontextmanager

import websockets
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from starlette.requests import Request

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address


def combine_items_by_name(items):
    combined = defaultdict(int)
    for item in items:
        combined[item["name"]] += item.get("quantity", 0)
    return [{"name": name, "quantity": qty, "item_id": normalize_name(name)} for name, qty in combined.items()]


def clean_items(items, keys_to_keep={"name", "quantity"}):
    return [add_item_id({k: item[k] for k in keys_to_keep if k in item}) for item in items]


def normalize_name(name):
    return re.sub(r'\s+', '_', re.sub(r"[^\w\s]", "", name.strip().lower()))


def add_item_id(item):
    item["item_id"] = normalize_name(item.get("name", ""))
    return item
# ----------------------------
# Global Data Store
# ----------------------------

latest_data = {
    "weather": {},
    "gearStock": [],
    "seedsStock": [],
    "eggStock": [],
    "eventStock": [],
    "cosmeticsStock": [],
    "timestamp": 0,
}


# ----------------------------
# WebSocket Listener
# ----------------------------

async def websocket_listener():
    uri = "wss://ws.growagardenpro.com/"

    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print("API WebSocket Connected.")
                async for message in websocket:
                    data = json.loads(message)
                    if data.get("type"):
                        raw_data = data["data"]
                        latest_data["timestamp"] = int(asyncio.get_event_loop().time())

                        if "weather" in raw_data:
                            latest_data["weather"] = raw_data["weather"]
                        if "gear" in raw_data:
                            latest_data["gearStock"] = clean_items(raw_data["gear"])
                        if "seeds" in raw_data:
                            latest_data["seedsStock"] = clean_items(raw_data["seeds"])
                        if "cosmetics" in raw_data:
                            latest_data["cosmeticsStock"] = clean_items(raw_data["cosmetics"])
                        if "honey" in raw_data:
                            latest_data["eventStock"] = clean_items(raw_data["honey"])
                        if "eggs" in raw_data:
                            latest_data["eggStock"] = combine_items_by_name(raw_data["eggs"])
        except Exception as e:
            print(f"WebSocket error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)


# ----------------------------
# App Initialization
# ----------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(websocket_listener())
    yield


app = FastAPI(
    title="Grow a Garden API",
    description="Một API cung cấp dữ liệu Seeds Gear Egg và Weather từ Grow a Garden Roblox.",
    version="3.5.9",
    lifespan=lifespan,
    license_info={"name": "MIT", "url": "https://opensource.org/licenses/MIT"},
    docs_url=None,
)

# Static & CORS
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting
limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


# ----------------------------
# Routes
# ----------------------------

@app.get("/docs", include_in_schema=False)
async def custom_docs():
    return FileResponse("/index.html")


@app.get("/", summary="Kiểm tra sức khỏe", description="Trả về trạng thái đơn giản để xác minh API đang trực tuyến.")
@limiter.limit("5/minute")
async def root(request: Request):
    return {"status": "200"}


@app.get("/alldata", summary="Nhận tất cả dữ liệu về Stock", description="Trả về toàn bộ dữ liệu hiện đang được thu thập, bao gồm gear, seeds, eggs, cosmetics, event, và weather.")
@limiter.limit("5/minute")
async def alldata(request: Request):
    return latest_data


@app.get("/gear", summary="Lấy dữ liệu Gear Stock", description="Trả về danh sách các Gears hiện có trong stock.")
@limiter.limit("5/minute")
async def get_gear(request: Request):
    return latest_data.get("gearStock", [])


@app.get("/seeds", summary="Lấy dữ liệu Seed Stock", description="Trả về danh sách các Seeds hiện có trong stock.")
@limiter.limit("5/minute")
async def get_seeds(request: Request):
    return latest_data.get("seedsStock", [])


@app.get("/cosmetics", summary="Lấy dữ liệu Cosmetics Stock", description="Trả về danh sách các cosmetics hiện có trong stock.")
@limiter.limit("5/minute")
async def get_cosmetics(request: Request):
    return latest_data.get("cosmeticsStock", [])


@app.get("/eventshop", summary="Lấy dữ liệu Event Shop Stock", description="Trả về danh sách mặt hàng event shop hiện có trong stock.")
@limiter.limit("5/minute")
async def get_eventshop(request: Request):
    return latest_data.get("eventStock", [])


@app.get("/eggs", summary="Lấy dữ liệu Eggs Stock", description="Trả về danh sách trứng có sẵn và số lượng của chúng.")
@limiter.limit("5/minute")
async def get_eggs(request: Request):
    return latest_data.get("eggStock", [])

@app.get("/weather", summary="Lấy dữ liệu thời tiết hiện tại", description="Trả về thông tin thời tiết hiện tại trong trò chơi và các hiệu ứng của nó.")
@limiter.limit("5/minute")
async def get_weather(request: Request):
    return latest_data.get("weather", {})
