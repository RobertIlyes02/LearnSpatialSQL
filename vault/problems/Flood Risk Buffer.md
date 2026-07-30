# Flood Risk Buffer

**Difficulty:** Medium | **Topic:** [[Buffering]] | **Has Execution:** ✅

## Problem
Identify properties that fall within a buffer zone around flood-risk areas.

## Key Functions
- [[ST_Buffer]] — expand flood zone geometry by a given distance
- [[ST_Within]] — check if a property falls inside the buffer

## Approach
```sql
LOAD spatial;

SELECT p.id, p.address
FROM properties p
JOIN flood_zones f
  ON ST_Within(p.geom, ST_Buffer(f.geom, 0.005));  -- ~500m
```

## Related Problems
- [[Point in Polygon]] — same ST_Within containment check without a buffer
- [[Nearest Neighbor Search]] — ST_DWithin is often more efficient than Buffer + Within
