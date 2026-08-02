# H3 Hexbin Hotspots

**Difficulty:** Hard | **Topic:** [[H3 Grid]] | **Has Execution:** ✅

## Problem
Rectangular grids distort area away from the equator — that's why ride-share companies aggregate into H3 hexagons instead. Re-analyze the NYC taxi pickups from a Parquet file using H3 cells.Assign each pickup to its H3 cell at resolution 7 (~1.2 km hexagons), and return the top 5 cells by pickup count as hex strings.⚠️ This problem needs the H3 community extension: INSTALL h3 FROM community; LOAD h3; (already in the starter code).

## Key Functions
- [[h3_latlng_to_cell]]
- [[H3]]
- [[read_parquet]]

## Solution
```sql
INSTALL h3 FROM community;
LOAD h3;

SELECT h3_h3_to_string(h3_latlng_to_cell(pickup_lat, pickup_lon, 7)) AS h3_cell,
       COUNT(*) AS pickups
FROM read_parquet('./data/nyc_taxi_sample.parquet')
GROUP BY h3_cell
ORDER BY pickups DESC, h3_cell
LIMIT 5;
```

## Related Problems
- [[NYC Taxi Pickup Hotspots]]
- [[H3 Compact Resolution]]
