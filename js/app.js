// ═══════════════════════════════════════════════════════════════════════════
// GeoSQL App
// Problem data is fetched on demand from /problems/*.json — NOT inlined here.
// Query execution runs entirely client-side via DuckDB-WASM (zero server cost).
// ═══════════════════════════════════════════════════════════════════════════

import { EditorView, basicSetup } from 'https://esm.sh/codemirror@6.0.1';
import { sql } from 'https://esm.sh/@codemirror/lang-sql@6.8.0';
import { oneDark } from 'https://esm.sh/@codemirror/theme-one-dark@6.1.2';
import { keymap } from 'https://esm.sh/@codemirror/view@6.35.3';
import { defaultKeymap } from 'https://esm.sh/@codemirror/commands@6.7.1';
import * as duckdb from 'https://cdn.jsdelivr.net/npm/@duckdb/duckdb-wasm@1.29.0/+esm';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import {
  CONFIGURED as SUPABASE_CONFIGURED,
  onAuthChange,
  signOut,
  loadSolvedFromSupabase,
  recordSubmission,
  fetchLeaderboard,
} from './supabase.js';

// ─── CONFIG / GUARDRAILS ────────────────────────────────────────────────────
const CONFIG = {
  PROBLEMS_DIR: './problems',          // where index.json + {id}.json live
  QUERY_TIMEOUT_MS: 10_000,            // abort a query that hangs longer than this
  MAX_RENDERED_ROWS: 500,              // never render more than this many rows in the table
  // OAuth providers actually ENABLED in Supabase → Authentication → Providers.
  // Buttons for anything not listed here are hidden, so users never click a
  // login option that can't work. Add 'github' / 'google' once each is enabled.
  OAUTH_PROVIDERS: [],
};

// ─── FUNCTION DOCUMENTATION LINKS ───────────────────────────────────────────
const SPATIAL = 'https://duckdb.org/docs/current/core_extensions/spatial/functions';
const SQL     = 'https://duckdb.org/docs/current/sql/query_syntax';
const NUMERIC = 'https://duckdb.org/docs/current/sql/functions/numeric';
const WINDOW  = 'https://duckdb.org/docs/current/sql/functions/window_functions';
const H3_EXT  = 'https://duckdb.org/community_extensions/extensions/h3';

const FUNCTION_DOCS = {
  // Spatial predicates
  ST_Within:        { url: `${SPATIAL}#st_within`,        label: 'ST_Within — DuckDB Spatial' },
  ST_Intersects:    { url: `${SPATIAL}#st_intersects`,    label: 'ST_Intersects — DuckDB Spatial' },
  ST_Contains:      { url: `${SPATIAL}#st_contains`,      label: 'ST_Contains — DuckDB Spatial' },
  // Distance
  ST_Distance:      { url: `${SPATIAL}#st_distance`,      label: 'ST_Distance — DuckDB Spatial' },
  // Indexing / envelopes
  ST_Envelope:      { url: `${SPATIAL}#st_envelope`,      label: 'ST_Envelope — DuckDB Spatial' },
  // Measurement
  ST_Length:        { url: `${SPATIAL}#st_length`,        label: 'ST_Length — DuckDB Spatial' },
  ST_Area:          { url: `${SPATIAL}#st_area`,          label: 'ST_Area — DuckDB Spatial' },
  ST_Boundary:      { url: `${SPATIAL}#st_boundary`,      label: 'ST_Boundary — DuckDB Spatial' },
  // Geometry construction
  ST_GeomFromText:  { url: `${SPATIAL}#st_geomfromtext`,  label: 'ST_GeomFromText — DuckDB Spatial' },
  ST_Point:         { url: `${SPATIAL}#st_point`,         label: 'ST_Point — DuckDB Spatial' },
  // Aggregation
  ST_Collect:       { url: `${SPATIAL}#st_collect`,       label: 'ST_Collect — DuckDB Spatial' },
  ST_ConvexHull:    { url: `${SPATIAL}#st_convexhull`,    label: 'ST_ConvexHull — DuckDB Spatial' },
  ST_Union:         { url: `${SPATIAL}#st_union`,         label: 'ST_Union — DuckDB Spatial' },
  ST_NumGeometries: { url: `${SPATIAL}#st_numgeometries`, label: 'ST_NumGeometries — DuckDB Spatial' },
  // Set operations
  ST_Difference:    { url: `${SPATIAL}#st_difference`,    label: 'ST_Difference — DuckDB Spatial' },
  ST_Intersection:  { url: `${SPATIAL}#st_intersection`,  label: 'ST_Intersection — DuckDB Spatial' },
  // Geometry access
  ST_X:             { url: `${SPATIAL}#st_x`,             label: 'ST_X — DuckDB Spatial' },
  ST_Y:             { url: `${SPATIAL}#st_y`,             label: 'ST_Y — DuckDB Spatial' },
  ST_NPoints:       { url: `${SPATIAL}#st_npoints`,       label: 'ST_NPoints — DuckDB Spatial' },
  ST_Centroid:      { url: `${SPATIAL}#st_centroid`,      label: 'ST_Centroid — DuckDB Spatial' },
  // Transformation
  ST_Buffer:        { url: `${SPATIAL}#st_buffer`,        label: 'ST_Buffer — DuckDB Spatial' },
  ST_Simplify:      { url: `${SPATIAL}#st_simplify`,      label: 'ST_Simplify — DuckDB Spatial' },
  ST_ClosestPoint:  { url: `${SPATIAL}#st_closestpoint`,  label: 'ST_ClosestPoint — DuckDB Spatial' },
  // Data quality
  ST_IsValid:       { url: `${SPATIAL}#st_isvalid`,       label: 'ST_IsValid — DuckDB Spatial' },
  ST_IsValidReason: { url: `${SPATIAL}#st_isvalidreason`, label: 'ST_IsValidReason — DuckDB Spatial' },
  ST_MakeValid:     { url: `${SPATIAL}#st_makevalid`,     label: 'ST_MakeValid — DuckDB Spatial' },
  ST_DWithin:       { url: `${SPATIAL}#st_dwithin`,       label: 'ST_DWithin — DuckDB Spatial' },
  ST_Transform:     { url: `${SPATIAL}#st_transform`,     label: 'ST_Transform — DuckDB Spatial' },
  ST_MakeLine:      { url: `${SPATIAL}#st_makeline`,      label: 'ST_MakeLine — DuckDB Spatial' },
  ST_Extent_Agg:    { url: `${SPATIAL}#st_extent_agg`,    label: 'ST_Extent_Agg — DuckDB Spatial' },
  ST_Azimuth:       { url: `${SPATIAL}#st_azimuth`,       label: 'ST_Azimuth — DuckDB Spatial' },
  ST_AsText:        { url: `${SPATIAL}#st_astext`,        label: 'ST_AsText — DuckDB Spatial' },
  ST_Perimeter:     { url: `${SPATIAL}#st_perimeter`,     label: 'ST_Perimeter — DuckDB Spatial' },
  // I/O
  ST_Read:          { url: `${SPATIAL}#st_read`,          label: 'ST_Read — DuckDB Spatial' },
  read_parquet:     { url: 'https://duckdb.org/docs/current/data/parquet/overview', label: 'read_parquet — DuckDB Parquet' },
  // H3
  H3:                   { url: H3_EXT, label: 'H3 — DuckDB Community Extension' },
  h3_latlng_to_cell:    { url: H3_EXT, label: 'h3_latlng_to_cell — DuckDB H3 Extension' },
  h3_grid_ring_unsafe:  { url: H3_EXT, label: 'h3_grid_ring_unsafe — DuckDB H3 Extension' },
  h3_compact_cells:     { url: H3_EXT, label: 'h3_compact_cells — DuckDB H3 Extension' },
  // SQL constructs
  'ORDER BY':    { url: `${SQL}/orderby`,    label: 'ORDER BY — DuckDB SQL' },
  'GROUP BY':    { url: `${SQL}/groupby`,    label: 'GROUP BY — DuckDB SQL' },
  'JOIN':        { url: `${SQL}/from`,       label: 'JOIN — DuckDB SQL' },
  'LATERAL':     { url: `${SQL}/from`,       label: 'LATERAL Joins — DuckDB SQL' },
  'CTE':         { url: `${SQL}/with`,       label: 'CTEs (WITH) — DuckDB SQL' },
  'FLOOR':       { url: NUMERIC,             label: 'Numeric Functions — DuckDB SQL' },
  'PARTITION BY':{ url: WINDOW,              label: 'Window Functions — DuckDB SQL' },
  'RANK':        { url: WINDOW,              label: 'RANK — DuckDB Window Functions' },
};

