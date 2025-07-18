import asyncio
import re
import json
from collections import defaultdict
from contextlib import asynccontextmanager

import websockets
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address


def combine_items_by_name(items):
    combined = defaultdict(int)
    for item in items:
        combined[item["name"]] += item.get("quantity", 0)
    return [{"name": name, "quantity": qty, "item_id": normalize_name(name)} for name, qty in combined.items()]


def clean_items(items):
    return items

def normalize_name(name):
    return re.sub(r'\s+', '_', re.sub(r"[^\w\s]", "", name.strip().lower()))

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
}
new_data = {
    "weather": {},
}
# ----------------------------
# WebSocket Listener
# ----------------------------

async def websocket_listener():
    uri = "wss://websocket.joshlei.com/growagarden?user_id=1390149379561885817/"
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print("✅ API WebSocket Connected.")
                async for message in websocket:
                    data = json.loads(message)
                    raw_data = data
                    if "gear_stock" in raw_data:
                        latest_data["gearStock"] = clean_items(raw_data["gear_stock"])
                    if "seed_stock" in raw_data:
                        latest_data["seedsStock"] = clean_items(raw_data["seed_stock"])
                    if "cosmetic_stock" in raw_data:
                        latest_data["cosmeticsStock"] = clean_items(raw_data["cosmetic_stock"])
                    if "eventshop_stock" in raw_data:
                        latest_data["eventStock"] = clean_items(raw_data["eventshop_stock"])
                    if "egg_stock" in raw_data:
                        latest_data["eggStock"] = clean_items(raw_data["egg_stock"])
                            
        except Exception as e:
            print(f"❌ WebSocket error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
                            
        except Exception as e:
            print(f"❌ WebSocket error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
                            
        except Exception as e:
            print(f"❌ WebSocket error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
async def websocket1_listener():
    uri = "wss://websocket.joshlei.com/growagarden?user_id=1266035019390914649/"
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                print("✅ API WebSocket Connected 2.")
                async for message in websocket:
                    data = json.loads(message)
                    raw_data = data
                    if "weather" in raw_data:
                        new_data["weather"] = raw_data["weather"]
        except Exception as e:
            print(f"❌ WebSocket error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
                            
        except Exception as e:
            print(f"❌ WebSocket error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
                            
        except Exception as e:
            print(f"❌ WebSocket error: {e}. Retrying in 5s...")
            await asyncio.sleep(5)
# ----------------------------
# App Initialization
# ----------------------------

@asynccontextmanager
async def lifespan(app: FastAPI):
    asyncio.create_task(websocket_listener())
    asyncio.create_task(websocket1_listener())  
    yield

app = FastAPI(
    title="Grow a Garden API",
    description="Một API cung cấp dữ liệu Seeds, Gear, Egg và Weather từ Grow a Garden Roblox.",
    version="3.5.9",
    lifespan=lifespan,
    license_info={"name": "MIT", "url": "https://opensource.org/licenses/MIT"},
    docs_url=None,
)

# Static & CORS
app.mount("/assets", StaticFiles(directory="assets"), name="assets")
app.mount("/static", StaticFiles(directory="static"), name="static")  # optional for style.css/scripts

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
# Custom HTML Routes (no .html in URL)
# ----------------------------

@app.get("/stocks", include_in_schema=False)
async def serve_stocks():
    return FileResponse("stock.html", media_type="text/html")

@app.get("/docs", include_in_schema=False)
async def serve_docs():
    return FileResponse("index.html", media_type="text/html")

@app.get("/api", summary="Kiểm tra sức khỏe", description="Trả về trạng thái đơn giản để xác minh API đang trực tuyến.")
@limiter.limit("5/minute")
async def root(request: Request):
    return {"status": "200"}

# ----------------------------
# API Routes
# ----------------------------

@app.get("/api/stock")
@limiter.limit("5/minute")
async def alldata(request: Request):
    return latest_data
@app.get("/api/stock/weather")
@limiter.limit("5/minute")
async def get_weather(request: Request):
    return new_data
