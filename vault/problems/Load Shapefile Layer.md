# Load Shapefile Layer

**Difficulty:** Easy | **Topic:** [[I-O]] | **Has Execution:** ❌

## Problem
Load a `.shp` shapefile into DuckDB using ST_Read and inspect its contents.

## Key Functions
- [[ST_Read]] — read any GDAL-supported vector format

## Approach
```sql
LOAD spatial;

SELECT * FROM ST_Read('data/layer.shp');
```

## Related Problems
- [[GeoJSON to Parquet]] — reading GeoJSON and converting to Parquet with ST_Read + COPY TO
- [[Bounding Box Filter]] — filter the loaded data spatially
