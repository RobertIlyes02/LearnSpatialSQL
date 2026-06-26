# Indexing

Bounding-box (R-tree) operations that act as fast pre-filters before expensive predicate checks.

## Key Functions
- [[ST_Envelope]] — minimum bounding rectangle (MBR) of a geometry
- [[ST_Intersects]] — also used as the bounding-box operator `&&` in PostGIS

## Why it matters
Full predicate evaluation (ST_Within, ST_Contains…) is expensive. The optimizer can use a spatial index to rule out non-overlapping bounding boxes first, then run the exact predicate only on candidates.

## Problems
- [[Bounding Box Filter]] — filter candidates using ST_Envelope + ST_Intersects

## Related
- [[Predicates]] — exact tests that follow the bounding-box pre-filter
- [[Joins]] — spatial joins rely on indexing for performance
