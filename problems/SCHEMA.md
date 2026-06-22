# Problem JSON Schema

Each problem lives in its own file: `problems/{id}.json`.
The list screen does NOT load these — it loads the lightweight `problems/index.json` instead.
A problem's full file is only fetched when a user opens it.

## File: `problems/index.json`

Array of lightweight summaries used to render the problem table.

```json
[
  {
    "id": 1,
    "title": "Point in Polygon",
    "diff": "Easy",          // "Easy" | "Medium" | "Hard"
    "acc": 82,                // acceptance %, integer 0-100
    "topic": "Predicates",
    "icon": "🔷",
    "tags": ["ST_Within", "Polygon"],
    "premium": false,
    "hasExecution": true      // whether problems/{id}.json has setup+expected for live run
  }
]
```

This file should be regenerated (or hand-edited) whenever a problem is added/removed/changed.
Keep it small — it's downloaded by every visitor on page load.

## File: `problems/{id}.json`

Full problem detail, fetched lazily when the user opens problem `{id}`.

```json
{
  "id": 1,
  "title": "Point in Polygon",
  "diff": "Easy",
  "acc": 82,
  "topic": "Predicates",
  "tags": ["ST_Within", "Polygon"],
  "premium": false,

  "description": "<p>HTML string. Rendered directly into the description panel.</p>",
  "schema": "<p>HTML string. Table/column docs, rendered in the Schema tab.</p>",
  "hints": "<div class=\"hint-block\">HTML string. Rendered in the Hints tab.</div>",

  "starterCode": "LOAD spatial;\n\nSELECT ...",

  "setup": "CREATE TABLE foo AS SELECT * FROM (VALUES (1,'a')) t(id,name);",
  // ^ Raw SQL run against a fresh DuckDB-WASM connection before the user's query.
  //   Must DROP/CREATE all tables this problem needs. Omit this field entirely
  //   (or leave "") if the problem doesn't support live execution yet —
  //   the UI will show a "coming soon" placeholder instead of Run/Submit.

  "expected": [
    { "incident_id": 1, "park_name": "Riverside Park" }
  ]
  // ^ Array of row objects used for exact-match validation on Submit.
  //   Order matters (validator compares row-by-row, in order).
  //   Set to null if the problem should only validate "query ran successfully"
  //   rather than exact-match output (e.g. nondeterministic ordering, large results).
}
```

## Notes / conventions

- `id` must match the filename (`problems/7.json` → `"id": 7`).
- `setup` SQL must be idempotent against a fresh connection — assume nothing persists
  between runs. The app drops a known table-name list before each execution; if you
  introduce new table names, add them to the DROP list in `js/app.js` (`resetTables()`).
- Keep `expected` small (under ~50 rows). It ships to the client for comparison.
- HTML fields (`description`, `schema`, `hints`) are inserted via `innerHTML` — only
  use trusted, hand-authored content (no user input ever flows into these fields).
- For problems without `setup`/`expected` yet, still fill out description/schema/hints
  so the left panel isn't empty — only the editor's Run/Submit will be limited.
