# Cluster DBSCAN Points

**Difficulty:** Hard | **Topic:** [[Clustering]] | **Has Execution:** ❌

## Problem
Assign each point to a density-based cluster (or mark it as noise) using DBSCAN.

## Key Functions
- [[ST_ClusterDBSCAN]] — window function that returns a cluster ID per row

## Approach
```sql
LOAD spatial;

SELECT id,
       ST_ClusterDBSCAN(geom, 0.01, 3) OVER () AS cluster_id
FROM points;
-- NULL cluster_id = noise point
```

## Related Problems
- [[Convex Hull of Cluster]] — wrap each resulting cluster in its convex hull
- [[H3 Compact Resolution]] — discrete grid alternative to density-based clustering
