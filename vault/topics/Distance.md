# Distance

Measuring and querying by distance between geometries.

## Key Functions
- [[ST_Distance]] — Euclidean distance between two geometries
- [[ST_DWithin]] — TRUE if geometries are within a given distance

## Patterns
- Nearest neighbor: `ORDER BY ST_Distance(a.geom, target) LIMIT 1`
- Distance filter: `WHERE ST_Distance(a.geom, b.geom) < radius`

## Problems
- [[Nearest Neighbor Search]] — find the closest feature using ORDER BY ST_Distance

## Related
- [[Measurement]] — length and area (not point-to-point distance)
- [[Buffering]] — create zones of given distance around a geometry
