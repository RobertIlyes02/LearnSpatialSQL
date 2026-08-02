# NYC Taxi Pickup Hotspots

**Difficulty:** Medium | **Topic:** [[Geocoding]] | **Has Execution:** ✅

## Problem
You have a sample of 2,000 NYC taxi trips stored in a Parquet file. Each row has a pickup latitude and longitude.Bin pickups into a 0.01° grid (roughly 1 km cells) and return the top 5 cells by pickup count.Use FLOOR(col / 0.01) * 0.01 to snap each coordinate to the nearest grid corner, and ROUND(..., 2) to clean up floating-point noise.

## Key Functions
- [[read_parquet]]
- [[ST_Point]]
- [[FLOOR]]

## Solution
```sql
LOAD spatial;

SELECT ROUND(FLOOR(pickup_lat / 0.01) * 0.01, 2) AS grid_lat,
       ROUND(FLOOR(pickup_lon / 0.01) * 0.01, 2) AS grid_lon,
       COUNT(*) AS pickups
FROM read_parquet('./data/nyc_taxi_sample.parquet')
GROUP BY grid_lat, grid_lon
ORDER BY pickups DESC
LIMIT 5;
```

## Related Problems
- [[Reverse Geocode Grid]]
- [[H3 Hexbin Hotspots]]
- [[Rush Hour Fare Analysis]]