// ─── STATE ───────────────────────────────────────────────────────────────────
let db = null;
let dbReady = false;
let cmView = null;
let currentProblem = null;
let problemIndex = [];           // lightweight list from index.json
let solvedIds = new Set();       // populated after auth state resolves
let currentUser = null;          // Supabase user object, or null if logged out

let currentDiff = 'all';
let currentSearch = '';

// ─── PERSISTENCE ─────────────────────────────────────────────────────────────
// When Supabase is configured: solved state lives in the DB, keyed by user_id.
// When not configured (or not logged in): falls back to localStorage so local
// dev and testing still works without setting up auth.

function loadSolvedFromLocalStorage() {
  try {
    return new Set(JSON.parse(localStorage.getItem('geosql_solved') || '[]'));
  } catch { return new Set(); }
}

function saveSolvedToLocalStorage() {
  try {
    localStorage.setItem('geosql_solved', JSON.stringify([...solvedIds]));
  } catch { /* unavailable, fail silently */ }
}

async function refreshSolvedIds() {
  if (SUPABASE_CONFIGURED && currentUser) {
    solvedIds = await loadSolvedFromSupabase();
  } else {
    solvedIds = loadSolvedFromLocalStorage();
  }
  // Sync solved state back into the in-memory index so checkmarks re-render
  problemIndex.forEach(p => { p.solved = solvedIds.has(p.id); });
  renderTable();
}

// ─── DUCKDB INIT ─────────────────────────────────────────────────────────────
async function initDuckDB() {
  const bar = document.getElementById('wasm-bar');
  const status = document.getElementById('wasm-status');
  const overlay = document.getElementById('wasm-overlay');

  // Most browsers block fetch()/Worker creation under file:// for security
  // reasons. Detect this up front and fail fast with a clear message instead
  // of hanging silently at "Loading runtime…".
  if (location.protocol === 'file:') {
    bar.style.background = 'var(--red)';
    status.innerHTML =
      'This app must be served over HTTP, not opened as a local file.<br>' +
      'From this folder, run: <code style="color:var(--cyan)">python3 -m http.server 8000</code><br>' +
      'then visit <code style="color:var(--cyan)">http://localhost:8000</code>.';
    addDismissButton(overlay, status);
    return;
  }

  try {
    await Promise.race([
      runDuckDBInit(bar, status),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timed out after 30s waiting for DuckDB to load.')), 30_000)
      ),
    ]);
    setTimeout(() => overlay.classList.add('hidden'), 400);

  } catch (e) {
    bar.style.background = 'var(--red)';
    status.innerHTML =
      `Failed to initialize: ${escapeHtml(e.message)}<br>` +
      'Check your internet connection (DuckDB-WASM loads from a CDN) and that you\'re viewing this over HTTP, not as a local file. ' +
      'If you\'re behind a strict ad-blocker or corporate proxy, it may be blocking jsdelivr.net, esm.sh, or Web Worker creation.';
    addDismissButton(overlay, status);
    console.error(e);
  }
}

