# Launch Checklist

Roadmap to publish [[GeoSQL Knowledge Base|GeoSQL]] and start marketing it.

## 👤 Robert's To-Do (needs your accounts — Claude can't do these)

- [ ] **Deploy**: connect the GitHub repo on vercel.com (or Netlify) — repo is static, zero config
- [ ] **Domain**: buy one (~$12/yr) and point it at the deploy
- [ ] **Leaderboard**: paste the two SQL statements from the comment block in `js/supabase.js` (~line 196) into the Supabase SQL editor (CREATE VIEW leaderboard + GRANT)
- [ ] **Merge PR #2** on GitHub once you're happy with it
- [ ] **Analytics**: create a Plausible or Vercel Analytics account → then ask Claude to add the snippet
- [x] **Donate button** ✅ 2026-08-02 — Ko-fi (ko-fi.com/robertilyes) wired into the nav
  - [ ] ⚠️ Still required: connect PayPal/Stripe in Ko-fi Settings → Payments, or donations can't be received
- [ ] **Social preview image**: after deploy, screenshot the editor and ask Claude to add it as og:image
- [ ] **Test on your actual phone** — automated check passed, but real thumbs are the judge
- [ ] **Launch posts** (after deploy): r/gis and r/PostGIS first, then Show HN, DuckDB Discord, #gischat
- [ ] Optional: **blog post** "How I built a spatial SQL playground that runs entirely in the browser"

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
- [x] Ordered learning path ✅ 2026-07-31 — problem list grouped into 6 stages (Foundations → Real-World Analytics)
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
