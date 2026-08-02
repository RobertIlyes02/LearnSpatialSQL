"""Generate crawlable static pages + sitemap from problems/*.json.

Why this exists: the app uses hash routing (#/problems/21). Everything after the
'#' is never sent to a server, so Google cannot see any problem content. These
static pages give search engines real prose to index, each linking into the live
app. Run after adding or editing problems:

    python tools/build_seo.py
"""
import json, glob, os, re, html
from datetime import date

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
os.chdir(ROOT)
SITE = 'https://geosql.dev'
OUT = 'p'


def load_problems():
    out = []
    for f in sorted(glob.glob('problems/[0-9]*.json'),
                    key=lambda p: int(os.path.basename(p).split('.')[0])):
        out.append(json.load(open(f, encoding='utf-8')))
    return out


def plain(s, limit=155):
    """HTML -> a clean meta-description sentence."""
    s = re.sub(r'<h3>.*?</h3>', ' ', s or '', flags=re.S)
    s = re.sub(r'<pre>.*?</pre>', ' ', s, flags=re.S)
    s = re.sub(r'<[^>]+>', '', s)
    s = html.unescape(s)
    s = ' '.join(s.split())
    if len(s) > limit:
        s = s[:limit].rsplit(' ', 1)[0] + '…'
    return s


def page(title, desc, canonical, body, extra_head=''):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="article">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{canonical}">
<meta property="og:image" content="{SITE}/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/css/styles.css">
{extra_head}
</head>
<body>
<div class="seo-page">
{body}
</div>
</body>
</html>
"""


def build():
    problems = load_problems()
    os.makedirs(OUT, exist_ok=True)
    today = date.today().isoformat()
    urls = [(f'{SITE}/', '1.0'), (f'{SITE}/p/', '0.9'), (f'{SITE}/privacy.html', '0.3')]

    for i, p in enumerate(problems):
        pid = p['id']
        desc = plain(p.get('description', ''))
        tags = ', '.join(p.get('tags') or [])
        title = f"{p['title']} — {p['diff']} Spatial SQL Problem | GeoSQL"
        canonical = f'{SITE}/p/{pid}.html'

        prev_p = problems[i - 1] if i > 0 else None
        next_p = problems[i + 1] if i < len(problems) - 1 else None
        nav = []
        if prev_p:
            nav.append(f'<a href="/p/{prev_p["id"]}.html">← {html.escape(prev_p["title"])}</a>')
        if next_p:
            nav.append(f'<a href="/p/{next_p["id"]}.html">{html.escape(next_p["title"])} →</a>')

        # JSON-LD helps search engines understand this is a learning exercise
        ld = {
            "@context": "https://schema.org",
            "@type": "LearningResource",
            "name": p['title'],
            "description": desc,
            "url": canonical,
            "educationalLevel": p['diff'],
            "learningResourceType": "Exercise",
            "teaches": p.get('tags') or [],
            "isAccessibleForFree": True,
            "inLanguage": "en",
            "isPartOf": {"@type": "WebSite", "name": "GeoSQL", "url": SITE + '/'},
        }
        extra = f'<script type="application/ld+json">{json.dumps(ld)}</script>'

        body = f"""
<nav class="seo-nav"><a href="/">GeoSQL</a> › <a href="/p/">Problems</a> › {html.escape(p['title'])}</nav>

<h1>{html.escape(p['title'])}</h1>
<p class="seo-meta">
  <span class="diff-badge diff-{p['diff'].lower()}">{p['diff']}</span>
  <span class="seo-topic">{html.escape(p['topic'])}</span>
  {''.join(f'<span class="tag">{html.escape(t)}</span>' for t in (p.get('tags') or []))}
</p>

<p class="seo-cta"><a class="btn-primary" href="/#/problems/{pid}">Solve this in your browser →</a></p>

<section>{p.get('description','')}</section>
<section>{p.get('schema','')}</section>

<h2>Hints</h2>
<section>{p.get('hints','')}</section>

<p class="seo-cta"><a class="btn-primary" href="/#/problems/{pid}">Open the SQL editor →</a></p>

<p class="seo-note">This problem runs entirely in your browser using DuckDB compiled to
WebAssembly — nothing is installed and no query leaves your machine. Concepts covered:
{html.escape(tags)}.</p>

<nav class="seo-prevnext">{' · '.join(nav)}</nav>
<footer class="seo-footer"><a href="/">← All {len(problems)} spatial SQL problems</a></footer>
"""
        open(f'{OUT}/{pid}.html', 'w', encoding='utf-8').write(
            page(title, desc, canonical, body, extra))
        urls.append((canonical, '0.8'))

    # index of all problems — gives crawlers a path to every page
    rows = '\n'.join(
        f'<li><a href="/p/{p["id"]}.html">{p["id"]}. {html.escape(p["title"])}</a>'
        f' <span class="diff-badge diff-{p["diff"].lower()}">{p["diff"]}</span>'
        f' <span class="seo-topic">{html.escape(p["topic"])}</span></li>'
        for p in problems)
    idx_body = f"""
<nav class="seo-nav"><a href="/">GeoSQL</a> › Problems</nav>
<h1>All {len(problems)} Spatial SQL Practice Problems</h1>
<p class="seo-note">Hands-on DuckDB spatial SQL exercises — point-in-polygon, spatial
joins, buffers, projections, H3 hexagons and real Parquet datasets. Every problem runs
in your browser; nothing to install.</p>
<ul class="seo-list">
{rows}
</ul>
<p class="seo-cta"><a class="btn-primary" href="/">Open GeoSQL →</a></p>
"""
    open(f'{OUT}/index.html', 'w', encoding='utf-8').write(page(
        f'All {len(problems)} Spatial SQL Practice Problems | GeoSQL',
        f'Browse {len(problems)} free spatial SQL exercises for DuckDB — spatial joins, '
        'buffers, projections, H3 and Parquet. Runs in your browser.',
        f'{SITE}/p/', idx_body))

    sm = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    for loc, pri in urls:
        sm.append(f'  <url><loc>{loc}</loc><lastmod>{today}</lastmod>'
                  f'<priority>{pri}</priority></url>')
    sm.append('</urlset>')
    open('sitemap.xml', 'w', encoding='utf-8').write('\n'.join(sm) + '\n')

    print(f'{len(problems)} problem pages + index written to /{OUT}')
    print(f'sitemap.xml: {len(urls)} URLs')


if __name__ == '__main__':
    build()