async function runDuckDBInit(bar, status) {
  status.textContent = 'Fetching DuckDB bundles…';
  bar.style.width = '20%';

  const JSDELIVR_BUNDLES = duckdb.getJsDelivrBundles();
  const bundle = await duckdb.selectBundle(JSDELIVR_BUNDLES);

  bar.style.width = '50%';
  status.textContent = 'Instantiating WebAssembly…';

  const worker_url = URL.createObjectURL(
    new Blob([`importScripts("${bundle.mainWorker}");`], { type: 'text/javascript' })
  );
  const worker = new Worker(worker_url);
  const logger = new duckdb.ConsoleLogger();
  db = new duckdb.AsyncDuckDB(logger, worker);
  await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
  URL.revokeObjectURL(worker_url);

  bar.style.width = '80%';
  status.textContent = 'Loading spatial extension…';

  const conn = await db.connect();
  await conn.query('INSTALL spatial; LOAD spatial;');
  await conn.close();

  bar.style.width = '100%';
  status.textContent = 'Ready!';
  dbReady = true;

  // If the user deep-linked into a problem while WASM was still loading, the
  // Run/Submit buttons were disabled with dbReady=false — re-enable them now.
  if (currentProblem && problemExecutable(currentProblem)) {
    document.getElementById('run-btn').disabled = false;
    document.getElementById('submit-btn').disabled = false;
  }
}

// ponytail: executable = has setup SQL, or explicitly flagged (parquet problems need no setup)
function problemExecutable(p) {
  return !!p.setup || p.hasExecution === true;
}

function addDismissButton(overlay, status) {
  if (document.getElementById('wasm-dismiss')) return; // avoid duplicates on retry
  const btn = document.createElement('button');
  btn.id = 'wasm-dismiss';
  btn.textContent = 'Continue without live execution →';
  btn.style.cssText = 'margin-top:10px;background:transparent;border:1px solid var(--border);color:var(--muted2);padding:8px 16px;border-radius:8px;font-size:0.8rem;cursor:pointer;font-family:inherit;';
  btn.onclick = () => overlay.classList.add('hidden');
  status.insertAdjacentElement('afterend', btn);
}

// ─── CODEMIRROR SETUP ────────────────────────────────────────────────────────
function initEditor(code) {
  const mount = document.getElementById('editor-mount');
  if (cmView) cmView.destroy();

  cmView = new EditorView({
    doc: code,
    extensions: [
      basicSetup,
      sql(),
      oneDark,
      keymap.of(defaultKeymap),
      EditorView.theme({
        '&': { height: '100%', fontSize: '13.5px' },
        '.cm-scroller': { fontFamily: "'JetBrains Mono', monospace", overflow: 'auto' },
      }),
    ],
    parent: mount,
  });
}

// ─── QUERY EXECUTION (with guardrails) ──────────────────────────────────────
// Wraps a promise with a timeout so a pathological query can't hang the tab
// forever. Since execution is 100% client-side, a runaway query only affects
// this user's browser — never shared server resources — but we still want to
// fail gracefully rather than freeze the UI indefinitely.
function withTimeout(promise, ms) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`Query timed out after ${ms / 1000}s. Check for unbounded joins or missing LIMIT clauses.`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function resetTables(conn) {
  // Defensive cleanup: drop every user table before each run, so leftover state
  // from a previous problem/run never bleeds into the next. Queried dynamically
  // so new problems never need a hand-maintained table list.
  const res = await conn.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema = 'main' AND table_type = 'BASE TABLE'"
  );
  const drops = res.toArray()
    .map(r => `DROP TABLE IF EXISTS "${r.table_name}";`).join(' ');
  if (drops) await conn.query(drops);
}

async function runQuery(isSubmit) {
  if (!dbReady) { showConsole('DuckDB is still initializing…'); return; }
  const p = currentProblem;
  if (!p || (!p.setup && p.hasExecution !== true)) {
    showConsole('This problem does not have a live execution environment yet.');
    return;
  }

  const runBtn = document.getElementById('run-btn');
  const submitBtn = document.getElementById('submit-btn');
  runBtn.disabled = true;
  submitBtn.disabled = true;
  runBtn.innerHTML = '<span class="spinner"></span> Running…';

  const userSQL = cmView.state.doc.toString();
  const t0 = performance.now();
  let conn;

  try {
    conn = await db.connect();
    await conn.query('LOAD spatial;');
    await resetTables(conn);
    if (p.setup) await conn.query(p.setup);

    // DuckDB-WASM resolves file paths against its virtual FS, not the page URL,
    // so rewrite relative ./data/ references to absolute http URLs it can fetch.
    const dataBase = new URL('data/', location.href).href;
    const resolvedSQL = userSQL.replaceAll("'./data/", `'${dataBase}`);

    const result = await withTimeout(conn.query(resolvedSQL), CONFIG.QUERY_TIMEOUT_MS);
    const elapsed = (performance.now() - t0).toFixed(1);

    const allRows = result.toArray().map(r => Object.fromEntries(
      result.schema.fields.map((f, i) => [f.name, r[f.name] ?? r[i]])
    ));
    const cols = result.schema.fields.map(f => f.name);

    const truncated = allRows.length > CONFIG.MAX_RENDERED_ROWS;
    const rowsToRender = truncated ? allRows.slice(0, CONFIG.MAX_RENDERED_ROWS) : allRows;

    showOutputTable(rowsToRender, cols, elapsed, allRows.length, truncated);
    if (isSubmit && p.expected) validateAnswer(allRows, p.expected, parseFloat(elapsed));
    else if (isSubmit) showPartialSubmit(allRows);

  } catch (e) {
    const elapsed = (performance.now() - t0).toFixed(1);
    showError(e.message, elapsed);
  } finally {
    if (conn) { try { await conn.close(); } catch {} }
    runBtn.disabled = false;
    submitBtn.disabled = false;
    runBtn.innerHTML = '<span>▶</span> Run';
  }
}

// ─── RESULTS RENDERING ───────────────────────────────────────────────────────
function showOutputTable(rows, cols, elapsed, totalCount, truncated) {
  const panel = document.getElementById('res-output');
  if (rows.length === 0) {
    panel.innerHTML = `<p class="results-placeholder">Query returned 0 rows. <span class="runtime-badge">⏱ ${elapsed}ms</span></p>`;
    return;
  }
  const header = cols.map(c => `<th>${escapeHtml(c)}</th>`).join('');
  const body = rows.map(r =>
    `<tr>${cols.map(c => `<td>${escapeHtml(r[c] ?? 'NULL')}</td>`).join('')}</tr>`
  ).join('');

  const truncWarning = truncated
    ? `<div class="results-warning-banner">⚠ Showing first ${CONFIG.MAX_RENDERED_ROWS} of ${totalCount} rows. Add a LIMIT to your query to narrow results.</div>`
    : '';

  panel.innerHTML = `
    ${truncWarning}
    <div class="res-table-wrap">
      <table class="res-table">
        <thead><tr>${header}</tr></thead>
        <tbody>${body}</tbody>
      </table>
    </div>
    <p class="res-count">${totalCount} row${totalCount !== 1 ? 's' : ''} &nbsp;<span class="runtime-badge">⏱ ${elapsed}ms</span></p>
  `;
}

