# H3 Compact Resolution

**Difficulty:** Hard | **Topic:** [[H3 Grid]] | **Has Execution:** ❌

## Problem
Given a fine-resolution H3 cell coverage, compact it to the minimum set of cells at mixed resolutions.

## Key Functions
- `h3_compact_cells(cells)` — compress a list of fine-resolution cells to the fewest cells that cover the same area
- `h3_latlng_to_cell(lat, lng, resolution)` — assign input points to H3 cells

## Approach
```sql
LOAD spatial;

SELECT h3_compact_cells(
  LIST(h3_latlng_to_cell(lat, lng, 10))
) AS compacted
FROM coverage_points;
```

## Related Problems
- [[Reverse Geocode Grid]] — regular grid approach vs H3 hexagonal grid
- [[Merge Coverage Areas]] — ST_Union is the vector equivalent of h3_compact_cells
