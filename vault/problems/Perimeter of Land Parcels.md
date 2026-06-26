# Perimeter of Land Parcels

**Difficulty:** Easy | **Topic:** [[Measurement]] | **Has Execution:** ✅

## Problem
Compute the perimeter of each land parcel polygon by extracting its boundary ring and measuring its length.

## Key Functions
- [[ST_Boundary]] — returns the boundary geometry (the ring) of a polygon
- [[ST_Length]] — length of the resulting LineString boundary

## Approach
```sql
LOAD spatial;

SELECT parcel_id,
       ST_Length(ST_Boundary(geom)) AS perimeter
FROM parcels
ORDER BY perimeter DESC;
```

## Note
`ST_Perimeter` is equivalent but not available in all DuckDB versions; `ST_Length(ST_Boundary(...))` is the portable form.

## Related Problems
- [[Route Length from WKT]] — ST_Length on a LineString directly
- [[Detect Invalid Geometries]] — validate parcels before computing perimeters
