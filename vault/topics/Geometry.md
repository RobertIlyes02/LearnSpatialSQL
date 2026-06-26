# Geometry

Constructing, accessing, and transforming individual geometries.

## Construction
- [[ST_GeomFromText]] — parse WKT string into a geometry
- [[ST_GeomFromWKB]] — parse WKB binary into a geometry
- [[ST_Point]] — construct a point from x, y

## Access
- [[ST_X]] / [[ST_Y]] / [[ST_Z]] — extract coordinate components
- [[ST_NPoints]] — count vertices in a geometry

## Transformation
- [[ST_Centroid]] — geometric center of a polygon
- [[ST_Simplify]] — reduce vertex count using Douglas-Peucker algorithm
- [[ST_VoronoiPolygons]] — tessellate space around a set of points

## Problems
- [[Neighbourhood Centroids]] — compute polygon centroids with ST_Centroid
- [[Simplify Dense Coastline]] — reduce vertex count with ST_Simplify
- [[Simplify Dense Geometry]] — apply tolerance-based simplification
- [[Reverse Geocode Grid]] — extract coords with ST_X, ST_Y

## Related
- [[Measurement]] — scalar measures derived from geometry
- [[Aggregation]] — aggregating many geometries into one
