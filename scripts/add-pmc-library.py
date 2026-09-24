from pathlib import Path

p = Path('client/src/pages/WorkbenchPage.tsx')
s = p.read_text()
s = s.replace('"papers" | "finder";', '"papers" | "finder" | "pmc";')
s = s.replace('papers: "RESEARCH PAPERS", finder: "RESEARCH FINDER"', 'papers: "RESEARCH PAPERS", finder: "RESEARCH FINDER", pmc: "PMC RESEARCH LIBRARY"')
s = s.replace('<Link href="/finder"><ScanSearch size={15} /><span>Find resources</span></Link>', '<Link href="/finder"><ScanSearch size={15} /><span>Find resources</span></Link><Link href="/pmc"><BookOpen size={15} /><span>PMC library</span><em>17</em></Link>')
s = s.replace('focus === "finder" ? <FinderPanel query={query} setQuery={setQuery} /> : <>', 'focus === "finder" ? <FinderPanel query={query} setQuery={setQuery} /> : focus === "pmc" ? <PmcPanel query={query} setQuery={setQuery} /> : <>')
insert = r'''

const pmcRecords = [
  { kind: "VIDEO", label: "PMC 12307736 · Supplement 2", title: "Supplementary video 2", href: "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM2_ESM.mp4", article: "PMC12307736" },
  { kind: "VIDEO", label: "PMC 12307736 · Supplement 3", title: "Supplementary video 3", href: "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM3_ESM.mp4", article: "PMC12307736" },
  { kind: "VIDEO", label: "PMC 10905821 · Supplement 3", title: "Supplementary video 3", href: "https://pmc.ncbi.nlm.nih.gov/articles/instance/10905821/bin/40644_2024_669_MOESM3_ESM.mp4", article: "PMC10905821" },
  { kind: "VIDEO", label: "PMC 10073663 · Supplement 2", title: "Supplementary video 2", href: "https://pmc.ncbi.nlm.nih.gov/articles/instance/10073663/bin/12966_2023_4572_MOESM2_ESM.mp4", article: "PMC10073663" },
  ...["11178780", "10101968", "10559609", "6895055", "9674214", "9694576", "10721617", "10905821", "8249617", "10073663", "8423782", "10491676", "12357858"].map(id => ({ kind: "ARTICLE", label: `PMC${id}`, title: `PubMed Central research article · PMC${id}`, href: `https://pmc.ncbi.nlm.nih.gov/articles/PMC${id}/`, article: `PMC${id}` })),
];

function PmcPanel({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  const records = pmcRecords.filter(r => `${r.kind} ${r.label} ${r.title} ${r.article}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="focus-layout"><div className="resource-head"><div><span className="section-kicker"><BookOpen size={12} /> PMC OPEN RESEARCH LIBRARY</span><h2>{records.length} supplied records</h2><p>Four supplementary videos and thirteen PubMed Central articles, organized as a flat, searchable research shelf.</p></div><div className="resource-filters"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search PMC IDs, videos, articles" /><span>17 RECORDS</span><span>OPEN ACCESS SOURCES</span></div></div><div className="pmc-grid">{records.map((record, i) => <article className="pmc-card" key={record.href}><div className={`pmc-type ${record.kind.toLowerCase()}`}>{record.kind}</div><div className="pmc-card-body"><span className="section-kicker">{String(i + 1).padStart(2, "0")} · {record.label}</span><h3>{record.title}</h3><p>{record.kind === "VIDEO" ? "Supplementary MP4 media asset" : "PubMed Central full-text article"}</p></div><a className="download-link" href={record.href} download={record.kind === "VIDEO"} target="_blank" rel="noreferrer">{record.kind === "VIDEO" ? <Download size={13} /> : <ArrowUpRight size={13} />} {record.kind === "VIDEO" ? "DOWNLOAD MP4" : "OPEN ARTICLE"}</a></article>)}</div>{records.length === 0 && <div className="panel empty-state">No PMC record matches this query.</div>}</div>;
}
'''
s = s + insert
p.write_text(s)

app = Path('client/src/App.tsx')
s = app.read_text()
s = s.replace('<Route path="/finder" component={() => <WorkbenchPage focus="finder" />} />', '<Route path="/finder" component={() => <WorkbenchPage focus="finder" />} />\n  <Route path="/pmc" component={() => <WorkbenchPage focus="pmc" />} />')
app.write_text(s)

css = Path('client/src/index.css')
s = css.read_text()
s = s.replace('background-image:linear-gradient(rgba(100,197,186,.035) 1px,transparent 1px),linear-gradient(90deg,rgba(100,197,186,.035) 1px,transparent 1px);', 'background-image:none;')
s = s.replace('background:radial-gradient(ellipse at 40% 32%,#d3a99c 0 8%,transparent 9%),radial-gradient(ellipse at 65% 60%,#887f76 0 15%,transparent 16%),radial-gradient(ellipse at 25% 74%,#bea78b 0 13%,transparent 14%),linear-gradient(135deg,#5b5149,#ba9b8e 38%,#3c4a4b 76%,#816a6f);', 'background:#66706d;')
s = s.replace('background-image:linear-gradient(rgba(240,245,240,.17) 1px,transparent 1px),linear-gradient(90deg,rgba(240,245,240,.17) 1px,transparent 1px);', 'background-image:none;')
s = s.replace('background-image:linear-gradient(rgba(100,197,186,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(100,197,186,.07) 1px,transparent 1px);', 'background-image:none;')
s = s.replace('background:repeating-linear-gradient(90deg,#a65e65 0 10px,#4e343d 10px 12px);', 'background:#6b3f46;')
s = s.replace('background:repeating-linear-gradient(90deg,var(--teal) 0 10px,#23544f 10px 12px)', 'background:#23544f')
s = s.replace('background:linear-gradient(135deg,#132c34,#16222f 55%,#523c3c);', 'background:#1a2d36;')
s += '.pmc-grid{display:grid;gap:8px}.pmc-card{display:grid;grid-template-columns:88px 1fr auto;gap:16px;align-items:center;border:1px solid var(--line);background:var(--panel);padding:14px 16px}.pmc-type{font:9px var(--mono);letter-spacing:.08em;text-align:center;padding:7px 6px;border:1px solid var(--line2)}.pmc-type.video{color:var(--blue);border-color:#31506b}.pmc-type.article{color:var(--amber);border-color:#665033}.pmc-card-body h3{font-size:14px;margin:5px 0}.pmc-card-body p{color:var(--muted);margin:0}.pmc-card .download-link{justify-self:end}@media (max-width:800px){.pmc-card{grid-template-columns:72px 1fr}.pmc-card .download-link{grid-column:2;justify-self:start}}'
css.write_text(s)
