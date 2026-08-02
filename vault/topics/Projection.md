# Projection

Coordinate reference systems (CRS) and reprojection. GPS data arrives in **WGS84
(EPSG:4326)** degrees; web maps render in **Web Mercator (EPSG:3857)** metres.
`ST_Transform` converts between them.

⚠️ DuckDB's `ST_Transform` follows the official EPSG:4326 axis order — **latitude
first**. Build points as `ST_Point(lat, lon)` when transforming from 4326, or your
coordinates land in the wrong hemisphere.

## Key Functions
- [[ST_Transform]]

## Problems
- [[Reproject to Web Mercator]]

## Related
- [[EPSG 4326]]
- [[Geocoding]]
