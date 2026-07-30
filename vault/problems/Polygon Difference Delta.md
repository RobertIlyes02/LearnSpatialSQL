# Polygon Difference Delta

**Difficulty:** Hard | **Topic:** [[Set Ops]] | **Has Execution:** ✅

## Problem
Compute the area that exists in one polygon but not another (zone delta).

## Key Functions
- [[ST_Difference]] — part of geometry A that does not overlap B

## Approach
Use a CTE to name each zone, then compute the difference.

```sql
LOAD spatial;

WITH zones AS (
  SELECT geom FROM zone_table WHERE name = 'A'
), old_zone AS (
  SELECT geom FROM zone_table WHERE name = 'B'
)
SELECT ST_Difference(z.geom, o.geom) AS delta
FROM zones z, old_zone o;
```

## Related Problems
- [[LineString Intersection]] — ST_Intersection (opposite: what they share)
- [[Merge Coverage Areas]] — ST_Union (merging instead of differencing)
