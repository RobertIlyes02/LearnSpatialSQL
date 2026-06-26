# Clustering

Grouping nearby points into spatial clusters.

## Key Functions
- [[ST_ClusterDBSCAN]] — density-based spatial clustering (DBSCAN algorithm)
- [[ST_ClusterKMeans]] — partition points into k clusters by proximity

## ST_ClusterDBSCAN signature
```sql
ST_ClusterDBSCAN(geom, eps, minpoints) OVER (...)
```
- `eps` — neighborhood radius
- `minpoints` — minimum points to form a core point

## Pattern
```sql
SELECT id,
       ST_ClusterDBSCAN(geom, 0.01, 3) OVER () AS cluster_id
FROM points
```
Returns NULL for noise points (not in any cluster).

## Problems
- [[Cluster DBSCAN Points]] — cluster a point dataset with ST_ClusterDBSCAN

## Related
- [[H3 Grid]] — alternative discrete approach to spatial aggregation
- [[Aggregation]] — aggregate stats per cluster after assignment
