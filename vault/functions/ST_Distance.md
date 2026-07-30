# ST_Distance

```sql
ST_Distance(geometry_a, geometry_b) → DOUBLE
```

Returns the minimum Euclidean distance between two geometries.

## Notes
- In EPSG:4326 units are degrees; use a projected CRS for meters
- For "within distance" queries, `ST_DWithin` is more efficient than `ST_Distance < x`
- Returns 0 if geometries overlap

## Used in
- [[Nearest Neighbor Search]]

## Topic
[[Distance]]
