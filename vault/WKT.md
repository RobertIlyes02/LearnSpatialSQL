# WKT — Well-Known Text

A text markup language for representing vector geometry objects.

## Format examples
```
POINT(30 10)
LINESTRING(30 10, 10 30, 40 40)
POLYGON((30 10, 40 40, 20 40, 10 20, 30 10))
MULTIPOINT((10 40), (40 30))
GEOMETRYCOLLECTION(POINT(4 6), LINESTRING(4 6, 7 10))
```

## Parse with
- [[ST_GeomFromText]] in DuckDB

## Export with
- `ST_AsText(geom)` — convert geometry back to WKT string

## Related
- [[EPSG 4326]] — coordinate system most WKT in this project uses
