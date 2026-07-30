# ST_Buffer

```sql
ST_Buffer(geometry, distance) → GEOMETRY
```

Returns a geometry expanded by `distance` in all directions. Negative distance shrinks the geometry (inward buffer / erosion).

## Notes
- Distance units match the coordinate system (degrees for EPSG:4326)
- For polygons, produces a larger polygon with rounded corners by default
- Prefer `ST_DWithin` over `ST_Buffer + ST_Within` for pure distance filtering — it skips the intermediate geometry

## Used in
- [[Flood Risk Buffer]]

## Topic
[[Buffering]]
