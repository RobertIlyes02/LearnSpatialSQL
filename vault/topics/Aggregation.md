# Aggregation

Collapsing many geometries into one using aggregate spatial functions.

## Key Functions
- [[ST_Collect]] — group geometries into a GeometryCollection (no merging)
- [[ST_Union]] — dissolve/merge geometries, removing internal boundaries
- [[ST_ConvexHull]] — smallest convex polygon enclosing all input geometries
- [[ST_NumGeometries]] — count parts inside a multi-geometry

## Patterns
```sql
-- Union all polygons in a group
SELECT group_id, ST_Union(geom) AS merged
FROM polygons
GROUP BY group_id

-- Convex hull of a point cluster
SELECT ST_ConvexHull(ST_Collect(geom)) FROM points
```

## Problems
- [[Convex Hull of Cluster]] — wrap a point cluster in its convex hull
- [[Merge Coverage Areas]] — dissolve overlapping coverage polygons with ST_Union

## Related
- [[Set Ops]] — pairwise geometry operations (difference, intersection)
- [[Geometry]] — scalar geometry functions
