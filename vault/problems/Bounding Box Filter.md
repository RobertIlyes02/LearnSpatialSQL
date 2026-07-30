# Bounding Box Filter

**Difficulty:** Easy | **Topic:** [[Indexing]] | **Has Execution:** ✅

## Problem
Use bounding box operations to quickly filter candidate geometries before running an exact predicate.

## Key Functions
- [[ST_Envelope]] — minimum bounding rectangle of a geometry
- [[ST_Intersects]] — TRUE if bounding boxes (or exact geometries) overlap

## Approach
```sql
LOAD spatial;

SELECT a.id
FROM features a, query_area q
WHERE ST_Intersects(ST_Envelope(a.geom), q.geom);
```

## Related Problems
- [[Spatial Join Two Layers]] — full spatial join using exact predicates
- [[Nearest Neighbor Search]] — filter by distance, not bounding box
