import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { Breadcrumb } from "@/components/SiteLayout";

function Tag({ children, green = false }: { children: React.ReactNode; green?: boolean }) { return <span className={green ? "tag green" : "tag"}>{children}</span>; }

export default function CasesPage() {
  const q = trpc.cases.list.useQuery();
  const data = q.data ?? [];
  return <main className="page-shell">
    <Breadcrumb current="Cases" />
    <div className="page-heading"><div><div className="eyebrow">CASE STUDIES</div><h1>Cases</h1><p>Public, de-identified artifacts for semantic pathology review.</p></div><button className="button dark" onClick={() => toast("Slide ingestion is ready for a connected WSI source")}>Ingest slide <ArrowUpRight size={14} /></button></div>
    <div className="simple-table"><div className="table-head"><span>CASE</span><span>SLIDE</span><span>SOURCE</span><span>STATUS</span><span>PAYLOAD</span></div>{q.isLoading ? <div className="empty">Loading cases…</div> : q.error ? <div className="empty">Unable to load case data.</div> : data.map(item => <Link className="table-row" href={`/cases/${item.caseId}`} key={item.caseId}><div><b>{item.caseId}</b><small>{item.updatedAt.toLocaleDateString()}</small></div><span>{item.slideId}</span><span>{item.source}</span><Tag green={item.status === "ready"}>{item.status}</Tag><div><b>{item.capsuleSize}</b><small>{item.patchCount.toLocaleString()} patches</small></div></Link>)}</div>
    <div className="small-note"><Check size={14} /> Values are labeled demo replay data. No patient data or clinical output is present.</div>
  </main>;
}
