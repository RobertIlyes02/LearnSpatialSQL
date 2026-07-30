# Analytics

Window functions and advanced SQL combined with spatial context.

## Patterns

### Spatial partitioning
```sql
-- Rank points by distance within each zone
SELECT p.id,
       z.zone_name,
       RANK() OVER (PARTITION BY z.zone_id ORDER BY p.score DESC) AS rank_in_zone
FROM points p
JOIN zones z ON ST_Within(p.geom, z.geom)
```

### Running totals along a route
```sql
SELECT id,
       SUM(ST_Length(geom)) OVER (ORDER BY segment_order) AS cumulative_length
FROM route_segments
```

## Key SQL constructs
- `PARTITION BY` — divide result set by zone or category
- `ORDER BY` (window) — ordering within a partition
- `RANK()`, `ROW_NUMBER()`, `LEAD()`, `LAG()` — standard window functions

## Problems
- [[Spatial Window Function]] — partition by spatial containment using ST_Within

## Related
- [[Joins]] — spatial join is usually the first step to assign a zone
- [[Predicates]] — ST_Within used as the partitioning predicate
