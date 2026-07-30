# Snap Points to Road

**Difficulty:** Medium | **Topic:** [[Snapping]] | **Has Execution:** ✅

## Problem
For each GPS point, find the nearest point on the road network and return its coordinates.

## Key Functions
- [[ST_ClosestPoint]] — `ST_ClosestPoint(line, point)` returns the point on `line` closest to `point`
- [[ST_X]] / [[ST_Y]] — extract coordinates from the snapped point

## Approach
```sql
LOAD spatial;

SELECT p.id,
       ST_X(ST_ClosestPoint(r.geom, p.geom)) AS snapped_lon,
       ST_Y(ST_ClosestPoint(r.geom, p.geom)) AS snapped_lat
FROM gps_points p
JOIN roads r ON ST_DWithin(p.geom, r.geom, 0.01)  -- candidate filter
ORDER BY p.id, ST_Distance(p.geom, r.geom)
LIMIT 1 PER GROUP;  -- pseudo-syntax; use LATERAL or ROW_NUMBER in practice
```

## Related Problems
- [[Nearest Neighbor Search]] — nearest geometry, not nearest point on geometry
- [[Neighbourhood Centroids]] — ST_X / ST_Y for coordinate extraction
