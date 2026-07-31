# Load a Parquet Layer

**Difficulty:** Easy | **Topic:** [[I/O]] | **Has Execution:** ✅

## Problem
Real GIS work starts with loading data. DuckDB can query a Parquet file directly — no import step, no CREATE TABLE. This is the gentlest introduction to the file-based problems.Query the NYC points-of-interest Parquet file and count how many POIs exist in each category.Return category and n, ordered by n descending, then category alphabetically.

## Key Functions
- [[read_parquet]]
- [[GROUP BY]]

## Solution
```sql
LOAD spatial;

SELECT category, COUNT(*) AS n
FROM read_parquet('./data/nyc_pois.parquet')
GROUP BY category
ORDER BY n DESC, category;
```

## Related Problems
- [[NYC Taxi Pickup Hotspots]]
- [[Category Bounding Boxes]]
