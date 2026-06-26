# Point in Polygon

**Difficulty:** Easy | **Topic:** [[Predicates]] | **Has Execution:** ✅

## Problem
Given a table of city parks (polygons) and a table of incident reports (points), find all incidents that fall inside any park.

Return `incident_id` and `park_name` ordered by `incident_id`.

## Key Functions
- [[ST_Within]] — `ST_Within(point, polygon)` returns TRUE when point is fully inside polygon

## Approach
Spatial join on the predicate: for each incident, find the park (if any) whose geometry contains the incident's point.

```sql
LOAD spatial;

SELECT i.incident_id, p.park_name
FROM incidents i
JOIN parks p ON ST_Within(i.geom, p.geom)
ORDER BY i.incident_id;
```

## Tables
| Table | Relevant columns |
|-------|-----------------|
| `parks` | `park_id`, `park_name`, `geom` (Polygon, EPSG:4326) |
| `incidents` | `incident_id`, `geom` (Point) |

## Related Problems
- [[Spatial Join Two Layers]] — same join pattern, different layers
- [[Flood Risk Buffer]] — adds a buffer before the containment check
