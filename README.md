# Bicycle-Pump Finder

## 1. Architecture Overview

### Diagram
```
[Mobile App] <-> [Backend API] <-> [Database]
```

### Tech Stack
- **Frontend**: React Native + TypeScript. Developer friendly and cross-platform.
- **Backend**: FastAPI (Python) or Node.js with Express. Easy JSON APIs.
- **Database**: PostGIS for spatial queries; SQLite/GeoJSON alternative for lightweight setups.

## 2. Data Sourcing
- Public datasets: Copenhagen Open Data (data.kk.dk), OpenStreetMap, Kortforsyningen.
- Required fields: name, lat, lon, pump type, accessibility, last update.

### Sample Python Script
```python
import requests
import pandas as pd

url = "https://example.com/bicycle_pumps.csv"  # Replace with real dataset
csv_data = requests.get(url).content.decode("utf-8")
df = pd.read_csv(pd.compat.StringIO(csv_data))
# Clean columns, convert to PostGIS
```

## 3. Core Features
A. Find nearest pump via device GPS.  
B. Address search with free geocoder (e.g., Nominatim).  
C. Map view with markers; list view sorted by distance.  
D. Detail page with pump info and directions link.  
E. Optional offline cache.

## 4. UX & UI
- Home screen: search bar + "use my location" button.
- Map screen: markers for pumps, list of nearest.
- Detail card: pump type, hours, maintenance notes.
- Danish/English localisation; accessibility friendly colors.

## 5. Step-by-Step Build Plan
1. Setup repo and CI (2h).
2. Build API with sample dataset (4h).
3. Implement geolocation feature in React Native (4h).
4. Map screen and list view (6h).
5. Detail pages and directions links (4h).
6. Testing (unit + e2e) (4h).

Deployment: GitHub Actions to build & deploy; mobile store publishing steps.

## 6. Sample Code Snippets
### React Native Component
```tsx
import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';

export default function NearestPump() {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      const res = await fetch(
        `https://api.example.com/nearest?lat=${coords.latitude}&lon=${coords.longitude}`
      );
      setInfo(await res.json());
    });
  }, []);

  if (!info) return <Text>Loading...</Text>;
  return (
    <View>
      <Text>{info.name}</Text>
      <Text>{info.distance} meters away</Text>
    </View>
  );
}
```

### PostGIS Query
```sql
SELECT name, ST_DistanceSphere(geom, ST_MakePoint(%s, %s)) AS distance
FROM pumps
ORDER BY geom <-> ST_MakePoint(%s, %s)
LIMIT 1;
```

### API Endpoint Skeleton (FastAPI)
```python
from fastapi import FastAPI, Query
import psycopg2

app = FastAPI()

@app.get('/nearest')
def nearest(lat: float = Query(...), lon: float = Query(...)):
    # Connect to DB and run ST_DistanceSphere query
    return {"name": "Sample Pump", "distance": 100}
```

## 7. License & Data Compliance
- Datasets under Open Data DK / OSM licences; include attribution.
- No storing personal GPS history; GDPR compliant.

## 8. Next Steps / Enhancements
- Feedback form to report broken pumps.
- Daily dataset refresh cron job.
- Integrate bike-lane status feeds.
- Optional Apple Watch / Wear OS support.


## Running the MVP Backend

Install dependencies and start the server:

```bash
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload
```

The `/nearest` endpoint expects `lat` and `lon` query parameters and returns the closest pump from the sample dataset.

## MVP React Native App

The `frontend` folder contains a minimal `App.tsx` that fetches from the backend. Use Expo or your preferred React Native setup to run it.
