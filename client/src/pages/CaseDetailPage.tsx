import { ArrowLeft, ArrowUpRight, Check, Download, Grid2X2, MapPin } from "lucide-react";
import { Link, useRoute } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Breadcrumb } from "@/components/SiteLayout";

const slide = "/research/whole-slide.jpg";
function Tag({ children }: { children: React.ReactNode }) { return <span className="tag green">{children}</span>; }

export default function CaseDetailPage() {
  const [, params] = useRoute("/cases/:caseId");
  const q = trpc.cases.list.useQuery();
  const requestTile = trpc.tiles.request.useMutation({ onSuccess: d => toast.success(`Tile ${d.tileId} rendered · ${d.bytesReceived.toLocaleString()} bytes`), onError: e => toast.error(e.message) });
  const item = q.data?.find(row => row.caseId === params?.caseId) ?? q.data?.[0];
  const caseId = item?.caseId ?? params?.caseId ?? "CASE-042";
  if (q.isLoading) return <main className="page-shell"><div className="empty">Loading case workspace…</div></main>;
  if (q.error || !item) return <main className="page-shell"><div className="empty">Case not found. <Link href="/cases">Return to cases</Link></div></main>;
  return <main className="page-shell">
    <Breadcrumb current={caseId} />
    <div className="detail-back"><Link href="/cases"><ArrowLeft size={14} /> All cases</Link><Tag>{item.status}</Tag></div>
    <div className="detail-heading"><div><div className="eyebrow">SEMANTIC CASE WORKSPACE</div><h1>{caseId}</h1><p>{item.slideId} · {item.source}</p></div><div className="detail-heading-actions"><button className="button light" onClick={() => toast("Demo export prepared")}> <Download size={14} /> Export metadata</button><button className="button dark" onClick={() => requestTile.mutate({ caseId, tileId: "tile-042", x: 3842, y: 2991, width: 224, height: 224, level: 0 })}>Request tile <ArrowUpRight size={14} /></button></div></div>
    <div className="viewer-layout"><section className="viewer-card"><div className="viewer-toolbar"><span><Grid2X2 size={14} /> Semantic view</span><span>LEVEL 0 · 1:1</span><span>HE / RGB</span></div><div className="viewer-image"><img src={slide} alt="Whole-slide pathology case" /><span className="region region-a"><MapPin size={13} /> Region A</span><span className="region region-b"><MapPin size={13} /> Region B</span></div><div className="viewer-footer"><span><Check size={14} /> Capsule loaded</span><span>2,980 patches · 32 prototypes</span></div></section><aside className="inspector"><div className="eyebrow">CASE METADATA</div><h2>Evidence capsule</h2><p>Semantic structure is available before raw pixel retrieval.</p><dl><div><dt>Source slide</dt><dd>{item.slideId}</dd></div><div><dt>Raw WSI</dt><dd>{item.rawWsiSize}</dd></div><div><dt>Capsule</dt><dd>{item.capsuleSize}</dd></div><div><dt>Patch count</dt><dd>{item.patchCount.toLocaleString()}</dd></div><div><dt>Last updated</dt><dd>{item.updatedAt.toLocaleDateString()}</dd></div></dl><button className="button dark full" onClick={() => requestTile.mutate({ caseId, tileId: "tile-042", x: 3842, y: 2991, width: 224, height: 224, level: 0 })}>Request selected region</button><div className="inspector-note"><Check size={14} /> Demo replay values, not a diagnostic result.</div></aside></div>
    <section className="detail-lower"><div><div className="eyebrow">REGIONS</div><h2>Semantic neighborhoods</h2><p>Prototype region labels are presented for inspection only. Select a region to request a bounded tile from the source slide.</p></div><div className="region-list"><button onClick={() => toast("Region A selected")}>A <b>Glandular structure</b><span>0.82 confidence</span></button><button onClick={() => toast("Region B selected")}>B <b>Stromal context</b><span>0.76 confidence</span></button><button onClick={() => toast("Region C selected")}>C <b>Background / edge</b><span>0.69 confidence</span></button></div></section>
  </main>;
}
