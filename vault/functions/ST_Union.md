# ST_Union

```sql
-- Aggregate form
ST_Union(geometry) → GEOMETRY          -- dissolve all rows in group

-- Scalar form
ST_Union(geometry_a, geometry_b) → GEOMETRY  -- merge two geometries
```

Merges geometries, removing internal boundaries. The result is the combined area.

## Notes
- More expensive than ST_Collect — it actually merges topologies
- Use in a GROUP BY to dissolve all polygons per category
- Handles overlapping polygons correctly

## Used in
- [[Merge Coverage Areas]]
- [[Polygon Difference Delta]] (related: the inverse operation)

## Topic
[[Aggregation]] · [[Set Ops]]
