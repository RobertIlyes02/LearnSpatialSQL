# Measurement

Computing lengths, areas, and perimeters from geometry.

## Key Functions
- [[ST_Length]] — length of a LineString or MultiLineString
- [[ST_Area]] — area of a Polygon or MultiPolygon
- [[ST_Perimeter]] — perimeter of a polygon (same as ST_Length of its boundary)
- [[ST_Boundary]] — returns the boundary geometry (ring) of a polygon

## Unit note
In EPSG:4326, distances are in degrees. For metric results, project to a metric CRS first or use geography types.

## Problems
- [[Route Length from WKT]] — measure road length using ST_Length + ST_GeomFromText
- [[Perimeter of Land Parcels]] — compute parcel perimeter using ST_Boundary + ST_Length

## Related
- [[Distance]] — point-to-point distance (ST_Distance)
- [[Geometry]] — geometry construction and access functions
