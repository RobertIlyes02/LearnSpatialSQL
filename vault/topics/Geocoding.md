# Geocoding

Converting between coordinate values and human-readable location references.

## Key Functions
- [[ST_X]] — extract longitude (x) from a point
- [[ST_Y]] — extract latitude (y) from a point
- [[ST_Z]] — extract elevation (z) from a 3D point
- [[ST_Point]] — construct a point from x, y coordinates

## Reverse geocoding pattern
Snap a coordinate to a grid cell to assign a human-readable tile ID:
```sql
SELECT FLOOR(ST_X(geom) / cell_size) AS grid_col,
       FLOOR(ST_Y(geom) / cell_size) AS grid_row
FROM points
```

## Problems
- [[Reverse Geocode Grid]] — bin points into a lat/lon grid using ST_X, ST_Y, FLOOR

## Related
- [[Geometry]] — geometry construction functions (ST_GeomFromText, ST_GeomFromWKB)
- [[Measurement]] — projecting to metric CRS for accurate distances