function showError(msg, elapsed) {
  document.getElementById('res-output').innerHTML =
    `<div class="results-error">Error: ${escapeHtml(msg)}\n\n<span class="runtime-badge">⏱ ${elapsed}ms</span></div>`;
}

function showConsole(msg) {
  document.getElementById('res-console').innerHTML = `<p class="results-placeholder">${escapeHtml(msg)}</p>`;
  switchResTab(document.querySelector('.results-tab:nth-child(3)'), 'res-console');
}

function validateAnswer(rows, expected, runtimeMs) {
  const normalize = arr => arr.map(r =>
    Object.fromEntries(Object.entries(r).map(([k, v]) => [k, String(v ?? '')]))
  );
  const got = normalize(rows);
  const exp = normalize(expected);

  const pass = got.length === exp.length &&
    exp.every((expRow, i) => Object.entries(expRow).every(([k, v]) => got[i]?.[k] === v));

  const panel = document.getElementById('res-output');
  const banner = pass
    ? `<div class="results-success-banner">✅ Accepted — all test cases passed!</div>`
    : `<div class="results-fail-banner">❌ Wrong Answer — output doesn't match expected.</div>`;
  panel.innerHTML = banner + panel.innerHTML;

  renderExpectedTab(expected);

  // Record submission in Supabase (or localStorage fallback)
  const code = cmView ? cmView.state.doc.toString() : '';
  if (SUPABASE_CONFIGURED && currentUser) {
    recordSubmission({ problemId: currentProblem.id, code, passed: pass, runtimeMs: pass ? runtimeMs : null });
  }

  if (pass) {
    currentProblem.solved = true;
    solvedIds.add(currentProblem.id);
    if (!SUPABASE_CONFIGURED || !currentUser) saveSolvedToLocalStorage();
    const stub = problemIndex.find(p => p.id === currentProblem.id);
    if (stub) stub.solved = true;
    renderTable();
  }
}

function showPartialSubmit(rows) {
  const panel = document.getElementById('res-output');
  panel.innerHTML = `<div class="results-success-banner">✓ Query executed — ${rows.length} row(s) returned. No fixed expected output for this problem; review manually.</div>` + panel.innerHTML;
}

function renderExpectedTab(expected) {
  if (!expected || expected.length === 0) {
    document.getElementById('res-expected').innerHTML = '<p class="results-placeholder">No fixed expected output — results are validated by structure.</p>';
    return;
  }
  const expCols = Object.keys(expected[0]);
  const expHeader = expCols.map(c => `<th>${escapeHtml(c)}</th>`).join('');
  const expBody = expected.map(r => `<tr>${expCols.map(c => `<td>${escapeHtml(r[c])}</td>`).join('')}</tr>`).join('');
  document.getElementById('res-expected').innerHTML = `
    <div class="res-table-wrap">
      <table class="res-table"><thead><tr>${expHeader}</tr></thead><tbody>${expBody}</tbody></table>
    </div>
    <p class="res-count">${expected.length} expected rows</p>
  `;
}

function buildFunctionRefs(tags) {
  const links = tags
    .filter(t => FUNCTION_DOCS[t])
    .map(t => `<a href="${FUNCTION_DOCS[t].url}" target="_blank" rel="noopener" class="fn-ref-link">${escapeHtml(t)} ↗</a>`);
  if (!links.length) return '';
  return `<div class="fn-refs"><strong>📖 Documentation</strong><div class="fn-ref-links">${links.join('')}</div></div>`;
}

