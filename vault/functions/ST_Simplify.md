# ST_Simplify

```sql
ST_Simplify(geometry, tolerance) → GEOMETRY
```

Reduces vertex count using the Douglas-Peucker algorithm. Removes vertices within `tolerance` distance of the simplified line.

## Notes
- Larger tolerance = fewer vertices, less accuracy
- Can produce invalid geometries (self-intersections) at high tolerances — check with [[ST_IsValid]]
- Does not preserve topology between features; use ST_SimplifyPreserveTopology for that

## Used in
- [[Simplify Dense Coastline]]
- [[Simplify Dense Geometry]]

## Topic
[[Geometry]] · [[Data Quality]]
