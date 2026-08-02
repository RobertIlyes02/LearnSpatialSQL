# Rush Hour Fare Analysis

**Difficulty:** Easy | **Topic:** [[Analytics]] | **Has Execution:** ✅

## Problem
City planners want to know when taxi demand peaks. The NYC taxi Parquet file tags every trip with its pickup_hour (0–23).Find the 3 busiest pickup hours. For each, return the trip count and the average fare.Return pickup_hour, trips, and avg_fare (rounded to 2 decimal places), ordered by trips descending, ties broken by pickup_hour ascending.

## Key Functions
- [[read_parquet]]
- [[GROUP BY]]
- [[AVG]]

## Solution
```sql
LOAD spatial;

SELECT pickup_hour,
       COUNT(*) AS trips,
       ROUND(AVG(fare_usd), 2) AS avg_fare
FROM read_parquet('./data/nyc_taxi_sample.parquet')
GROUP BY pickup_hour
ORDER BY trips DESC, pickup_hour
LIMIT 3;
```

## Related Problems
- [[NYC Taxi Pickup Hotspots]]
- [[Load a Parquet Layer]]
