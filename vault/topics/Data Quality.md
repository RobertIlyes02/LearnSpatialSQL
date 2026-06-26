# Data Quality

Validating geometry integrity before analysis.

## Key Functions
- [[ST_IsValid]] — returns TRUE if geometry is topologically valid (no self-intersections, etc.)
- [[ST_IsValidReason]] — returns a string explaining why a geometry is invalid
- [[ST_MakeValid]] — attempt to repair an invalid geometry

## Common invalidity causes
- Self-intersecting rings (bowtie polygons)
- Duplicate vertices
- Rings not closed
- Holes outside the outer shell

## Pattern
```sql
-- Find and explain all invalid geometries
SELECT id, ST_IsValidReason(geom) AS reason
FROM features
WHERE NOT ST_IsValid(geom)
```

## Problems
- [[Detect Invalid Geometries]] — identify and explain invalid geometries with ST_IsValid + ST_IsValidReason

## Related
- [[Geometry]] — geometry construction; bad input can produce invalid geometries
- [[Set Ops]] — set operations on invalid geometries produce undefined results
