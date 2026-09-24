import { useMemo, useState } from "react";
import { Play, Search, Video } from "lucide-react";
import { toast } from "sonner";
import { videoResources } from "@/lib/resources";
import { Breadcrumb } from "@/components/SiteLayout";

const clips = [
  { title: "Cancer biology · cells sending abnormal signals", source: "Cancer Research UK · Wikimedia Commons", src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/When_cells_cause_cancer_by_giving_the_wrong_messages.webm", duration: "1:03", category: "Cancer mechanisms" },
  { title: "Pancreatic cancer · tumor biology", source: "Cancer Research UK · Wikimedia Commons", src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/10_Things_You_Didn%27t_Know_About_Pancreatic_Cancer.webm", duration: "1:56", category: "Pancreatic cancer" },
  { title: "Cancer overview · disease mechanisms", source: "Wikimedia Commons", src: "https://commons.wikimedia.org/wiki/Special:Redirect/file/En.Video-Cancer.webm", duration: "4:01", category: "Cancer biology" },
];
function Tag({ children }: { children: React.ReactNode }) { return <span className="tag">{children}</span>; }
export default function MLLibraryPage() {
  const [selected, setSelected] = useState(clips[0]);
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => videoResources.filter(x => x.title.toLowerCase().includes(search.toLowerCase())), [search]);
  return <main className="page-shell">
    <Breadcrumb current="ML library" />
    <div className="page-heading"><div><div className="eyebrow">KNOWLEDGE LIBRARY</div><h1>ML library</h1><p>Short, real ML and scientific-network clips selected for direct cancer-focused playback inside CaPS.</p></div><b className="big-count">3<small>cancer clips</small></b></div>
    <div className="video-grid"><div className="video-box local-video"><video key={selected.src} src={selected.src} controls playsInline preload="metadata" /><div className="video-meta"><Tag>{selected.category}</Tag><h2>{selected.title}</h2><p>{selected.source} · {selected.duration}</p><span className="local-badge"><Video size={12} /> Direct WEBM playback · cancer research</span></div></div><div className="video-list"><div className="eyebrow">CANCER CLIPS</div>{clips.map(item => <button className={item.src === selected.src ? "video-item active" : "video-item"} key={item.src} onClick={() => setSelected(item)}><span><Play size={11} /></span><div><b>{item.title}</b><small>{item.source} · {item.duration}</small></div></button>)}</div></div>
    <label className="search"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search all ML resources" /></label>
    <div className="resource-rows">{filtered.slice(0, 30).map((item, i) => <button key={`${item.title}-${i}`} onClick={() => toast("This is an internal catalog entry. The three short local clips above are available for direct playback.")}><span>{String(i + 1).padStart(3, "0")}</span><b>{item.title}</b><small>{item.category} · internal catalog resource</small></button>)}</div>
  </main>;
}
