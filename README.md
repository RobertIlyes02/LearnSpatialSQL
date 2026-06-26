# GeoSQL

A LeetCode-style platform for practicing geospatial SQL with DuckDB.

## How it runs

Query execution happens **entirely in the browser** via [DuckDB-WASM](https://duckdb.org/docs/api/wasm/overview) —
there is no application server, and no query ever touches your infrastructure. When a
user clicks Run/Submit, a DuckDB instance compiled to WebAssembly runs in their tab,
loads the problem's seed data, executes their SQL, and compares the result locally.
This means:

- **No server compute cost** for running queries, ever — it scales to any number of
  concurrent users for free on that dimension.
- A slow or pathological query only affects that user's browser tab, not shared
  infrastructure. We still guard against it (see `CONFIG` in `js/app.js`):
  a 10s client-side timeout, and a 500-row render cap so a huge result set doesn't
  freeze the DOM.
- The only real "backend" cost is bandwidth for static files (HTML/CSS/JS + the
  ~5–8MB WASM bundle, which is CDN-cached after first load) and the small JSON
  problem files.

"Solved" status currently persists in `localStorage` as a stand-in for a real
backend. See **Extending this** below for what a production version would add.

## Project structure

```
geosql/
├── index.html              # App shell — nav, two screens (list + detail), no inline data
├── css/
│   └── styles.css          # All styling
├── js/
│   └── app.js               # Routing, DuckDB-WASM lifecycle, CodeMirror setup,
│                             # fetch-based problem loading, query execution + guardrails
└── problems/
    ├── SCHEMA.md            # Documents the problem JSON schema
    ├── _template.json       # Copy-paste starting point for a new problem
    ├── index.json           # Lightweight list (id, title, diff, tags...) — loaded by the list screen
    ├── 1.json                # Full problem detail — fetched lazily only when opened
    ├── 2.json
    └── ...
```

### Why split into `index.json` + per-problem files?

The list screen only ever needs id/title/difficulty/tags to render the table — so it
only fetches the small `index.json`. The full description, schema docs, hints,
starter code, seed-data SQL, and expected output for a given problem are only
fetched when a user actually opens that problem. This keeps the initial page load
small regardless of whether you have 20 problems or 2,000, and means adding a new
problem is just adding one JSON file — no app code changes, no redeploy of existing
problems' data.

## Running locally

Any static file server works — `fetch()` requires HTTP, so you can't just open
`index.html` via `file://`.

```bash
cd geosql
python3 -m http.server 8000
# visit http://localhost:8000
```

Or `npx serve`, or drop the folder into any static host (Vercel, Netlify, Cloudflare
Pages, S3 + CloudFront, GitHub Pages all work with zero config beyond pointing at
this directory).

## Adding a new problem

1. Copy `problems/_template.json` to `problems/{next_id}.json` and fill it in.
   See `problems/SCHEMA.md` for field-by-field documentation.
2. If your `setup` SQL introduces new table names, add them to `KNOWN_TABLES` in
   `js/app.js` — this list is dropped before every query run so state never leaks
   between problems or between repeated Run clicks.
3. Add a matching lightweight entry to `problems/index.json` (same id/title/diff/etc,
   plus `"hasExecution": true`).
4. That's it — no other code changes needed.

Currently problems 1–8 have full live execution (seed data + expected output).
Problems 9–20 are stubs with description/schema/hints placeholders and no live
execution yet — a good batch to fill in next using the same pattern.

## What's still missing for a real production version

This is a solid client-side foundation, but a few things are deliberately out of
scope for this iteration and would need a real (small) backend:

- **Auth** — so solved state and stats follow a user across devices instead of
  living in localStorage.
- **A submissions table** (`user_id, problem_id, code, passed, submitted_at`) —
  this is what would let "Acceptance %" become a real, live-computed number
  instead of the placeholder values currently hardcoded in each problem's JSON.
- **Rate limiting on the backend API**, if/when one exists for submissions —
  not for query execution (which never touches your servers), but to prevent
  spammy submission-logging requests.
- **A CDN in front of `/problems/*.json` and the WASM bundle** for latency and
  to reduce duplicate downloads at scale — most static hosts give you this for
  free already.