function escapeHtml(val) {
  return String(val)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── PROBLEM DATA FETCHING ───────────────────────────────────────────────────
async function loadProblemIndex() {
  // no-cache: revalidate with the server so problem edits show up without a hard refresh
  const res = await fetch(`${CONFIG.PROBLEMS_DIR}/index.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load problem index (${res.status})`);
  const data = await res.json();
  return data.map(p => ({ ...p, solved: solvedIds.has(p.id) }));
}

async function loadProblemDetail(id) {
  const res = await fetch(`${CONFIG.PROBLEMS_DIR}/${id}.json`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`Failed to load problem ${id} (${res.status})`);
  return res.json();
}

// ─── SCREEN NAVIGATION ───────────────────────────────────────────────────────
function goHome() {
  document.getElementById('nav-center').innerHTML = '';
  history.pushState({}, '', '#/problems');
  showScreen('screen-home');
  renderTable();
}

async function openProblem(id) {
  history.pushState({}, '', `#/problems/${id}`);
  showScreen('screen-problem');

  // Loading state in the editor area while we fetch
  document.getElementById('prob-title').textContent = 'Loading…';
  document.getElementById('prob-description').innerHTML = '<p class="results-placeholder">Loading problem…</p>';

  let p;
  try {
    p = await loadProblemDetail(id);
  } catch (e) {
    document.getElementById('prob-description').innerHTML = `<p class="results-error">${escapeHtml(e.message)}</p>`;
    return;
  }

  p.solved = solvedIds.has(p.id);
  currentProblem = p;

  document.getElementById('nav-center').innerHTML = `
    <div class="nav-breadcrumb">
      <span id="bc-problems" style="cursor:pointer;color:var(--cyan)">Problems</span>
      <span class="sep">›</span>
      <span class="current">${p.id}. ${escapeHtml(p.title)}</span>
    </div>
  `;
  document.getElementById('bc-problems').onclick = goHome;

  document.getElementById('prob-title').textContent = `${p.id}. ${p.title}`;
  const diffEl = document.getElementById('prob-diff-badge');
  diffEl.textContent = p.diff;
  diffEl.className = `diff-badge diff-${p.diff.toLowerCase()}`;
  document.getElementById('prob-topic').textContent = p.topic;
  document.getElementById('prob-description').innerHTML = p.description || '<p class="results-placeholder">Full problem statement coming soon.</p>';
  document.getElementById('prob-schema').innerHTML = p.schema || '<p class="results-placeholder">Schema details coming soon.</p>';
  const solutionBlock = p.solution
    ? `<details class="solution-block"><summary>🔓 Show Solution</summary><pre class="solution-code">${escapeHtml(p.solution)}</pre></details>`
    : '';
  const issueUrl = `https://github.com/RobertIlyes02/LearnSpatialSQL/issues/new?title=${encodeURIComponent(`Problem ${p.id}: ${p.title}`)}`;
  const mailUrl = `mailto:support@geosql.dev?subject=${encodeURIComponent(`Problem ${p.id}: ${p.title}`)}`;
  const issueLink = `<p class="report-issue">🐛 Found a bug? <a href="${issueUrl}" target="_blank" rel="noopener">Open a GitHub issue</a> or <a href="${mailUrl}">email us</a></p>`;
  document.getElementById('prob-hints').innerHTML =
    (p.hints || '<p class="results-placeholder">Hints coming soon.</p>') +
    buildFunctionRefs(p.tags || []) +
    solutionBlock + issueLink;

  renderExpectedTab(p.expected);

  document.getElementById('res-output').innerHTML = '<p class="results-placeholder">Run your query to see results here.</p>';
  document.getElementById('res-console').innerHTML = '<p class="results-placeholder">No console output.</p>';

  document.querySelectorAll('.desc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.desc-panel').forEach(t => t.classList.remove('active'));
  document.querySelector('.desc-tab').classList.add('active');
  document.getElementById('tab-desc').classList.add('active');
  document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
  document.querySelector('.results-tab').classList.add('active');
  document.querySelectorAll('#res-output, #res-expected, #res-console').forEach(el => el.style.display = 'none');
  document.getElementById('res-output').style.display = 'block';

  const starterCode = p.starterCode || `LOAD spatial;\n\n-- Write your query here\nSELECT 1;`;
  initEditor(starterCode);

  const hasBackend = problemExecutable(p);
  document.getElementById('run-btn').disabled = !dbReady || !hasBackend;
  document.getElementById('submit-btn').disabled = !dbReady || !hasBackend;
  if (!hasBackend) {
    document.getElementById('res-output').innerHTML = '<p class="results-placeholder">Live execution isn\'t set up for this problem yet. More coming soon!</p>';
  }
}

// ─── TAB SWITCHERS ───────────────────────────────────────────────────────────
function switchDescTab(btn, panelId) {
  document.querySelectorAll('.desc-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.desc-panel').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(panelId).classList.add('active');
}

function switchResTab(btn, panelId) {
  document.querySelectorAll('.results-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('#res-output, #res-expected, #res-console').forEach(el => el.style.display = 'none');
  btn.classList.add('active');
  document.getElementById(panelId).style.display = 'block';
}

// ─── PROBLEM TABLE (list screen) ────────────────────────────────────────────
// Suggested learning order — stages of increasing difficulty/prerequisites.
// Problems not listed here are appended at the end automatically.
const LEARNING_PATH = [
  ['🧭 Foundations',              [20, 1, 3, 5, 8, 11, 14]],
  ['📍 Distance & Proximity',     [2, 25, 9, 13, 22]],
  ['🔗 Joins & Aggregation',      [4, 6, 10, 17, 27, 28, 24]],
  ['✂️ Editing & Data Quality',   [7, 12, 16, 15]],
  ['🌐 Projections & Bearings',   [26, 29]],
  ['📊 Real-World Analytics',     [21, 23, 18, 19]],
];

function renderTable() {
  const tbody = document.getElementById('problem-body');
  const matches = p => {
    const matchDiff = currentDiff === 'all' || p.diff === currentDiff;
    const q = currentSearch.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q)
      || (p.tags || []).some(t => t.toLowerCase().includes(q))
      || (p.topic || '').toLowerCase().includes(q);
    return matchDiff && matchSearch;
  };
  const byId = new Map(problemIndex.map(p => [p.id, p]));
  const inPath = new Set(LEARNING_PATH.flatMap(([, ids]) => ids));
  const stages = LEARNING_PATH
    .map(([label, ids]) => [label, ids.map(id => byId.get(id)).filter(p => p && matches(p))])
    .filter(([, ps]) => ps.length);
  const extra = problemIndex.filter(p => !inPath.has(p.id) && matches(p));
  if (extra.length) stages.push(['✨ More', extra]);

  tbody.innerHTML = stages.map(([label, ps]) =>
    `<tr class="path-header"><td colspan="6">${label}</td></tr>` +
    ps.map(p => `
    <tr class="${p.solved ? 'solved-row' : ''}" data-id="${p.id}">
      <td class="td-status">${p.solved ? '<span class="check-icon">✓</span>' : ''}</td>
      <td class="td-id">${p.id}</td>
      <td class="td-title">
        <a href="#/problems/${p.id}">${escapeHtml(p.title)}</a>
        <div class="title-tags">${(p.tags || []).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join('')}</div>
      </td>
      <td class="td-diff"><span class="diff-badge diff-${p.diff.toLowerCase()}">${p.diff}</span></td>
      <td class="td-topic"><span class="topic-chip"><span>${p.icon || ''}</span>${escapeHtml(p.topic)}</span></td>
      <td class="td-premium">${p.premium ? '<span class="premium-lock">🔒</span>' : ''}</td>
    </tr>
  `).join('')).join('');

  tbody.querySelectorAll('tr[data-id]').forEach(tr => {
    tr.addEventListener('click', (e) => {
      e.preventDefault();
      openProblem(Number(tr.dataset.id));
    });
  });

  document.getElementById('solved-count').textContent = solvedIds.size;
  document.getElementById('total-count').textContent = problemIndex.length;
  const statTotal = document.getElementById('stat-total');
  if (statTotal) statTotal.textContent = problemIndex.length;
  const statSolved = document.getElementById('stat-solved');
  if (statSolved) statSolved.textContent = solvedIds.size;
  const statTopics = document.getElementById('stat-topics');
  if (statTopics) statTopics.textContent = new Set(problemIndex.map(p => p.topic)).size;
}

function filterTable(val) { currentSearch = val; renderTable(); }
function setDiff(btn, diff) {
  currentDiff = diff;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderTable();
}

// ─── ROUTING (basic hash-based, no framework needed) ────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('nav-link-active', a.getAttribute('href') === location.hash);
  });
}

