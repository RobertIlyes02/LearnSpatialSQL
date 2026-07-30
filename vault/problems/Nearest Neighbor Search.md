# Nearest Neighbor Search

**Difficulty:** Easy | **Topic:** [[Distance]] | **Has Execution:** ✅

## Problem
Find the nearest feature to a given query point using distance ordering.

## Key Functions
- [[ST_Distance]] — returns the distance between two geometries

## Approach
Sort by distance from a target and take the top result.

```sql
LOAD spatial;

SELECT id, name, ST_Distance(geom, ST_Point(-73.98, 40.72)) AS dist
FROM features
ORDER BY dist
LIMIT 1;
```

## Related Problems
- [[Snap Points to Road]] — nearest point ON a geometry (not nearest geometry)
- [[Bounding Box Filter]] — pre-filter candidates before exact distance computation
