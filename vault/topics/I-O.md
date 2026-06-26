# I/O

Reading and writing spatial file formats with DuckDB.

## Key Functions / Statements
- [[ST_Read]] — read spatial files (GeoJSON, Shapefile, GeoPackage, FlatGeobuf…)
- `COPY TO '...' (FORMAT PARQUET)` — write to Parquet
- `COPY TO '...' WITH (FORMAT 'GeoJSON')` — write to GeoJSON

## Supported drivers (via GDAL)
ST_Read delegates to GDAL, so any GDAL vector driver works: `.shp`, `.geojson`, `.gpkg`, `.fgb`, `.csv` (with WKT column), and more.

## Pattern
```sql
LOAD spatial;

-- Read a GeoJSON file
SELECT * FROM ST_Read('data/regions.geojson');

-- Convert GeoJSON to Parquet
COPY (SELECT * FROM ST_Read('data/regions.geojson'))
TO 'data/regions.parquet' (FORMAT PARQUET);
```

## Problems
- [[GeoJSON to Parquet]] — read a GeoJSON file and write it as Parquet
- [[Load Shapefile Layer]] — load a `.shp` layer using ST_Read

## Related
- [[Geometry]] — geometry parsing functions for inline WKT/WKB
