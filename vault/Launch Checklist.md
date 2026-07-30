# Launch Checklist

Roadmap to publish [[GeoSQL Knowledge Base|GeoSQL]] and start marketing it.

## Phase 1 — Blockers
- [x] Commit and push all work ✅ 2026-07-29
- [ ] Deploy to a real URL (Vercel/Netlify/GH Pages) + buy domain
- [x] Test every problem end-to-end ✅ 2026-07-29 — `tests/test_solutions.py`, ALL 23 pass; also browser-verified in real DuckDB-WASM (P18 H3, P19 QUALIFY, P20 parquet)
- [x] Finish or hide problems 16–20 ✅ 2026-07-29 — all finished with full statements, setups, expected outputs & solutions. P18 → H3 Hexbin Hotspots, P20 → Load a Parquet Layer
- [ ] Fix mobile — landing page + problem list must not break
- [x] Error state when DuckDB WASM fails to load ✅ already existed (30s timeout, file:// detection, dismiss button)

## Phase 2 — First two weeks
- [ ] Landing page pitch: "LeetCode for spatial SQL — runs in your browser"
- [x] Show-solution per problem ✅ 2026-07-29 — collapsible "Show Solution" in Hints tab, all 23 problems
- [ ] Ordered learning path (use the knowledge graph as the spine)
- [ ] Analytics (Plausible / Vercel Analytics)
- [x] "Report an issue" link per problem ✅ 2026-07-29 — GitHub issue link in Hints tab
- [x] OG/meta tags ✅ 2026-07-29 — title, description, OG, Twitter card, favicon (social preview image still TODO after deploy)

## Phase 3 — Marketing & growth
- [ ] Launch posts: r/gis, r/PostGIS → Show HN → DuckDB Discord → #gischat
- [ ] Companion blog post: "spatial SQL playground entirely in the browser"
- [ ] More real-dataset parquet problems (each one = a social post)
- [ ] SEO: crawlable problem URLs, sitemap, homepage copy
- [ ] Auth/leaderboard polish — anonymous solving first, login = "save progress"

## Explicitly later
- Payments / premium tier
- Gamification (badges, streaks, comments)

**Critical path:** commit → deploy → test problems → landing pitch → launch posts
