# GeoJSON to Parquet

**Difficulty:** Easy | **Topic:** [[I-O]] | **Has Execution:** ❌

## Problem
Read a GeoJSON file with ST_Read and write it out as a Parquet file.

## Key Functions
- [[ST_Read]] — read the GeoJSON source
- `COPY TO` with `FORMAT PARQUET`

## Approach
```sql
LOAD spatial;

COPY (SELECT * FROM ST_Read('data/features.geojson'))
TO 'data/features.parquet' (FORMAT PARQUET);
```

## Related Problems
- [[Load Shapefile Layer]] — ST_Read with a different driver
