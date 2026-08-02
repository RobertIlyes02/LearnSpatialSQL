# Category Bounding Boxes

**Difficulty:** Medium | **Topic:** [[Aggregation]] | **Has Execution:** ✅

## Problem
How spread out is each POI category across NYC? Compute the bounding box of each category's points and compare their areas.For each category in the POI Parquet file, aggregate all its points into one bounding-box polygon with ST_Extent_Agg, and return its area × 10,000 (to scale square-degrees into readable numbers), rounded to 1 decimal place.Return category, bbox_area, ordered by bbox_area descending.

## Key Functions
- [[ST_Extent_Agg]]
- [[ST_Area]]
- [[read_parquet]]

## Solution
```sql
LOAD spatial;

SELECT category,
       ROUND(ST_Area(ST_Extent_Agg(ST_Point(lon, lat))) * 10000, 1) AS bbox_area
FROM read_parquet('./data/nyc_pois.parquet')
GROUP BY category
ORDER BY bbox_area DESC;
```

## Related Problems
- [[Merge Coverage Areas]]
- [[Convex Hull of Cluster]]
