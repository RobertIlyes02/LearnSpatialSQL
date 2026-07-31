# Reproject to Web Mercator

**Difficulty:** Medium | **Topic:** [[Projection]] | **Has Execution:** ✅

## Problem
Web maps (Google, OSM) draw in Web Mercator (EPSG:3857), but GPS data arrives in WGS84 (EPSG:4326). Reproject three NYC landmarks so they can be plotted on a web map.Return name, merc_x, merc_y — the Web Mercator coordinates rounded to whole metres — ordered by name.⚠️ The classic gotcha: DuckDB's ST_Transform follows the official EPSG:4326 axis order, which is latitude first. Build your input point as ST_Point(lat, lon) — not the usual (lon, lat) — or your landmarks will land in the Indian Ocean.

## Key Functions
- [[ST_Transform]]
- [[EPSG]]

## Solution
```sql
LOAD spatial;

SELECT name,
       ROUND(ST_X(ST_Transform(ST_Point(lat, lon), 'EPSG:4326', 'EPSG:3857'))) AS merc_x,
       ROUND(ST_Y(ST_Transform(ST_Point(lat, lon), 'EPSG:4326', 'EPSG:3857'))) AS merc_y
FROM landmarks
ORDER BY name;
```

## Related Problems
- [[Reverse Geocode Grid]]
