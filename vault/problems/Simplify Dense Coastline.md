# Simplify Dense Coastline

**Difficulty:** Medium | **Topic:** [[Geometry]] | **Has Execution:** ✅

## Problem
Reduce the vertex count of a dense coastline geometry using a tolerance, and verify the reduction with ST_NPoints.

## Key Functions
- [[ST_Simplify]] — Douglas-Peucker simplification; removes vertices within tolerance distance of the simplified line
- [[ST_NPoints]] — count vertices before/after to measure reduction

## Approach
```sql
LOAD spatial;

SELECT ST_NPoints(geom)                    AS original_points,
       ST_NPoints(ST_Simplify(geom, 0.01)) AS simplified_points,
       ST_Simplify(geom, 0.01)             AS simplified_geom
FROM coastlines;
```

## Related Problems
- [[Simplify Dense Geometry]] — same function, generic geometry
- [[Detect Invalid Geometries]] — over-simplification can produce invalid geometries
