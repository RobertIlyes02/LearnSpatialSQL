# Neighbourhood Centroids

**Difficulty:** Easy | **Topic:** [[Geometry]] | **Has Execution:** ✅

## Problem
Compute the centroid of each neighbourhood polygon and return its lat/lon coordinates.

## Key Functions
- [[ST_Centroid]] — geometric center of a polygon
- [[ST_X]] — extract longitude of resulting point
- [[ST_Y]] — extract latitude of resulting point

## Approach
```sql
LOAD spatial;

SELECT name,
       ST_X(ST_Centroid(geom)) AS lon,
       ST_Y(ST_Centroid(geom)) AS lat
FROM neighbourhoods;
```

## Related Problems
- [[Reverse Geocode Grid]] — also extracts ST_X / ST_Y from points
- [[Snap Points to Road]] — another geometry-to-point output
