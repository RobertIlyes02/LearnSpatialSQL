# Drone Tracks from Pings

**Difficulty:** Medium | **Topic:** [[Geometry]] | **Has Execution:** ✅

## Problem
A drone fleet logs GPS pings with a sequence number. Reconstruct each drone's flight track as a LineString and measure how far it flew.For each drone, connect its pings in sequence order into a track, and return drone_id and track_length (rounded to 2 decimal places), ordered by track_length descending.

## Key Functions
- [[ST_MakeLine]]
- [[ST_Length]]
- [[GROUP BY]]

## Solution
```sql
LOAD spatial;

SELECT drone_id,
       ROUND(ST_Length(ST_MakeLine(list(geom ORDER BY seq))), 2) AS track_length
FROM drone_pings
GROUP BY drone_id
ORDER BY track_length DESC;
```

## Related Problems
- [[Route Length from WKT]]
- [[Snap Points to Road]]
