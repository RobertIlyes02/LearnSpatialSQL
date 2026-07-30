# Spatial Window Function

**Difficulty:** Hard | **Topic:** [[Analytics]] | **Has Execution:** ❌ | **Premium:** ✅

## Problem
Use SQL window functions partitioned by spatial containment to rank or aggregate features within their enclosing zone.

## Key Functions / SQL
- [[ST_Within]] — used in the spatial join to assign each feature to its zone
- `PARTITION BY` — window partition on the zone identifier
- `RANK()` / `ROW_NUMBER()` — ranking within each spatial partition

## Approach
```sql
LOAD spatial;

SELECT f.id,
       z.zone_name,
       RANK() OVER (PARTITION BY z.zone_id ORDER BY f.value DESC) AS rank_in_zone
FROM features f
JOIN zones z ON ST_Within(f.geom, z.geom);
```

## Related Problems
- [[Point in Polygon]] — the underlying spatial join pattern
- [[Spatial Join Two Layers]] — generalized spatial join
