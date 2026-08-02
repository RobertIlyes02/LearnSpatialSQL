# Busiest US Flight Routes

**Difficulty:** Medium | **Topic:** [[Measurement]] | **Has Execution:** ✅

## Problem
A Parquet file holds 1,500 US domestic flights with origin/destination airport codes and coordinates.Find the 5 busiest route pairs by flight count. Treat JFK→LAX and LAX→JFK as the same route by normalising direction with LEAST / GREATEST.Only include routes with at least 5 flights. Break ties by average distance descending.

## Key Functions
- [[read_parquet]]
- [[ST_Distance]]
- [[GROUP BY]]

## Solution
```sql
LOAD spatial;

SELECT LEAST(origin, destination)    AS airport_1,
       GREATEST(origin, destination) AS airport_2,
       COUNT(*)                      AS total_flights,
       ROUND(AVG(distance_km), 0)    AS avg_distance_km
FROM read_parquet('./data/us_flights_sample.parquet')
GROUP BY airport_1, airport_2
HAVING COUNT(*) >= 5
ORDER BY total_flights DESC, avg_distance_km DESC
LIMIT 5;
```

## Related Problems
- [[Route Length from WKT]]
- [[Compass Bearings Between Hubs]]
