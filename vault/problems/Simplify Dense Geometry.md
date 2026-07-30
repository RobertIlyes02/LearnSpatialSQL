# Simplify Dense Geometry

**Difficulty:** Medium | **Topic:** [[Geometry]] | **Has Execution:** ❌

## Problem
Apply Douglas-Peucker simplification to a dense geometry at a given tolerance.

## Key Functions
- [[ST_Simplify]] — simplify with a tolerance in the geometry's coordinate units

## Approach
```sql
LOAD spatial;

SELECT id, ST_Simplify(geom, 0.001) AS simplified
FROM dense_features;
```

## Related Problems
- [[Simplify Dense Coastline]] — same function with before/after vertex count comparison
- [[Detect Invalid Geometries]] — check output validity after simplification
