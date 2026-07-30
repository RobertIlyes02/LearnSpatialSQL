# H3 Grid

Uber's hierarchical hexagonal grid system for discrete global indexing.

## Key Functions
- `h3_latlng_to_cell(lat, lng, resolution)` — assign a point to an H3 cell
- `h3_cell_to_latlng(cell)` — get center of an H3 cell
- `h3_grid_ring_unsafe(cell, k)` — get the ring of cells at distance k
- `h3_compact_cells(cells)` — compress a set of cells to minimum resolution mix
- `h3_uncompact_cells(cells, resolution)` — expand compact cells to a resolution

## Resolution reference
| Res | Avg cell area |
|-----|--------------|
| 0 | 4,250,546 km² |
| 4 | 1,770 km² |
| 7 | 5.16 km² |
| 10 | 0.015 km² |
| 15 | 0.9 m² |

## Problems
- [[H3 Compact Resolution]] — compact a fine-resolution coverage to mixed resolution

## Related
- [[Aggregation]] — H3 cells are used as aggregation units (count points per hex)
- [[Indexing]] — H3 is an alternative to R-tree indexing for point-in-cell queries
