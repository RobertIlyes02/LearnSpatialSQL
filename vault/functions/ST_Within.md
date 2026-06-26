# ST_Within

```sql
ST_Within(geometry_a, geometry_b) → BOOLEAN
```

Returns TRUE if geometry A is **completely inside** geometry B (no boundary touching).

## Notes
- Opposite: `ST_Contains(b, a)`
- If point is on the boundary of the polygon, ST_Within returns FALSE; use ST_Covers instead
- Requires `LOAD spatial;`

## Used in
- [[Point in Polygon]]
- [[Flood Risk Buffer]]
- [[Spatial Window Function]]

## Topic
[[Predicates]] · [[Joins]] · [[Buffering]] · [[Analytics]]
