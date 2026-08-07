# Launch Posts

Drafts for announcing [[GeoSQL Knowledge Base|GeoSQL]]. Post in this order — stakes
rise as you go, and each round surfaces bugs before more people see it.

**Rewrite these in your own voice before posting.** They're a starting point so the
button is easier to press, not a script. The specific details matter more than the
polish — people can tell when copy is generic.

Related: [[Launch Checklist]]

---

## 1. Awesome-list PRs — zero embarrassment, do first

Two PRs. Each is one line in a markdown list. No public judgement, and the most
valuable backlinks available right now.

**Targets**
- `davidgasquez/awesome-duckdb` → "Projects / Tools" or similar section
- `sacridini/Awesome-Geospatial` → learning-resources section

**Line to add**
```markdown
- [GeoSQL](https://geosql.dev) - 29 hands-on spatial SQL problems that run entirely in the browser via DuckDB-WASM. No install or signup.
```

**PR title**
```
Add GeoSQL - browser-based spatial SQL practice problems
```

**PR body**
```
Adds GeoSQL, a free set of 29 spatial SQL exercises that run client-side using
DuckDB-WASM with the spatial extension — point-in-polygon, spatial joins, buffers,
ST_Transform, H3 hexbinning, and queries over real Parquet datasets.

No install, no signup, no server. Source is open (MIT for the code, CC BY-SA for the problems):
https://github.com/RobertIlyes02/LearnSpatialSQL

Happy to adjust the wording or move it to a different section.
```

---

## 2. DuckDB Discord — `#showcase`

Keep it short. People scroll.

```
Built a thing with duckdb-wasm: 29 spatial SQL practice problems that run entirely
in the browser — point-in-polygon, spatial joins, ST_Transform, H3 hexbinning, plus
some queries over Parquet files. No install, no signup, free.

https://geosql.dev

The spatial extension + WASM combination turned out to be a really nice fit for
teaching — you get a real spatial database in a tab. Would genuinely appreciate
feedback on whether the problem difficulty ramps sensibly.
```

---

## 3. r/PostGIS

Small and on-topic. Acknowledge it's DuckDB rather than PostGIS up front — that
honesty is the whole reason the post works here.

**Title**
```
Made a free set of spatial SQL practice problems that run in the browser
```

**Body**
```
I kept wanting to practise spatial SQL without spinning up a database first, so I
built a site where the database runs in the browser tab instead — DuckDB compiled
to WebAssembly, with the spatial extension loaded.

29 problems so far: point-in-polygon, spatial joins, buffers, ST_Simplify,
ST_Transform (including the EPSG:4326 lat/lon axis-order trap that got me while
writing it), H3 hexbinning, and some queries against real Parquet files.

Fair warning: it's DuckDB, not PostGIS. But the ST_ functions follow the OGC
standard, so nearly everything transfers directly — I mostly learned this stuff on
PostGIS and the queries look the same.

Free, no signup, no ads: https://geosql.dev

If anyone has a favourite gnarly spatial problem worth adding, I'd like to hear it.
```

---

## 4. r/gis

Bigger audience. **Check the sidebar rules first** — some subs restrict self-promo
to specific days or require flair.

**Title**
```
I built a free browser-based site for practising spatial SQL (no install, no signup)
```

**Body**
```
The thing that always stopped me practising spatial SQL wasn't the concepts — it was
the setup. Install PostGIS, configure a server, find a dataset, load it, and by then
the evening's gone and you haven't written a single interesting query.

So I built the version I wanted: geosql.dev. DuckDB compiled to WebAssembly means a
real spatial database runs in your browser tab. Open a problem and you're writing
spatial SQL against real data in about ten seconds. Nothing installed, no account
needed, and your queries never leave your machine — there's no server executing
anything.

29 problems right now, grouped into a rough learning path:
- Foundations — point-in-polygon, bounding boxes, centroids, lengths
- Distance & proximity — nearest neighbour, ST_DWithin, snapping points to lines
- Joins & aggregation — spatial joins, convex hulls, ST_MakeLine, bounding boxes
- Editing & data quality — differences, simplification, ST_MakeValid
- Projections & bearings — ST_Transform, ST_Azimuth
- Real-world analytics — NYC taxi pickups, flight routes, H3 hexbinning, window functions

Several use real Parquet datasets queried directly with read_parquet, which felt
closer to actual work than toy tables.

It's DuckDB rather than PostGIS, but the ST_ functions are OGC-standard so it
transfers. Everything is free and stays free. The source is open — MIT for the code, CC BY-SA
for the problem content, so any derivative set has to stay open too.

Would really value feedback on whether the difficulty ramps sensibly, and what
you'd add as problem 30.

(Name note: no relation to Dekart's GeoSQL agent skill — that one helps AI write
spatial SQL against your warehouse. This is the opposite: a place to practise
writing it yourself.)
```

---

## 5. Show HN — do this LAST

Only after the earlier posts have surfaced bugs. HN rewards technical specifics and
punishes marketing language. Keep the title under ~80 characters, no exclamation
marks, no "revolutionary".

**Title**
```
Show HN: Spatial SQL practice problems that run entirely in the browser
```

**Body**
```
I wanted to practise spatial SQL but kept bouncing off the setup — install PostGIS,
configure it, find data, load it. The concepts are learnable in an afternoon; the
setup is what takes the week.

So the database runs in the browser instead. DuckDB compiled to WebAssembly with the
spatial extension loaded, roughly a 5-8MB bundle, CDN-cached after first load. There
is no application server: your SQL is parsed and executed in your own tab, results
are graded client-side against expected output. That means it costs me nothing to
run per user, and a pathological query only affects the person who wrote it (there's
a 10s client-side timeout and a 500-row render cap).

29 problems covering predicates, spatial joins, buffers, simplification,
ST_Transform, ST_Azimuth, H3 hexbinning and window functions. Several query real
Parquet files directly with read_parquet rather than toy VALUES tables.

Two things I didn't expect while building it:

- ST_Transform follows the official EPSG:4326 axis order, which is latitude-first.
  Passing (lon, lat) puts your NYC landmarks in the Indian Ocean. That became a
  problem in its own right.
- The browser DuckDB build lags the Python one enough to matter — it can't reference
  a SELECT alias inside QUALIFY, so a window-function problem needed the expression
  repeated. Worth knowing if you target WASM.

Free, no signup: https://geosql.dev
Source: https://github.com/RobertIlyes02/LearnSpatialSQL

Feedback on problem difficulty and what's missing would be welcome.
```

---

## Notes on posting

- **Reply to every comment** for the first few hours, especially critical ones.
  Engagement is what keeps a thread alive, and graceful responses to criticism read
  far better than defensiveness.
- **Expect bug reports.** Someone will find a broken expected output within the hour.
  That's the point of posting to the small venues first.
- **Don't post everywhere the same day.** Spread it out — you'll want capacity to fix
  what each round turns up.
- **A quiet post is not a failure.** Three upvotes is invisible, not humiliating. The
  realistic worst case is being ignored.
