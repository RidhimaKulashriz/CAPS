import { useMemo, useState } from "react";
import { Play, Search, Video } from "lucide-react";
import { toast } from "sonner";
import { videoResources } from "@/lib/resources";
import { Breadcrumb } from "@/components/SiteLayout";

const clips = [
  { title: "Artificial intelligence explained", source: "Wikimedia Commons · bundled clip", src: "/research/videos/ai-explained.webm", duration: "2:23", category: "AI foundations" },
  { title: "Infinitely wide neural network", source: "Wikimedia Commons · bundled clip", src: "/research/videos/neural-network.webm", duration: "0:08", category: "Neural networks" },
  { title: "Axonal nerve fibers in a brain", source: "Wikimedia Commons · bundled clip", src: "/research/videos/axonal-network.webm", duration: "0:14", category: "Biological networks" },
];
function Tag({ children }: { children: React.ReactNode }) { return <span className="tag">{children}</span>; }
export default function MLLibraryPage() {
  const [selected, setSelected] = useState(clips[0]);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => videoResources.filter(x => x.title.toLowerCase().includes(search.toLowerCase())), [search]);
  return <main className="page-shell">
    <Breadcrumb current="ML library" />
    <div className="page-heading"><div><div className="eyebrow">KNOWLEDGE LIBRARY</div><h1>ML library</h1><p>Short, real ML and scientific-network clips bundled for direct playback inside CaPS.</p></div><b className="big-count">3<small>local clips</small></b></div>
    <div className="video-grid"><div className="video-box local-video"><video key={selected.src} src={selected.src} controls playsInline preload="metadata" /><div className="video-meta"><Tag>{selected.category}</Tag><h2>{selected.title}</h2><p>{selected.source} · {selected.duration}</p><span className="local-badge"><Video size={12} /> Plays inside CaPS · no redirect</span></div></div><div className="video-list"><div className="eyebrow">BUNDLED CLIPS</div>{clips.map(item => <button className={item.src === selected.src ? "video-item active" : "video-item"} key={item.src} onClick={() => setSelected(item)}><span><Play size={11} /></span><div><b>{item.title}</b><small>{item.source} · {item.duration}</small></div></button>)}</div></div>
    <label className="search"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all ML resources" /></label>
    <div className="resource-rows">{filtered.slice(0, 30).map((item, i) => <button key={`${item.title}-${i}`} onClick={() => toast("This is an internal catalog entry. The three short local clips above are available for direct playback.")}><span>{String(i + 1).padStart(3, "0")}</span><b>{item.title}</b><small>{item.category} · internal catalog resource</small></button>)}</div>
  </main>;
}
