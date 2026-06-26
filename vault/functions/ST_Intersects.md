# ST_Intersects

```sql
ST_Intersects(geometry_a, geometry_b) → BOOLEAN
```

Returns TRUE if geometries A and B share **any point** (boundary or interior).

## Notes
- Faster than most predicates because it can be evaluated against bounding boxes first
- Equivalent to `NOT ST_Disjoint(a, b)`
- The most common spatial join predicate

## Used in
- [[Bounding Box Filter]]
- [[Spatial Join Two Layers]]
- [[LineString Intersection]]

## Topic
[[Predicates]] · [[Joins]] · [[Indexing]] · [[Set Ops]]