function handleRoute() {
  const hash = location.hash;
  const probMatch = hash.match(/^#\/problems\/(\d+)$/);
  if (probMatch) {
    openProblem(Number(probMatch[1]));
  } else if (hash === '#/resources') {
    document.getElementById('nav-center').innerHTML = '';
    showScreen('screen-resources');
  } else if (hash === '#/leaderboard') {
    document.getElementById('nav-center').innerHTML = '';
    showScreen('screen-leaderboard');
    initLeaderboard();
  } else if (hash === '#/graph') {
    document.getElementById('nav-center').innerHTML = '';
    showScreen('screen-graph');
    initGraph();
  } else {
    goHome();
  }
}

// ─── WIRE UP STATIC DOM EVENT HANDLERS ──────────────────────────────────────
function wireStaticEvents() {
  document.getElementById('logo-home').addEventListener('click', goHome);
  document.getElementById('run-btn').addEventListener('click', () => runQuery(false));
  document.getElementById('submit-btn').addEventListener('click', () => runQuery(true));
  document.getElementById('search-input').addEventListener('input', (e) => filterTable(e.target.value));

  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => setDiff(btn, btn.dataset.diff));
  });

  document.querySelectorAll('.desc-tab').forEach(tab => {
    tab.addEventListener('click', () => switchDescTab(tab, tab.dataset.panel));
  });
  document.querySelectorAll('.results-tab').forEach(tab => {
    tab.addEventListener('click', () => switchResTab(tab, tab.dataset.panel));
  });

  window.addEventListener('popstate', handleRoute);
}

// ─── AUTH UI ─────────────────────────────────────────────────────────────────
function renderNavAuth(user) {
  const slot = document.getElementById('nav-auth-slot');
  if (!slot) return;

  if (!SUPABASE_CONFIGURED) {
    // Supabase not set up yet — show a greyed-out placeholder
    slot.innerHTML = `<span class="nav-auth-hint" title="Add Supabase credentials to js/supabase.js to enable auth">Auth not configured</span>`;
    return;
  }

  if (user) {
    const avatar = user.user_metadata?.avatar_url;
    const name   = user.user_metadata?.full_name || user.user_metadata?.user_name || user.email;
    slot.innerHTML = `
      <div class="nav-user" id="nav-user-btn">
        ${avatar
          ? `<img src="${escapeHtml(avatar)}" class="nav-avatar" alt="${escapeHtml(name)}">`
          : `<div class="nav-avatar-init">${escapeHtml(name[0].toUpperCase())}</div>`
        }
        <span class="nav-username">${escapeHtml(name)}</span>
        <i class="nav-chevron">▾</i>
      </div>
      <div class="nav-dropdown" id="nav-dropdown" style="display:none">
        <div class="nav-dropdown-item nav-dropdown-email">${escapeHtml(user.email)}</div>
        <div class="nav-dropdown-sep"></div>
        <div class="nav-dropdown-item" id="nav-signout-btn">Sign out</div>
      </div>
    `;
    document.getElementById('nav-user-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      const dd = document.getElementById('nav-dropdown');
      dd.style.display = dd.style.display === 'none' ? 'block' : 'none';
    });
    document.getElementById('nav-signout-btn').addEventListener('click', async () => {
      await signOut();
      // onAuthChange will fire and re-render
    });
    document.addEventListener('click', () => {
      const dd = document.getElementById('nav-dropdown');
      if (dd) dd.style.display = 'none';
    }, { once: true });
  } else {
    slot.innerHTML = `<button class="nav-cta" id="nav-signin-btn">Sign in</button>`;
    document.getElementById('nav-signin-btn').addEventListener('click', () => openAuthModal());
  }
}

function openAuthModal() {
  document.getElementById('auth-modal-overlay').style.display = 'flex';
  document.getElementById('auth-email').value = '';
  document.getElementById('auth-password').value = '';
  document.getElementById('auth-error').textContent = '';
  setAuthMode('signin');
}

function closeAuthModal() {
  document.getElementById('auth-modal-overlay').style.display = 'none';
}

function setAuthMode(mode) {
  const isSignin = mode === 'signin';
  document.getElementById('auth-modal-title').textContent = isSignin ? 'Sign in' : 'Create account';
  document.getElementById('auth-submit-btn').textContent  = isSignin ? 'Sign in' : 'Create account';
  document.getElementById('auth-switch-text').innerHTML   = isSignin
    ? 'No account? <a href="#" id="auth-switch-link">Create one</a>'
    : 'Already have an account? <a href="#" id="auth-switch-link">Sign in</a>';
  document.getElementById('auth-switch-link').addEventListener('click', (e) => {
    e.preventDefault();
    setAuthMode(isSignin ? 'signup' : 'signin');
  });
  document.getElementById('auth-modal-form').dataset.mode = mode;
}

async function handleAuthSubmit(e) {
  e.preventDefault();
  const form     = document.getElementById('auth-modal-form');
  const mode     = form.dataset.mode;
  const email    = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const errEl    = document.getElementById('auth-error');
  const submitEl = document.getElementById('auth-submit-btn');
  const { signInWithEmail, signUpWithEmail } = await import('./supabase.js');

  errEl.textContent = '';
  submitEl.disabled = true;
  submitEl.textContent = 'Please wait…';

  try {
    if (mode === 'signin') {
      await signInWithEmail(email, password);
    } else {
      const { user } = await signUpWithEmail(email, password);
      if (!user?.confirmed_at) {
        errEl.style.color = 'var(--green)';
        errEl.textContent = 'Check your email to confirm your account, then sign in.';
        submitEl.disabled = false;
        submitEl.textContent = 'Create account';
        return;
      }
    }
    closeAuthModal();
  } catch (err) {
    errEl.style.color = '';
    errEl.textContent = friendlyAuthError(err);
  } finally {
    submitEl.disabled = false;
    submitEl.textContent = mode === 'signin' ? 'Sign in' : 'Create account';
  }
}

