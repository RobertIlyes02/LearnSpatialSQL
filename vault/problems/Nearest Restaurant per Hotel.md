# Nearest Restaurant per Hotel

**Difficulty:** Hard | **Topic:** [[Distance]] | **Has Execution:** ✅

## Problem
A Parquet file contains 43 NYC points of interest across hotels, museums, parks, and restaurants.For each hotel, find its nearest restaurant and the approximate walking distance in metres.Use a LATERAL join to run a correlated subquery per hotel row. Approximate metres with ST_Distance(...) * 111000.

## Key Functions
- [[read_parquet]]
- [[ST_Distance]]
- [[LATERAL]]

## Solution
```sql
LOAD spatial;

SELECT h.name AS hotel,
       nr.name AS nearest_restaurant,
       ROUND(ST_Distance(ST_Point(h.lon, h.lat), ST_Point(nr.lon, nr.lat)) * 111000) AS dist_m
FROM read_parquet('./data/nyc_pois.parquet') h,
     LATERAL (
         SELECT r.name, r.lon, r.lat
         FROM read_parquet('./data/nyc_pois.parquet') r
         WHERE r.category = 'restaurant'
         ORDER BY ST_Distance(ST_Point(h.lon, h.lat), ST_Point(r.lon, r.lat))
         LIMIT 1
     ) nr
WHERE h.category = 'hotel'
ORDER BY h.name;
```

## Related Problems
- [[Nearest Neighbor Search]]
- [[Snap Points to Road]]
