# Detect Invalid Geometries

**Difficulty:** Easy | **Topic:** [[Data Quality]] | **Has Execution:** ✅

## Problem
Find all geometries in a table that fail validity checks and return the reason for each failure.

## Key Functions
- [[ST_IsValid]] — returns FALSE for self-intersecting rings, unclosed rings, etc.
- [[ST_IsValidReason]] — human-readable explanation of the invalidity

## Approach
```sql
LOAD spatial;

SELECT id, ST_IsValidReason(geom) AS reason
FROM features
WHERE NOT ST_IsValid(geom);
```

## Related Problems
- [[Simplify Dense Coastline]] — over-simplification can introduce invalidity
- [[Polygon Difference Delta]] — set ops on invalid geometries produce undefined results
