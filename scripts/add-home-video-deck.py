from pathlib import Path
p=Path('client/src/pages/WorkbenchPage.tsx')
s=p.read_text()
marker='function SpatialViewer('
video_fn=r'''
const homeVideos = [
  { src: "/research/videos/ai-explained-short.webm", title: "Artificial intelligence / visual primer", kind: "Bundled local video" },
  { src: "/research/videos/neural-network-short.webm", title: "Neural network activation field", kind: "Bundled local video" },
  { src: "/research/videos/axonal-network-short.webm", title: "Network morphology / microscopy", kind: "Bundled local video" },
  { src: "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM2_ESM.mp4", title: "PMC 12307736 · supplementary video 2", kind: "PMC supplementary media" },
  { src: "https://pmc.ncbi.nlm.nih.gov/articles/instance/12307736/bin/41746_2025_1890_MOESM3_ESM.mp4", title: "PMC 12307736 · supplementary video 3", kind: "PMC supplementary media" },
  { src: "https://pmc.ncbi.nlm.nih.gov/articles/instance/10905821/bin/40644_2024_669_MOESM3_ESM.mp4", title: "PMC 10905821 · supplementary video 3", kind: "PMC supplementary media" },
  { src: "https://pmc.ncbi.nlm.nih.gov/articles/instance/10073663/bin/12966_2023_4572_MOESM2_ESM.mp4", title: "PMC 10073663 · supplementary video 2", kind: "PMC supplementary media" },
];

function HomeVideoDeck() {
  const [selectedVideo, setSelectedVideo] = useState(0);
  const video = homeVideos[selectedVideo];
  return <section className="home-video-deck panel"><div className="panel-head"><div><span className="section-kicker"><Play size={12} /> RESEARCH VIDEO LIBRARY</span><h2>Watch research media without leaving CaPS</h2></div><span className="panel-note">{homeVideos.length} playable videos</span></div><div className="home-video-layout"><div className="home-video-player"><video key={video.src} controls playsInline preload="metadata" src={video.src} /><div className="home-video-caption"><b>{video.title}</b><small>{video.kind} · inline playback</small></div></div><div className="home-video-list">{homeVideos.map((item, i) => <button key={item.src} className={selectedVideo === i ? "active" : ""} onClick={() => setSelectedVideo(i)}><span>{String(i + 1).padStart(2, "0")}</span><div><b>{item.title}</b><small>{item.kind}</small></div><Play size={13} /></button>)}</div></div></section>;
}

'''
s=s.replace(marker, video_fn+marker, 1)
old='''        {focus === "model" ? <ModelPanel /> : focus === "capsule" ? <CapsulePanel /> : focus === "network" ? <NetworkPanel /> : focus === "observability" ? <ObservabilityPanel /> : focus === "research" ? <ResearchPanel /> : focus === "videos" ? <VideoPanel query={query} setQuery={setQuery} /> : focus === "images" ? <ImagePanel query={query} setQuery={setQuery} /> : focus === "papers" ? <PapersPanel query={query} setQuery={setQuery} /> : focus === "finder" ? <FinderPanel query={query} setQuery={setQuery} /> : focus === "pmc" ? <PmcPanel query={query} setQuery={setQuery} /> : <>'''
new='''        {focus === "model" ? <ModelPanel /> : focus === "capsule" ? <CapsulePanel /> : focus === "network" ? <NetworkPanel /> : focus === "observability" ? <ObservabilityPanel /> : focus === "research" ? <ResearchPanel /> : focus === "videos" ? <VideoPanel query={query} setQuery={setQuery} /> : focus === "images" ? <ImagePanel query={query} setQuery={setQuery} /> : focus === "papers" ? <PapersPanel query={query} setQuery={setQuery} /> : focus === "finder" ? <FinderPanel query={query} setQuery={setQuery} /> : focus === "pmc" ? <PmcPanel query={query} setQuery={setQuery} /> : <>'''
if old not in s: raise SystemExit('focus branch not found')
s=s.replace(old,new,1)
s=s.replace('''          <div className="metric-strip"><Metric''','''          {focus === "command" && <HomeVideoDeck />}
          <div className="metric-strip"><Metric''',1)
p.write_text(s)

css=Path('client/src/index.css')
c=css.read_text()
c += '\n.home-video-deck{margin-bottom:15px}.home-video-layout{display:grid;grid-template-columns:minmax(0,1fr) 360px;gap:16px;padding:0 16px 16px}.home-video-player{border:1px solid var(--line);background:#f8fafc}.home-video-player video{display:block;width:100%;height:270px;background:#dfe7eb;object-fit:contain}.home-video-caption{display:flex;justify-content:space-between;gap:12px;padding:11px 13px}.home-video-caption b{font-size:12px}.home-video-caption small,.home-video-list small{display:block;color:var(--muted);font:9px var(--mono);margin-top:3px}.home-video-list{border:1px solid var(--line);max-height:334px;overflow:auto}.home-video-list button{display:grid;grid-template-columns:28px 1fr 16px;gap:8px;align-items:center;width:100%;text-align:left;background:#fff;border:0;border-bottom:1px solid var(--line);padding:11px;color:var(--muted)}.home-video-list button:hover,.home-video-list button.active{background:#eaf3f7;color:#174a6a}.home-video-list button>span{font:10px var(--mono);color:var(--faint)}.home-video-list button b{font-size:10px;font-weight:600}.home-video-list button svg{color:#155e75}@media(max-width:900px){.home-video-layout{grid-template-columns:1fr}.home-video-list{max-height:none}.home-video-player video{height:230px}}\n'
css.write_text(c)
