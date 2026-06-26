# Set Ops

Pairwise geometry set operations — the spatial equivalent of SQL's UNION / INTERSECT / EXCEPT.

## Key Functions
- [[ST_Union]] — merge two geometries into one (also an aggregate)
- [[ST_Intersection]] — area/line where both geometries overlap
- [[ST_Difference]] — part of A that does not overlap B
- [[ST_SymDifference]] — parts of A and B that don't overlap each other

## Pattern
```sql
-- Area in zone A but NOT in zone B
SELECT ST_Difference(a.geom, b.geom) AS exclusive_area
FROM zone_a a, zone_b b
```

## Problems
- [[Polygon Difference Delta]] — compute zone delta using ST_Difference + CTE
- [[LineString Intersection]] — find where two line layers cross using ST_Intersection

## Related
- [[Aggregation]] — ST_Union as an aggregate over many rows
- [[Predicates]] — use ST_Intersects first to find candidate pairs
