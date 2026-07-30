# Spatial Join Two Layers

**Difficulty:** Medium | **Topic:** [[Joins]] | **Has Execution:** ✅

## Problem
Join two spatial feature layers on a geometric relationship (intersection).

## Key Functions
- [[ST_Intersects]] — join predicate: TRUE when geometries share any point

## Approach
```sql
LOAD spatial;

SELECT a.id AS a_id, b.id AS b_id
FROM layer_a a
JOIN layer_b b ON ST_Intersects(a.geom, b.geom);
```

## Related Problems
- [[Point in Polygon]] — containment-based spatial join (ST_Within)
- [[Bounding Box Filter]] — fast pre-filter before exact join
