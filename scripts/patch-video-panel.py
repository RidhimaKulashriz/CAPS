from pathlib import Path
path = Path('/home/ubuntu/caps-workstation/client/src/pages/WorkbenchPage.tsx')
text = path.read_text()
start = text.index('function VideoPanel(')
end = text.index('function ImagePanel(', start)
replacement = '''function VideoPanel({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  const clips = [
    { src: "/research/videos/ai-explained-short.webm", title: "Artificial intelligence / visual primer", category: "Machine Learning", duration: "00:20" },
    { src: "/research/videos/neural-network-short.webm", title: "Neural network activation field", category: "Deep Learning", duration: "00:20" },
    { src: "/research/videos/axonal-network-short.webm", title: "Network morphology / microscopy", category: "Scientific Computing", duration: "00:20" },
  ];
  const [selectedClip, setSelectedClip] = useState(0);
  const visibleClips = clips.filter(clip => `${clip.title} ${clip.category}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="focus-layout"><div className="resource-head"><div><span className="section-kicker"><Radio size={12} /> ML RESEARCH VIDEO OBSERVATORY</span><h2>124 indexed resources</h2><p>Three compact source clips are bundled locally for direct playback; the wider catalog stays searchable.</p></div><div className="resource-filters"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search titles, tags, sources" /><span>LOCAL MP4 / WEBM</span><span>NO REDIRECTS</span></div></div><div className="video-observatory"><div className="local-player"><video key={clips[selectedClip].src} controls playsInline preload="metadata" src={clips[selectedClip].src} /><div className="player-meta"><span className="local-badge"><i />SAME-ORIGIN PLAYBACK</span><h3>{clips[selectedClip].title}</h3><p>{clips[selectedClip].category} · {clips[selectedClip].duration} · bundled research artifact</p></div></div><div className="clip-queue"><div className="queue-head"><span className="section-kicker">DIRECT CLIP QUEUE</span><small>3 local assets</small></div>{clips.map((clip, i) => <button key={clip.src} className={selectedClip === i ? "active" : ""} onClick={() => setSelectedClip(i)}><span className="queue-number">{String(i + 1).padStart(2, "0")}</span><span><b>{clip.title}</b><small>{clip.category} · {clip.duration}</small></span><Play size={14} /></button>)}</div></div><div className="resource-grid">{visibleClips.concat(Array.from({ length: Math.max(0, 12 - visibleClips.length) }, (_, i) => ({ title: ["Attention Mechanism", "UNI Foundation Model", "WSI Transformers", "Embedding Spaces", "Digital Pathology AI", "Self-Supervised Learning"][i % 6], category: ["Transformers", "Pathology AI", "Digital Pathology", "Embeddings"][i % 4], duration: `4:${String(12 + i).padStart(2, "0")}` }))).map((clip, i) => <div className="resource-card" key={`${clip.title}-${i}`}><div className="resource-thumb"><span>{String(i + 1).padStart(3, "0")}</span><Play size={18} /></div><b>{clip.title}</b><small>{clip.category} · {clip.duration}</small><button onClick={() => toast("Indexed resource selected; direct local clips play above.")}>OPEN RESOURCE <ArrowUpRight size={11} /></button></div>)}</div></div>;
}
'''
path.write_text(text[:start] + replacement + text[end:])
