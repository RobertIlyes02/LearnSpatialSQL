"""Validate every problem: setup SQL runs, and the stored reference `solution`
reproduces `expected`, using the same String() comparison as app.js validateAnswer.

Run from anywhere: python tests/test_solutions.py
"""
import duckdb, json, glob, os, sys

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))

def js_str(v):
    """Mimic JS String(v): floats with integer value drop the .0; booleans lowercase."""
    if v is None: return ''
    if isinstance(v, bool): return 'true' if v else 'false'
    if isinstance(v, float) and v == int(v) and abs(v) < 1e15:
        return str(int(v))
    return str(v)

fails = 0
files = sorted(glob.glob('problems/[0-9]*.json'),
               key=lambda p: int(os.path.basename(p).split('.')[0]))
for f in files:
    p = json.load(open(f, encoding='utf-8'))
    pid, title = p['id'], p['title']
    sol, exp = p.get('solution'), p.get('expected')
    if not sol or not exp:
        print(f"{pid:>2} SKIP  {title} (no solution/expected)")
        continue
    con = duckdb.connect()
    try:
        con.execute('INSTALL spatial; LOAD spatial;')
        if 'INSTALL h3' in sol:
            con.execute('INSTALL h3 FROM community; LOAD h3;')
        if (p.get('setup') or '').strip():
            con.execute(p['setup'])
        # INSTALL/LOAD already handled above; strip those lines from the solution
        sql = '\n'.join(l for l in sol.splitlines()
                        if not l.strip().upper().startswith(('INSTALL ', 'LOAD ')))
        cur = con.execute(sql)
        cols = [d[0] for d in cur.description]
        rows = [dict(zip(cols, r)) for r in cur.fetchall()]
        ok = len(rows) == len(exp) and all(
            js_str(rows[i].get(k)) == js_str(v)
            for i, er in enumerate(exp) for k, v in er.items())
        if ok:
            print(f"{pid:>2} PASS  {title}")
        else:
            fails += 1
            print(f"{pid:>2} FAIL  {title}")
            print(f"    got:      {[{k: js_str(v) for k, v in r.items()} for r in rows[:6]]}")
            print(f"    expected: {[{k: js_str(v) for k, v in r.items()} for r in exp[:6]]}")
    except Exception as e:
        fails += 1
        print(f"{pid:>2} ERROR {title}: {str(e)[:150]}")
    con.close()

print(f"\n{'ALL PASS' if fails == 0 else f'{fails} FAILURE(S)'}")
sys.exit(1 if fails else 0)