async function handleOAuth(provider) {
  const { signInWithOAuth } = await import('./supabase.js');
  const errEl = document.getElementById('auth-error');
  try {
    await signInWithOAuth(provider);
    // Page will redirect to OAuth provider — nothing else needed here
  } catch (err) {
    errEl.textContent = friendlyAuthError(err);
  }
}

// Supabase surfaces an unreachable backend as a bare "NetworkError"/"Failed to
// fetch", which means nothing to a user. On the free tier the usual cause is the
// project being paused after inactivity — it takes a minute or two to wake up.
function friendlyAuthError(err) {
  const msg = err?.message || String(err);
  if (/NetworkError|Failed to fetch|ERR_NAME_NOT_RESOLVED|NetworkError when/i.test(msg)) {
    return 'Can’t reach the accounts server right now — it may be waking up. ' +
           'Try again in a minute. Your solved problems are still saved in this browser either way.';
  }
  return msg;
}


// ─── LEADERBOARD ─────────────────────────────────────────────────────────────
async function initLeaderboard() {
  const select = document.getElementById('lb-problem-select');
  const authNote = document.getElementById('lb-auth-note');

  // Show sign-in nudge if not logged in
  if (authNote) authNote.style.display = (!SUPABASE_CONFIGURED || !currentUser) ? 'flex' : 'none';

  // Populate problem dropdown from index (only problems with execution)
  if (select && select.options.length <= 1 && problemIndex.length > 0) {
    problemIndex
      .filter(p => p.hasExecution)
      .forEach(p => {
        const opt = document.createElement('option');
        opt.value = p.id;
        opt.textContent = `#${p.id} — ${p.title}`;
        select.appendChild(opt);
      });
    select.addEventListener('change', () => {
      if (select.value) loadLeaderboard(Number(select.value));
    });
  }
}

