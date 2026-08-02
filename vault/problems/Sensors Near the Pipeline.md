# Sensors Near the Pipeline

**Difficulty:** Easy | **Topic:** [[Predicates]] | **Has Execution:** ✅

## Problem
A gas company monitors a pipeline (LineString) with field sensors (points). Sensors more than 50 units from the pipeline are out of radio range and need relocating.Return the sensor_id and sensor_name of every sensor within 50 units of the pipeline, ordered by sensor_id.Use ST_DWithin — it's clearer (and often faster) than computing ST_Distance and comparing.

## Key Functions
- [[ST_DWithin]]
- [[ST_Distance]]

## Solution
```sql
LOAD spatial;

SELECT s.sensor_id, s.sensor_name
FROM sensors s, pipeline p
WHERE ST_DWithin(s.geom, p.geom, 50)
ORDER BY s.sensor_id;
```

## Related Problems
- [[Flood Risk Buffer]]
- [[Nearest Neighbor Search]]
