# LOAD spatial

```sql
LOAD spatial;
```

The DuckDB spatial extension must be loaded at the start of every query that uses spatial functions. In DuckDB-WASM (browser), it is bundled and the `LOAD spatial` statement activates it.

## What it enables
- All `ST_*` functions
- Geometry data type
- [[ST_Read]] for spatial file I/O
- H3 grid functions

## Topic
[[GeoSQL Knowledge Base]]