async function loadLeaderboard(problemId) {
  const content = document.getElementById('lb-content');
  content.innerHTML = '<div class="lb-loading"><span class="spinner" style="border-top-color:var(--cyan)"></span> Loading…</div>';

  const rows = await fetchLeaderboard(problemId);
  const prob  = problemIndex.find(p => p.id === problemId);

  if (!rows.length) {
    content.innerHTML = `
      <div class="lb-empty">
        <div class="lb-empty-icon">🏁</div>
        <p>No passing submissions yet for <strong>${escapeHtml(prob?.title ?? 'this problem')}</strong>.<br>Be the first on the board!</p>
      </div>`;
    return;
  }

  const myId = currentUser?.id;
  const medals = ['🥇','🥈','🥉'];

  content.innerHTML = `
    <div class="lb-problem-title">${escapeHtml(prob?.title ?? '')} <span class="diff-badge diff-${(prob?.diff??'easy').toLowerCase()}">${prob?.diff??''}</span></div>
    <div class="lb-table-wrap">
      <table class="lb-table">
        <thead>
          <tr>
            <th class="lb-th-rank">Rank</th>
            <th>User</th>
            <th class="lb-th-time">Runtime</th>
            <th class="lb-th-date">Date</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((r, i) => {
            const isMe = currentUser && r.display_name === (currentUser.user_metadata?.full_name || currentUser.user_metadata?.user_name || currentUser.email);
            return `
              <tr class="${isMe ? 'lb-row-me' : ''}">
                <td class="lb-td-rank">${medals[i] ?? `<span class="lb-rank-num">${i+1}</span>`}</td>
                <td class="lb-td-user">
                  ${r.avatar_url
                    ? `<img src="${escapeHtml(r.avatar_url)}" class="lb-avatar" alt="">`
                    : `<div class="lb-avatar-init">${escapeHtml((r.display_name||'?')[0].toUpperCase())}</div>`}
                  <span class="lb-username">${escapeHtml(r.display_name ?? 'Anonymous')}${isMe ? ' <span class="lb-you">you</span>' : ''}</span>
                </td>
                <td class="lb-td-time"><span class="lb-runtime">${r.runtime_ms}<span class="lb-ms">ms</span></span></td>
                <td class="lb-td-date">${new Date(r.submitted_at).toLocaleDateString('en-CA')}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>
    <p class="res-count" style="margin-top:10px">${rows.length} submission${rows.length !== 1 ? 's' : ''} · fastest per user</p>
  `;
}

// ─── KNOWLEDGE GRAPH ─────────────────────────────────────────────────────────
function initGraph() {
  const container = document.getElementById('graph-container');
  container.innerHTML = '';

  const W = container.clientWidth  || window.innerWidth;
  const H = container.clientHeight || window.innerHeight - 100;

  // Build nodes: topics + problems + tags (functions)
  const topicNames = [...new Set(problemIndex.map(p => p.topic))];
  const tagNames   = [...new Set(problemIndex.flatMap(p => p.tags || []))];

  const nodes = [
    ...topicNames.map(t  => ({ id: `t:${t}`,   label: t,         type: 'topic'   })),
    ...problemIndex.map(p => ({ id: `p:${p.id}`, label: p.title,  type: 'problem', diff: p.diff, pid: p.id, solved: p.solved })),
    ...tagNames.map(t    => ({ id: `f:${t}`,   label: t,         type: 'fn'      })),
  ];

  const links = [
    ...problemIndex.map(p => ({ source: `p:${p.id}`, target: `t:${p.topic}` })),
    ...problemIndex.flatMap(p => (p.tags || []).map(t => ({ source: `p:${p.id}`, target: `f:${t}` }))),
  ];

  const color = d => {
    if (d.type === 'topic')   return '#4FC3F7';
    if (d.type === 'problem') return d.diff === 'Easy' ? '#22c55e' : d.diff === 'Medium' ? '#f59e0b' : '#ef4444';
    return '#475569';
  };
  const radius = d => d.type === 'topic' ? 18 : d.type === 'problem' ? 11 : 7;

  const svg = d3.select(container).append('svg')
    .attr('width', W).attr('height', H)
    .style('background', 'var(--bg)');

  // Pan + zoom
  const g = svg.append('g');
  svg.call(d3.zoom().scaleExtent([0.3, 3]).on('zoom', e => g.attr('transform', e.transform)));

  const sim = d3.forceSimulation(nodes)
    .force('link',      d3.forceLink(links).id(d => d.id).distance(d => d.target.type === 'topic' ? 90 : 60))
    .force('charge',    d3.forceManyBody().strength(d => d.type === 'topic' ? -400 : -150))
    .force('center',    d3.forceCenter(W / 2, H / 2))
    .force('collision', d3.forceCollide(d => radius(d) + 4));

  const link = g.append('g').selectAll('line').data(links).join('line')
    .attr('stroke', '#253354').attr('stroke-width', 1.2);

  const node = g.append('g').selectAll('g').data(nodes).join('g')
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) sim.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
      .on('drag',  (e, d) => { d.fx = e.x; d.fy = e.y; })
      .on('end',   (e, d) => { if (!e.active) sim.alphaTarget(0); d.fx = null; d.fy = null; }));

  node.append('circle')
    .attr('r', radius)
    .attr('fill', color)
    .attr('stroke', '#0B1220').attr('stroke-width', 2);

  // Solved checkmark ring
  node.filter(d => d.type === 'problem' && d.solved)
    .append('circle')
    .attr('r', d => radius(d) + 3)
    .attr('fill', 'none').attr('stroke', '#4ADE80').attr('stroke-width', 2);

  // Labels
  node.append('text')
    .text(d => d.type === 'problem' ? `${d.pid}. ${d.label}` : d.label)
    .attr('x', d => radius(d) + 5).attr('y', 4)
    .attr('font-size', d => d.type === 'topic' ? '12px' : '10px')
    .attr('font-family', 'Space Grotesk, sans-serif')
    .attr('fill', d => d.type === 'fn' ? '#94A3B8' : '#E2E8F0')
    .attr('pointer-events', 'none');

  // Click: problem → open it; fn with docs → open doc URL; topic/unknown → filter list
  node.on('click', (e, d) => {
    e.stopPropagation();
    if (d.type === 'problem') {
      openProblem(d.pid);
    } else if (d.type === 'fn' && FUNCTION_DOCS[d.label]) {
      window.open(FUNCTION_DOCS[d.label].url, '_blank', 'noopener');
    } else if (d.type === 'fn') {
      // ponytail: no docs page for this tag — filter the problem list by it instead of dead-clicking
      currentSearch = d.label;
      currentDiff   = 'all';
      goHome();
    } else {
      currentSearch = d.label;
      currentDiff   = 'all';
      goHome();
      document.getElementById('search-input').value = d.label;
    }
  });

  // Highlight connected nodes on hover
  node.on('mouseover', (e, d) => {
    const connected = new Set([d.id]);
    links.forEach(l => {
      if (l.source.id === d.id) connected.add(l.target.id);
      if (l.target.id === d.id) connected.add(l.source.id);
    });
    node.select('circle').attr('opacity', n => connected.has(n.id) ? 1 : 0.2);
    link.attr('opacity',  l => (l.source.id === d.id || l.target.id === d.id) ? 0.9 : 0.1);
    node.select('text').attr('opacity',  n => connected.has(n.id) ? 1 : 0.2);
  }).on('mouseout', () => {
    node.select('circle').attr('opacity', 1);
    link.attr('opacity', 1);
    node.select('text').attr('opacity', 1);
  });

  sim.on('tick', () => {
    link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    node.attr('transform', d => `translate(${d.x},${d.y})`);
  });
}

// ─── BOOT ────────────────────────────────────────────────────────────────────
(async function boot() {
  wireStaticEvents();

  // Wire auth modal events
  document.getElementById('auth-modal-form').addEventListener('submit', handleAuthSubmit);
  document.getElementById('auth-modal-overlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeAuthModal();
  });
  document.getElementById('auth-close-btn').addEventListener('click', closeAuthModal);

  // Only show OAuth buttons for providers actually enabled in Supabase — a button
  // for an unconfigured provider just dead-ends on a Supabase error page.
  const oauthBtns = { github: 'auth-github-btn', google: 'auth-google-btn' };
  for (const [provider, id] of Object.entries(oauthBtns)) {
    const btn = document.getElementById(id);
    if (CONFIG.OAUTH_PROVIDERS.includes(provider)) {
      btn.addEventListener('click', () => handleOAuth(provider));
    } else {
      btn.remove();
    }
  }
  if (!CONFIG.OAUTH_PROVIDERS.length) {
    document.querySelector('.auth-oauth')?.remove();
    document.querySelector('.auth-divider')?.remove();
  }

  if (location.protocol === 'file:') {
    document.getElementById('problem-body').innerHTML =
      `<tr><td colspan="7" class="results-error" style="padding:2rem">
        This app must be served over HTTP — opening index.html directly won't work.<br><br>
        From the project folder, run: <code style="color:var(--cyan)">python3 -m http.server 8000</code><br>
        then visit <code style="color:var(--cyan)">http://localhost:8000</code>.
      </td></tr>`;
    initDuckDB();
    return;
  }

  // Render Sign In immediately so the nav isn't blank while Supabase
  // checks for an existing session (which is async and can take ~300ms).
  renderNavAuth(null);

  // Subscribe to auth state changes. Supabase fires this once on init with
  // the current session (or null), then again on every login/logout.
  onAuthChange(async (event, session) => {
    currentUser = session?.user ?? null;
    renderNavAuth(currentUser);
    await refreshSolvedIds();
  });

  try {
    problemIndex = await loadProblemIndex();
  } catch (e) {
    document.getElementById('problem-body').innerHTML =
      `<tr><td colspan="7" class="results-error" style="padding:2rem">${escapeHtml(e.message)}</td></tr>`;
  }
  renderTable();
  handleRoute();
  initDuckDB();
})();
