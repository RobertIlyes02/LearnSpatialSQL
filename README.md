# GeoSQL

**LeetCode for spatial SQL — 29 hands-on geospatial problems that run entirely in your browser.**

Practice `ST_Within`, spatial joins, H3 hexbinning, projections, and querying real
Parquet datasets, all powered by [DuckDB-WASM](https://duckdb.org/docs/api/wasm/overview)
with the spatial extension. No install, no signup, no server.

## How it runs

Query execution happens **entirely in the browser** — there is no application server,
and no query ever touches your infrastructure. When a user clicks Run/Submit, a DuckDB
instance compiled to WebAssembly runs in their tab, loads the problem's seed data
(inline SQL or a Parquet file from `data/`), executes their SQL, and grades the result
locally against the problem's expected output.

- **No server compute cost** for running queries, ever.
- A slow query only affects that user's tab — guarded by a 10s client-side timeout
  and a 500-row render cap (see `CONFIG` in `js/app.js`).
- The only backend cost is static bandwidth (the ~5–8MB WASM bundle is CDN-cached
  after first load).

Solved state persists in `localStorage` for anonymous users, or in Supabase
(`js/supabase.js`) when signed in — which also powers per-problem leaderboards.

## Project structure

```
geosql/
├── index.html         # App shell — problem list, problem detail, knowledge graph
├── css/styles.css     # All styling
├── js/
│   ├── app.js         # Routing, DuckDB-WASM lifecycle, CodeMirror, grading, D3 graph
│   └── supabase.js    # Optional auth + submissions + leaderboard client
├── data/              # Local Parquet datasets (NYC taxi, NYC POIs, US flights)
├── problems/
│   ├── SCHEMA.md      # Problem JSON schema docs
│   ├── _template.json # Starting point for a new problem
│   ├── index.json     # Lightweight list — loaded by the list screen
│   └── {1..29}.json   # Full problem details — fetched lazily on open
├── tests/
│   └── test_solutions.py  # Validates every problem's solution vs expected output
└── vault/             # Obsidian knowledge base (topics/problems/functions notes)
```

The list screen fetches only the small `index.json`; a problem's full description,
hints, seed SQL, reference solution, and expected output load only when opened.
Adding a problem is adding one JSON file — no app code changes.

## Running locally

Any static file server works — `fetch()` requires HTTP, so `file://` won't.

```bash
python -m http.server 8000
```

Then visit http://localhost:8000. Or `npx serve`, or any static host
(Vercel, Netlify, Cloudflare Pages, GitHub Pages) pointed at this directory.

### Caching

`vercel.json` sets `must-revalidate` on `.js` / `.css` / `.json`, and caches
`/data/*.parquet` for a year (those files never change).

This matters more than it looks. The app is ES modules, so if a browser serves a
*stale* `supabase.js` next to a *fresh* `app.js`, an import of a name the cached
file doesn't export yet fails — and the whole app dies at "Loading runtime…"
rather than degrading. Revalidation is cheap here (small files, mostly 304s).

The `?v=` query on the `app.js` / `styles.css` tags in `index.html` predates that
header and is now belt-and-braces; bump it if you want to force a refresh, but it
only versions those two files, not the modules they import.

## Adding a new problem

1. Copy `problems/_template.json` to `problems/{next_id}.json` and fill it in
   (see `problems/SCHEMA.md`). Include a `solution` (shown behind "Show Solution")
   and an `expected` array (used for grading).
   - Table-based problem: put seed SQL in `setup`. Tables are dropped automatically
     before every run — no cleanup list to maintain.
   - Parquet-based problem: leave `setup` empty, set `"hasExecution": true`, and
     query `read_parquet('./data/yourfile.parquet')` (the app rewrites the relative
     path for WASM).
2. Add a matching entry to `problems/index.json`.
3. Verify it: `python tests/test_solutions.py` runs every problem's setup +
   reference solution and diffs against `expected` with the same comparison the
   app uses.

**Gotchas learned the hard way** (all encoded in existing problems):
- The in-browser DuckDB can lag the Python release — e.g. it can't reference a
  SELECT alias in `QUALIFY` (see problem 19). Always browser-test new functions.
- `ST_Transform` follows EPSG:4326's official lat/lon axis order (problem 26).
- Expected values are compared as JS strings: `String(-74.0)` is `"-74"`, and
  booleans are `"true"`/`"false"`.

## SEO pages

The app uses hash routing (`#/problems/21`), and everything after `#` is never sent
to a server — so search engines cannot see any problem content. `tools/build_seo.py`
generates crawlable static counterparts:

```bash
python tools/build_seo.py
```

That writes `p/1.html` … `p/29.html` (real problem prose, JSON-LD, links into the
app), `p/index.html`, and `sitemap.xml`. **Re-run it whenever you add or edit a
problem**, otherwise the indexed copy goes stale.

## Testing

```bash
python tests/test_solutions.py
```

Requires Python with `duckdb` installed. All 29 problems must pass before shipping.
