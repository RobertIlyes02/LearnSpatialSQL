# Compass Bearings Between Hubs

**Difficulty:** Hard | **Topic:** [[Measurement]] | **Has Execution:** ✅

## Problem
Flight planners quote routes by compass bearing. Compute the initial bearing between every pair of airport hubs.Self-join the hubs table to form each unordered pair exactly once (use a.code < b.code), and return the bearing from A to B in degrees.Return from_ap, to_ap, bearing_deg (rounded to 1 decimal place), ordered by from_ap, to_ap.

## Key Functions
- [[ST_Azimuth]]
- [[JOIN]]

## Solution
```sql
LOAD spatial;

SELECT a.code AS from_ap,
       b.code AS to_ap,
       ROUND(degrees(ST_Azimuth(a.geom, b.geom)), 1) AS bearing_deg
FROM hubs a
JOIN hubs b ON a.code < b.code
ORDER BY from_ap, to_ap;
```

## Related Problems
- [[Busiest US Flight Routes]]
- [[Nearest Neighbor Search]]
