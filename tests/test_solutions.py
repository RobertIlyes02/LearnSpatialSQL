"""Run reference solutions against each problem's setup + expected output,
mimicking app.js validateAnswer (String() comparison, JS float semantics)."""
import duckdb, json, os

os.chdir('C:/Users/rober/OneDrive/Documents/Code/geosql')

def js_str(v):
    """Mimic JS String(v): floats with integer value drop the .0"""
    if v is None: return ''
    if isinstance(v, float) and v == int(v) and abs(v) < 1e15:
        return str(int(v))
    return str(v)

SOLUTIONS = {
    1: """SELECT i.incident_id, p.park_name
         FROM incidents i JOIN parks p ON ST_Within(i.geom, p.geom)
         ORDER BY incident_id""",
    3: """SELECT iata_code, airport_name FROM airports
         WHERE ST_X(geom) BETWEEN -10 AND 20 AND ST_Y(geom) BETWEEN 35 AND 60
         ORDER BY iata_code""",
    4: """SELECT w.warehouse_name, z.zone_name
         FROM warehouses w JOIN zones z ON ST_Intersects(w.geom, z.geom)
         ORDER BY w.warehouse_name, z.zone_name""",
    5: """SELECT route_name, ST_Length(ST_GeomFromText(wkt)) AS length_units
         FROM routes ORDER BY length_units DESC""",
    6: """SELECT mission_id, ST_Area(ST_ConvexHull(ST_Collect(list(geom)))) AS hull_area
         FROM pings GROUP BY mission_id ORDER BY mission_id""",
    7: """WITH diffs AS (
           SELECT o.zone_name, ST_Area(ST_Difference(o.geom, n.geom)) AS removed_area
           FROM zones_old o JOIN zones_new n ON o.zone_name = n.zone_name)
         SELECT zone_name, removed_area FROM diffs
         WHERE removed_area > 0 ORDER BY removed_area DESC""",
    8: """SELECT sighting_id, FLOOR(ST_X(geom))::INTEGER AS grid_x,
                FLOOR(ST_Y(geom))::INTEGER AS grid_y
         FROM sightings ORDER BY sighting_id""",
    9: """SELECT p.property_id, p.address
         FROM properties p, flood_zone f
         WHERE ST_Within(p.geom, ST_Buffer(f.geom, 500))
         ORDER BY property_id""",
    10: """SELECT ST_NumGeometries(ST_Union_Agg(geom)) AS coverage_blobs FROM towers""",
    11: """SELECT name, ROUND(ST_X(ST_Centroid(geom)), 4) AS cx,
                 ROUND(ST_Y(ST_Centroid(geom)), 4) AS cy
          FROM neighbourhoods ORDER BY name""",
    12: """SELECT segment_name, ST_NPoints(geom) AS points_before,
                 ST_NPoints(ST_Simplify(geom, 1.8)) AS points_after
          FROM coastlines ORDER BY segment_name""",
    13: """SELECT p.ping_id,
                 ROUND(ST_X(ST_ClosestPoint(r.geom, p.geom)), 2) AS snapped_x,
                 ROUND(ST_Y(ST_ClosestPoint(r.geom, p.geom)), 2) AS snapped_y
          FROM gps_pings p JOIN road r ON TRUE ORDER BY p.ping_id""",
    14: """SELECT parcel_id, ROUND(ST_Perimeter(geom), 2) AS perimeter
          FROM parcels ORDER BY perimeter DESC""",
    21: """SELECT ROUND(FLOOR(pickup_lat / 0.01) * 0.01, 2) AS grid_lat,
                 ROUND(FLOOR(pickup_lon / 0.01) * 0.01, 2) AS grid_lon,
                 COUNT(*) AS pickups
          FROM read_parquet('./data/nyc_taxi_sample.parquet')
          GROUP BY grid_lat, grid_lon ORDER BY pickups DESC LIMIT 5""",
    22: """SELECT h.name AS hotel, nr.name AS nearest_restaurant,
                 ROUND(ST_Distance(ST_Point(h.lon, h.lat), ST_Point(nr.lon, nr.lat)) * 111000) AS dist_m
          FROM read_parquet('./data/nyc_pois.parquet') h,
               LATERAL (SELECT r.name, r.lon, r.lat
                        FROM read_parquet('./data/nyc_pois.parquet') r
                        WHERE r.category = 'restaurant'
                        ORDER BY ST_Distance(ST_Point(h.lon, h.lat), ST_Point(r.lon, r.lat))
                        LIMIT 1) nr
          WHERE h.category = 'hotel' ORDER BY h.name""",
    23: """SELECT LEAST(origin, destination) AS airport_1,
                 GREATEST(origin, destination) AS airport_2,
                 COUNT(*) AS total_flights,
                 ROUND(AVG(distance_km), 0) AS avg_distance_km
          FROM read_parquet('./data/us_flights_sample.parquet')
          GROUP BY airport_1, airport_2
          HAVING COUNT(*) >= 5
          ORDER BY total_flights DESC, avg_distance_km DESC LIMIT 5""",
}

fails = 0
for pid, sql in sorted(SOLUTIONS.items()):
    p = json.load(open(f'problems/{pid}.json', encoding='utf-8'))
    con = duckdb.connect()
    con.execute('INSTALL spatial; LOAD spatial;')
    try:
        if (p.get('setup') or '').strip():
            con.execute(p['setup'])
        cur = con.execute(sql)
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        exp = p['expected']
        ok = len(rows) == len(exp) and all(
            js_str(rows[i].get(k)) == js_str(v)
            for i, er in enumerate(exp) for k, v in er.items())
        if ok:
            print(f"{pid:>2} PASS  {p['title']}")
        else:
            fails += 1
            print(f"{pid:>2} FAIL  {p['title']}")
            print(f"    got:      {[{k: js_str(v) for k,v in r.items()} for r in rows[:6]]}")
            print(f"    expected: {[{k: js_str(v) for k,v in r.items()} for r in exp[:6]]}")
    except Exception as e:
        fails += 1
        print(f"{pid:>2} ERROR {p['title']}: {str(e)[:150]}")
    con.close()

print(f"\n{'ALL PASS' if fails == 0 else f'{fails} FAILURE(S)'}")
