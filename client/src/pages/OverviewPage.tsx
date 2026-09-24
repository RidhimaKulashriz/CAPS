import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Breadcrumb } from "@/components/SiteLayout";

const photos = { lab: "/research/ml-lab.jpg", server: "/research/server-room.jpg", slide: "/research/whole-slide.jpg" };

function Tag({ children, green = false }: { children: React.ReactNode; green?: boolean }) {
  return <span className={green ? "tag green" : "tag"}>{children}</span>;
}

export default function OverviewPage() {
  const cases = trpc.cases.list.useQuery();
  const requestTile = trpc.tiles.request.useMutation({
    onSuccess: d => toast.success(`Tile ${d.tileId} rendered · ${d.bytesReceived.toLocaleString()} bytes`),
    onError: e => toast.error(e.message),
  });
  const lead = cases.data?.[0];
  const caseId = lead?.caseId ?? "CASE-042";

  return (
    <>
      <Breadcrumb current="Overview" />
      <main>
        <section className="intro">
          <div className="intro-inner">
            <div className="intro-copy">
              <div className="eyebrow">COMPUTATIONAL PATHOLOGY</div>
              <h1>A clearer way to<br /><em>review the slide.</em></h1>
              <p>CaPS is a research workspace for exploring whole-slide images through their semantic structure before requesting raw pixels.</p>
              <div className="intro-actions">
                <Link className="button dark" href="/cases">Explore cases <ArrowUpRight size={14} /></Link>
                <Link className="button light" href="/sources">How it works</Link>
              </div>
              <div className="quiet-note"><Check size={14} /> Public demo data · no clinical claims</div>
            </div>
            <div className="intro-image"><img src={photos.lab} alt="Machine learning researcher working in a laboratory" /><div className="image-credit">Research laboratory / source image</div></div>
          </div>
        </section>

        <section className="trust-bar">
          <div><b>2.84 GB</b><span>raw slide sample</span></div>
          <div><b>1.82 MB</b><span>evidence capsule</span></div>
          <div><b>2,980</b><span>semantic patches</span></div>
          <div><b>124</b><span>ML resources</span></div>
        </section>

        <section className="section paper">
          <div className="section-head"><div><div className="eyebrow">CURRENT STUDY</div><h2>Semantic slide review</h2></div><Tag green>Ready for review</Tag></div>
          <div className="case-feature">
            <div className="case-photo"><img src={photos.slide} alt="Whole-slide pathology scan" /><span>WSI-HE-0007 / public reference</span></div>
            <div className="case-copy">
              <div className="case-top"><div><small>CASE</small><h3>{caseId}</h3></div><Tag>Demo replay</Tag></div>
              <p>Explore a whole-slide image through a compact evidence layer. Semantic metadata travels first; raw tile retrieval remains bounded and deliberate.</p>
              <div className="facts"><div><b>{lead?.patchCount?.toLocaleString() ?? "2,980"}</b><span>patches</span></div><div><b>32</b><span>prototypes</span></div><div><b>182 ms</b><span>tile request</span></div></div>
              <div className="case-actions"><Link className="button dark" href={`/cases/${caseId}`}>Open case <ArrowUpRight size={14} /></Link><button className="text-button" onClick={() => requestTile.mutate({ caseId, tileId: "tile-042", x: 3842, y: 2991, width: 224, height: 224, level: 0 })}>Request demo tile</button></div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section-head"><div><div className="eyebrow">THE APPROACH</div><h2>Meaning before pixels</h2></div><p className="section-description">A simple, inspectable sequence for bandwidth-aware pathology review.</p></div>
          <div className="approach-grid">
            {[["01", "Ingest", "Read slide metadata and define the coordinate system."], ["02", "Encode", "Generate or load patch embeddings."], ["03", "Summarize", "Assign patches to morphology prototypes."], ["04", "Retrieve", "Request a raw tile after selection."]].map(([n, title, text]) => <article key={n}><span>{n}</span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="section research-band">
          <div className="research-copy"><div className="eyebrow">RESEARCH LIBRARY</div><h2>Study the systems<br /><em>behind the work.</em></h2><p>Browse technical lectures, real source imagery, and method references used to shape the CaPS prototype.</p><div><Link className="text-button" href="/ml">Browse ML library <ArrowUpRight size={14} /></Link><Link className="text-button" href="/atlas">View image atlas <ArrowUpRight size={14} /></Link></div></div>
          <img src={photos.server} alt="Data center server room" />
        </section>
      </main>
    </>
  );
}
