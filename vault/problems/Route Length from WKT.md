# Route Length from WKT

**Difficulty:** Easy | **Topic:** [[Measurement]] | **Has Execution:** ✅

## Problem
Parse a road geometry from WKT and compute its length.

## Key Functions
- [[ST_GeomFromText]] — parse WKT string into a geometry
- [[ST_Length]] — length of a LineString

## Approach
```sql
LOAD spatial;

SELECT ST_Length(ST_GeomFromText('LINESTRING(...)')) AS length_deg;
```

## Related Problems
- [[Perimeter of Land Parcels]] — ST_Length of a polygon boundary
- [[Neighbourhood Centroids]] — another geometry access pattern
