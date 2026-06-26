# Buffering

Creating zones of a fixed distance around a geometry.

## Key Functions
- [[ST_Buffer]] — expand (or shrink with negative distance) a geometry by a given radius

## Pattern
```sql
-- Find buildings within 500m of a flood zone
SELECT b.id
FROM buildings b
JOIN flood_zones f
  ON ST_Within(b.geom, ST_Buffer(f.geom, 0.005))  -- ~500m in degrees
```

## Unit note
In EPSG:4326, buffer distance is in degrees (~0.001° ≈ 111m at the equator). Project to a metric CRS for accurate metric buffers.

## Problems
- [[Flood Risk Buffer]] — identify properties inside a buffered hazard zone

## Related
- [[Distance]] — ST_DWithin is often more efficient than Buffer + ST_Within
- [[Predicates]] — containment check follows buffer construction
