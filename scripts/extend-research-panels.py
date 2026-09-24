from pathlib import Path

p = Path('client/src/pages/WorkbenchPage.tsx')
s = p.read_text()
s = s.replace('Activity, ArrowDown, ArrowUpRight, Box, BrainCircuit, CheckCircle2, ChevronRight, CircleDot, Code2, Database, Download, Gauge, GitBranch, Grid3X3, Layers3, Maximize2, Microscope, Network, Pause, Play, Radio, RefreshCw, Search, Server, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Terminal, Timer, Upload, Wifi, X, ZoomIn, ZoomOut', 'Activity, ArrowDown, ArrowUpRight, BookOpen, Box, BrainCircuit, CheckCircle2, ChevronRight, CircleDot, Code2, Database, Download, FileText, Gauge, GitBranch, Grid3X3, Layers3, Maximize2, Microscope, Network, Pause, Play, Radio, RefreshCw, ScanSearch, Search, Server, Settings2, ShieldCheck, SlidersHorizontal, Sparkles, Terminal, Timer, Upload, Wifi, X, ZoomIn, ZoomOut')
s = s.replace('"observability" | "research" | "videos" | "images";', '"observability" | "research" | "videos" | "images" | "papers" | "finder";')
s = s.replace('research: "RESEARCH ROADMAP", videos: "ML VIDEO OBSERVATORY", images: "SCIENTIFIC VISUALIZATION"', 'research: "RESEARCH ROADMAP", videos: "ML VIDEO OBSERVATORY", images: "SCIENTIFIC VISUALIZATION", papers: "RESEARCH PAPERS", finder: "RESEARCH FINDER"')
s = s.replace('<Link href="/research"><Search size={15} /><span>Research graph</span></Link>', '<Link href="/research"><Search size={15} /><span>Research graph</span></Link><Link href="/papers"><BookOpen size={15} /><span>Research papers</span><em>3</em></Link><Link href="/finder"><ScanSearch size={15} /><span>Find resources</span></Link>')
s = s.replace('focus === "research" ? <ResearchPanel /> : focus === "videos" ? <VideoPanel query={query} setQuery={setQuery} /> : focus === "images" ? <ImagePanel query={query} setQuery={setQuery} /> : <>', 'focus === "research" ? <ResearchPanel /> : focus === "videos" ? <VideoPanel query={query} setQuery={setQuery} /> : focus === "images" ? <ImagePanel query={query} setQuery={setQuery} /> : focus === "papers" ? <PapersPanel query={query} setQuery={setQuery} /> : focus === "finder" ? <FinderPanel query={query} setQuery={setQuery} /> : <>')
s += r'''

const paperRecords = [
  { title: "Deep Learning for Digital Pathology Image Analysis", authors: "Campanella et al.", year: "2020", venue: "Nature Medicine", file: "/research/papers/deep-learning-wsi.pdf", tags: "whole-slide, weak supervision, pathology" },
  { title: "Self-supervised learning for histopathology representation", authors: "Research preprint", year: "2024", venue: "arXiv open access", file: "/research/papers/self-supervised-wsi.pdf", tags: "self-supervised, embeddings, histopathology" },
  { title: "Whole-slide image survival analysis with deep representations", authors: "Research preprint", year: "2024", venue: "arXiv open access", file: "/research/papers/wsi-survival-analysis.pdf", tags: "survival, WSI, deep learning" },
];

function PapersPanel({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  const papers = paperRecords.filter(p => `${p.title} ${p.authors} ${p.venue} ${p.tags}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="focus-layout"><div className="resource-head"><div><span className="section-kicker"><BookOpen size={12} /> OPEN RESEARCH PAPER SHELF</span><h2>{papers.length} bundled papers</h2><p>Open-access PDFs are copied into the demo so reading and downloading stay inside CaPS.</p></div><div className="resource-filters"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search papers, authors, methods" /><span>LOCAL PDF</span><span>DOWNLOADABLE</span></div></div><div className="paper-shelf">{papers.map((paper, i) => <article className="paper-card" key={paper.file}><div className="paper-index">P-{String(i + 1).padStart(2, "0")}</div><div className="paper-icon"><FileText size={22} /></div><div className="paper-copy"><span className="section-kicker">{paper.year} · {paper.venue}</span><h3>{paper.title}</h3><p>{paper.authors}</p><small>{paper.tags}</small></div><a className="download-link" href={paper.file} download><Download size={13} /> DOWNLOAD PDF</a></article>)}</div>{papers.length === 0 && <div className="panel empty-state">No bundled paper matches this query.</div>}</div>;
}

function FinderPanel({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  const records = [...paperRecords.map(p => ({ kind: "PAPER", title: p.title, meta: `${p.authors} · ${p.year}`, href: "/papers", action: "OPEN SHELF" })), ...["Artificial intelligence / visual primer", "Neural network activation field", "Network morphology / microscopy"].map((title, i) => ({ kind: "VIDEO", title, meta: "Bundled WebM · direct playback", href: "/ml", action: "OPEN VIDEO" })), ...["Whole-slide pathology", "ML research laboratory", "Compute infrastructure", "Tissue morphology atlas"].map(title => ({ kind: "IMAGE", title, meta: "Bundled JPG · local asset", href: "/atlas", action: "OPEN ATLAS" }))];
  const results = records.filter(r => `${r.kind} ${r.title} ${r.meta}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="focus-layout"><div className="resource-head"><div><span className="section-kicker"><ScanSearch size={12} /> LOCAL RESEARCH FINDER</span><h2>{results.length} indexed results</h2><p>Search across the bundled videos, scientific images, and paper shelf without leaving the workstation.</p></div><div className="resource-filters"><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a method, resource, or topic" /><span>NO EXTERNAL LINKS</span></div></div><div className="finder-list">{results.map((record, i) => <div className="finder-row" key={`${record.kind}-${record.title}`}><span className={`finder-kind ${record.kind.toLowerCase()}`}>{record.kind}</span><div><b>{record.title}</b><small>{record.meta}</small></div><Link href={record.href}>{record.action} <ArrowUpRight size={12} /></Link></div>)}</div></div>;
}
'''
p.write_text(s)

