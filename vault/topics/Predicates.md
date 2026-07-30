# Predicates

Spatial predicates test relationships between geometries and return TRUE/FALSE.

## Key Functions
- [[ST_Within]] — A is completely inside B
- [[ST_Intersects]] — A and B share any point
- [[ST_Contains]] — B completely contains A (inverse of ST_Within)
- [[ST_Touches]] — geometries share a boundary but interiors don't overlap
- [[ST_Crosses]] — geometries share some interior points

## Problems
- [[Point in Polygon]] — use ST_Within to find incidents inside parks

## Related
- [[Joins]] — predicates power spatial joins
- [[Indexing]] — bounding-box pre-filter before predicate check
