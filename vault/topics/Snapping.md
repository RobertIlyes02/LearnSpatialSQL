# Snapping

Finding the nearest point on a geometry to another geometry.

## Key Functions
- [[ST_ClosestPoint]] — returns the point on geometry B closest to geometry A
- [[ST_Snap]] — snap vertices of A to B within a tolerance

## Pattern
```sql
-- Project each point onto the nearest road segment
SELECT p.id,
       ST_ClosestPoint(r.geom, p.geom) AS snapped
FROM points p
CROSS JOIN roads r
ORDER BY ST_Distance(p.geom, r.geom)
LIMIT 1  -- per point (use LATERAL in practice)
```

## Problems
- [[Snap Points to Road]] — snap GPS pings to nearest road using ST_ClosestPoint

## Related
- [[Distance]] — ST_Distance used to rank candidate snapping targets
- [[Geometry]] — output is a new geometry (the snapped point)
