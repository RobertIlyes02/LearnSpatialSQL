# Launch Checklist

Roadmap to publish [[GeoSQL Knowledge Base|GeoSQL]] and start marketing it.

**Status:** 29 problems, all passing `tests/test_solutions.py`. Domain + email + donations
wired. Remaining blockers are DNS cutover and the launch posts themselves.

## 👤 Robert's To-Do (needs your accounts — Claude can't do these)

- [x] **Add a `www` record** — `www.geosql.dev` currently does **not resolve**
      (NXDOMAIN). Cloudflare → DNS → add `CNAME www → geosql.dev` (proxied).
      People type `www.` out of habit and currently hit a dead end.
- [x] **Analytics** — create a Plausible or Vercel Analytics account → then ask Claude
      to add the snippet.
- [x] **Supabase decisions** (free tier):
  - [x] Set a **minimum password length (8+)** + required character classes —
        Authentication → **Providers → Email** (this part *is* available on free).
  - [ ] Decide on **Pro ($25/mo)**. Bundles: no weekly pauses that silently break
        login, leaked-password protection (Pro-only), better limits.
- [ ] **Launch posts** — r/gis + r/PostGIS first, then Show HN, DuckDB Discord, #gischat.
- [ ] Optional: **blog post** — "How I built a spatial SQL playground that runs
      entirely in the browser."

## ✅ Done

- [x] **Deploy** — Vercel, connected to the GitHub repo
- [x] **Domain** ✅ 2026-08-02 — `geosql.dev` (Namecheap → Cloudflare nameservers)
- [x] **Support email** ✅ 2026-08-02 — `support@geosql.dev` via Cloudflare Email
      Routing; wired into the footer + every problem's bug-report line
- [x] **Donate button** ✅ 2026-08-02 — Ko-fi in nav, **PayPal connected** — donations
      can actually be received
- [x] **DNS cutover** ✅ 2026-08-02 — `geosql.dev` live on Cloudflare NS, HTTPS 200,
      serving latest build, proxied through Cloudflare → Vercel
- [x] **Phone test** ✅ 2026-08-02 — confirmed good on a real device
- [x] **Absolute `og:image` / `og:url` / canonical** ✅ 2026-08-02
- [x] **Leaderboard** ✅ 2026-08-02 — schema in `supabase/schema.sql`. Found and fixed
      a real bug: `submissions.runtime_ms` never existed, so every insert was failing
      silently. Rebuilt the view around a `profiles` table so it never joins
      `auth.users` (the original SQL would have published every user's **email**
      publicly). Solution `code` column blocked from anon. Security advisor: clean
      except the Pro-only password lint.
- [x] **Logo** ✅ 2026-08-02 — custom polygon-with-vertices mark (nav + favicon + OG),
      replacing the 🌐 emoji
- [x] **Social preview** ✅ 2026-08-02 — `og-image.png` 1200×630, `summary_large_image`
- [x] **Mobile nav overflow** ✅ 2026-08-02 — nav needed 661px on a 390px screen;
      wordmark hides, links scroll
- [x] **All 29 problems** verified end-to-end via `tests/test_solutions.py`
- [x] **Learning path** — 6 stages, Foundations → Real-World Analytics
- [x] **Show Solution** per problem
- [x] **Dead links** — all 20 external links audited, 5 fixed
- [x] **Fake pagination** removed
- [x] **Cache headers** — `vercel.json`; stale ES modules were breaking the whole app

## Polish before/around launch

- [ ] Landing page pitch: "LeetCode for spatial SQL — runs in your browser"
- [ ] SEO: crawlable problem URLs, sitemap (hash routing is invisible to Google)
- [ ] Re-check the social card renders once deployed — paste `https://geosql.dev`
      into the [OG debugger](https://www.opengraph.xyz/) or a Slack/Discord message

**Note:** Cloudflare's Email Obfuscation rewrites the footer `mailto:` into a
`/cdn-cgi/l/email-protection` link and decodes it with JS. That's anti-spam, not a
bug — the link works for real visitors. Disable it under Scrape Shield if you ever
want the raw address in the HTML.

## Explicitly later

- Payments / premium tier
- Gamification (badges, streaks, comments)

**Critical path:** DNS cutover → phone test → landing pitch → launch posts
