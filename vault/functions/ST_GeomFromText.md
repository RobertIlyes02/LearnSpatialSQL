# ST_GeomFromText

```sql
ST_GeomFromText(wkt_string) → GEOMETRY
ST_GeomFromText(wkt_string, srid) → GEOMETRY
```

Parses a WKT (Well-Known Text) string into a geometry value.

## Common WKT examples
```
POINT(-73.98 40.72)
LINESTRING(-73.98 40.72, -73.97 40.73)
POLYGON((-73.99 40.71, -73.97 40.71, -73.97 40.73, -73.99 40.73, -73.99 40.71))
```

## Shorthand aliases
- `ST_Point(x, y)` — shortcut for a point
- `ST_GeomFromWKB(bytes)` — binary equivalent

## Used in
- [[Route Length from WKT]]
- [[Point in Polygon]] (setup data)

## Topic
[[Geometry]] · [[I-O]]
