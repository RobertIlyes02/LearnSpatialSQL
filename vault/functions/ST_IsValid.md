# ST_IsValid / ST_IsValidReason

```sql
ST_IsValid(geometry) → BOOLEAN
ST_IsValidReason(geometry) → VARCHAR
```

`ST_IsValid` — returns FALSE for geometries with topological errors (self-intersections, unclosed rings, etc.).
`ST_IsValidReason` — returns a human-readable description of the first validity violation found.

## Common invalidity reasons
- `Self-intersection` — polygon ring crosses itself (bowtie)
- `Ring Self-intersection` — inner ring crosses outer ring
- `Duplicate Rings` — two rings identical
- `Too few points in geometry component` — fewer than 3 points in a ring

## Used in
- [[Detect Invalid Geometries]]

## Topic
[[Data Quality]]
