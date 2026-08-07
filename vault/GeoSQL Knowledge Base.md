# GeoSQL Knowledge Base

A LeetCode-style platform for learning geospatial SQL with DuckDB-WASM.
**29 problems** · live at [geosql.dev](https://geosql.dev) · contact `support@geosql.dev`

📋 **[[Launch Checklist]]** — roadmap to publish & market
📣 **[[Launch Posts]]** — drafts for Discord, Reddit, Show HN, awesome-lists

## Topics

- [[Predicates]]
- [[Distance]]
- [[Indexing]]
- [[Joins]]
- [[Measurement]]
- [[Aggregation]]
- [[Set Ops]]
- [[Geocoding]]
- [[Buffering]]
- [[Geometry]]
- [[Snapping]]
- [[Data Quality]]
- [[H3 Grid]]
- [[Clustering]]
- [[I/O]]
- [[Analytics]]
- [[Projection]]

## All Problems

| # | Problem | Topic | Difficulty |
|---|---------|-------|------------|
| 1 | [[Point in Polygon]] | [[Predicates]] | Easy |
| 2 | [[Nearest Neighbor Search]] | [[Distance]] | Easy |
| 3 | [[Bounding Box Filter]] | [[Indexing]] | Easy |
| 4 | [[Spatial Join Two Layers]] | [[Joins]] | Medium |
| 5 | [[Route Length from WKT]] | [[Measurement]] | Easy |
| 6 | [[Convex Hull of Cluster]] | [[Aggregation]] | Medium |
| 7 | [[Polygon Difference Delta]] | [[Set Ops]] | Hard |
| 8 | [[Reverse Geocode Grid]] | [[Geocoding]] | Medium |
| 9 | [[Flood Risk Buffer]] | [[Buffering]] | Medium |
| 10 | [[Merge Coverage Areas]] | [[Aggregation]] | Medium |
| 11 | [[Neighbourhood Centroids]] | [[Geometry]] | Easy |
| 12 | [[Simplify Dense Coastline]] | [[Geometry]] | Medium |
| 13 | [[Snap Points to Road]] | [[Snapping]] | Medium |
| 14 | [[Perimeter of Land Parcels]] | [[Measurement]] | Easy |
| 15 | [[Detect Invalid Geometries]] | [[Data Quality]] | Easy |
| 16 | [[Simplify Dense Geometry]] | [[Geometry]] | Medium |
| 17 | [[LineString Intersection]] | [[Set Ops]] | Medium |
| 18 | [[H3 Hexbin Hotspots]] | [[H3 Grid]] | Hard |
| 19 | [[Spatial Window Function]] | [[Analytics]] | Hard |
| 20 | [[Load a Parquet Layer]] | [[I/O]] | Easy |
| 21 | [[NYC Taxi Pickup Hotspots]] | [[Geocoding]] | Medium |
| 22 | [[Nearest Restaurant per Hotel]] | [[Distance]] | Hard |
| 23 | [[Busiest US Flight Routes]] | [[Measurement]] | Medium |
| 24 | [[Rush Hour Fare Analysis]] | [[Analytics]] | Easy |
| 25 | [[Sensors Near the Pipeline]] | [[Predicates]] | Easy |
| 26 | [[Reproject to Web Mercator]] | [[Projection]] | Medium |
| 27 | [[Drone Tracks from Pings]] | [[Geometry]] | Medium |
| 28 | [[Category Bounding Boxes]] | [[Aggregation]] | Medium |
| 29 | [[Compass Bearings Between Hubs]] | [[Measurement]] | Hard |

## Core Concepts

- [[LOAD spatial]] — required extension for all DuckDB spatial queries
- [[WKT]] — Well-Known Text geometry format
- [[EPSG 4326]] — WGS84 coordinate reference system used throughout
