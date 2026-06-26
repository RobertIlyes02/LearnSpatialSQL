# ST_Read

```sql
ST_Read(path) → TABLE
ST_Read(path, open_options := MAP {'DRIVER': 'GeoJSON'}) → TABLE
```

Table-valued function that reads any GDAL-supported vector file and returns rows with a `geom` column.

## Supported formats
`.shp`, `.geojson`, `.gpkg`, `.fgb` (FlatGeobuf), `.csv` (with WKT), KML, and any other GDAL vector driver.

## Used in
- [[Load Shapefile Layer]]
- [[GeoJSON to Parquet]]

## Topic
[[I-O]]
