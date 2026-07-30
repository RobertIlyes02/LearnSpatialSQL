# LineString Intersection

**Difficulty:** Medium | **Topic:** [[Set Ops]] | **Has Execution:** ❌

## Problem
Find the exact point(s) where two line layers cross using ST_Intersection.

## Key Functions
- [[ST_Intersection]] — returns the shared geometry between two inputs
- [[ST_Intersects]] — predicate: used first to filter candidate pairs

## Approach
```sql
LOAD spatial;

SELECT a.id AS road_a, b.id AS road_b,
       ST_Intersection(a.geom, b.geom) AS crossing_point
FROM roads a
JOIN roads b ON a.id < b.id AND ST_Intersects(a.geom, b.geom);
```

## Related Problems
- [[Polygon Difference Delta]] — ST_Difference (what A has that B doesn't)
- [[Spatial Join Two Layers]] — ST_Intersects join without extracting the intersection
