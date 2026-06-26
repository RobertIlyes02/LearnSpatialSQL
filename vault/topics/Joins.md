# Joins

Spatial joins connect two tables using a geometry relationship instead of (or in addition to) an equality condition.

## Pattern
```sql
SELECT a.id, b.name
FROM layer_a a
JOIN layer_b b ON ST_Intersects(a.geom, b.geom)
```

## Key Functions
- [[ST_Intersects]] — most common join predicate
- [[ST_Within]] — containment join
- [[ST_DWithin]] — proximity join

## Problems
- [[Spatial Join Two Layers]] — join two feature layers on ST_Intersects

## Related
- [[Predicates]] — the ON clause of a spatial join is a spatial predicate
- [[Indexing]] — index support makes large spatial joins tractable
