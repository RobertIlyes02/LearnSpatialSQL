# Launch Checklist

Roadmap to publish [[GeoSQL Knowledge Base|GeoSQL]] and start marketing it.

## Phase 1 — Blockers
- [ ] Commit and push all work (uncommitted: app.js, problems 21–23, data/)
- [ ] Deploy to a real URL (Vercel/Netlify/GH Pages) + buy domain
- [ ] Test every problem end-to-end (run reference solution → Accepted)
- [ ] Finish or hide problems 16–20 (`hasExecution: false`)
- [ ] Fix mobile — landing page + problem list must not break
- [ ] Error state when DuckDB WASM fails to load (no infinite "Loading runtime…")

## Phase 2 — First two weeks
- [ ] Landing page pitch: "LeetCode for spatial SQL — runs in your browser"
- [ ] Show-solution + explanation per problem
- [ ] Ordered learning path (use the knowledge graph as the spine)
- [ ] Analytics (Plausible / Vercel Analytics)
- [ ] "Report an issue" link per problem
- [ ] OG/meta tags + social preview image

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
