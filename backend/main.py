import json
from math import radians, sin, cos, sqrt, atan2
from pathlib import Path
from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "pumps.json"

app = FastAPI(title="Bicycle Pump API")

# Allow all origins for development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

with open(DATA_PATH) as f:
    PUMPS = json.load(f)


def haversine(lat1, lon1, lat2, lon2):
    R = 6371000  # meters
    phi1, phi2 = radians(lat1), radians(lat2)
    dphi = radians(lat2 - lat1)
    dlambda = radians(lon2 - lon1)
    a = sin(dphi / 2) ** 2 + cos(phi1) * cos(phi2) * sin(dlambda / 2) ** 2
    return 2 * R * atan2(sqrt(a), sqrt(1 - a))


@app.get("/nearest")
async def nearest(lat: float = Query(...), lon: float = Query(...)):
    closest = None
    min_dist = float("inf")
    for pump in PUMPS:
        dist = haversine(lat, lon, pump["lat"], pump["lon"])
        if dist < min_dist:
            min_dist = dist
            closest = pump
    return {"pump": closest, "distance": round(min_dist, 1)}


@app.get("/pumps")
async def list_pumps(lat: float | None = Query(None), lon: float | None = Query(None)):
    """Return all pumps. If lat and lon are provided, pumps are returned with a
    distance field and sorted by that distance."""

    pumps = PUMPS.copy()
    if lat is not None and lon is not None:
        for p in pumps:
            p["distance"] = haversine(lat, lon, p["lat"], p["lon"])
        pumps.sort(key=lambda x: x["distance"])
        for p in pumps:
            p["distance"] = round(p["distance"], 1)
    return {"pumps": pumps}