app = Path('client/src/App.tsx')
a = app.read_text()
a = a.replace('<Route path="/sources" component={() => <WorkbenchPage focus="research" />} />', '<Route path="/sources" component={() => <WorkbenchPage focus="research" />} />\n  <Route path="/papers" component={() => <WorkbenchPage focus="papers" />} />\n  <Route path="/finder" component={() => <WorkbenchPage focus="finder" />} />')
app.write_text(a)

css = Path('client/src/index.css')
c = css.read_text()
c += r'''
.paper-shelf{display:grid;gap:10px}.paper-card{display:grid;grid-template-columns:46px 42px 1fr auto;gap:14px;align-items:center;border:1px solid var(--line);background:var(--panel);padding:16px}.paper-index{font:10px var(--mono);color:var(--faint)}.paper-icon{width:38px;height:46px;display:grid;place-items:center;border:1px solid #315f68;color:var(--teal);background:#10262d}.paper-copy h3{font-size:15px;margin:5px 0}.paper-copy p{margin:0;color:var(--muted)}.paper-copy small{display:block;color:var(--faint);font:9px var(--mono);margin-top:7px}.download-link{display:flex;align-items:center;gap:6px;border:1px solid var(--teal);color:var(--teal);padding:8px 10px;font:9px var(--mono);white-space:nowrap}.download-link:hover{background:#12342f}.finder-list{border-top:1px solid var(--line)}.finder-row{display:grid;grid-template-columns:80px 1fr auto;gap:16px;align-items:center;padding:14px 16px;border:1px solid var(--line);border-top:0;background:var(--panel)}.finder-row b,.finder-row small{display:block}.finder-row small{color:var(--muted);margin-top:3px}.finder-row a{display:flex;align-items:center;gap:5px;color:var(--teal);font:9px var(--mono)}.finder-kind{font:9px var(--mono);padding:5px 7px;border:1px solid var(--line2);text-align:center}.finder-kind.paper{color:var(--amber)}.finder-kind.video{color:var(--blue)}.finder-kind.image{color:var(--purple)}.empty-state{padding:30px;text-align:center;color:var(--muted)}
@media (max-width:800px){.paper-card{grid-template-columns:32px 38px 1fr}.paper-card .download-link{grid-column:3;justify-self:start}.finder-row{grid-template-columns:66px 1fr}.finder-row a{grid-column:2}.resource-head{align-items:flex-start;flex-direction:column}.site-tabs{overflow:auto}.workbench-rail{width:150px;flex-basis:150px}}
'''
css.write_text(c)
