# Reverse Geocode Grid

**Difficulty:** Medium | **Topic:** [[Geocoding]] | **Has Execution:** ✅

## Problem
Bin point geometries into a regular lat/lon grid by extracting coordinates and flooring them to a grid resolution.

## Key Functions
- [[ST_X]] — extract longitude from a point
- [[ST_Y]] — extract latitude from a point
- `FLOOR` — round down to grid cell boundary

## Approach
```sql
LOAD spatial;

SELECT FLOOR(ST_X(geom) / 0.01) * 0.01 AS grid_lon,
       FLOOR(ST_Y(geom) / 0.01) * 0.01 AS grid_lat,
       COUNT(*) AS point_count
FROM events
GROUP BY grid_lon, grid_lat;
```

## Related Problems
- [[Neighbourhood Centroids]] — also uses ST_X, ST_Y to read point coordinates
- [[H3 Compact Resolution]] — H3 is an alternative discrete global grid
