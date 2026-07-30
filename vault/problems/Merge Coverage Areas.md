# Merge Coverage Areas

**Difficulty:** Medium | **Topic:** [[Aggregation]] | **Has Execution:** ✅

## Problem
Dissolve overlapping coverage polygons into a unified coverage area and count the resulting geometry parts.

## Key Functions
- [[ST_Union]] — dissolve/merge all polygons, removing internal boundaries
- [[ST_NumGeometries]] — count parts in the resulting multi-polygon

## Approach
```sql
LOAD spatial;

SELECT ST_NumGeometries(ST_Union(geom)) AS coverage_parts,
       ST_Union(geom)                   AS merged_coverage
FROM coverage_areas;
```

## Related Problems
- [[Convex Hull of Cluster]] — another geometry aggregation pattern
- [[Polygon Difference Delta]] — subtract one area from another
