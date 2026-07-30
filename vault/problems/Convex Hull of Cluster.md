# Convex Hull of Cluster

**Difficulty:** Medium | **Topic:** [[Aggregation]] | **Has Execution:** ✅

## Problem
Given a set of points, compute the convex hull polygon that encloses them all.

## Key Functions
- [[ST_Collect]] — aggregate points into a GeometryCollection
- [[ST_ConvexHull]] — compute the convex hull of a geometry

## Approach
```sql
LOAD spatial;

SELECT cluster_id, ST_ConvexHull(ST_Collect(geom)) AS hull
FROM points
GROUP BY cluster_id;
```

## Related Problems
- [[Merge Coverage Areas]] — ST_Union as another geometry aggregation
- [[Cluster DBSCAN Points]] — assign cluster IDs before aggregating
