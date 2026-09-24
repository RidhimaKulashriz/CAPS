import { BookOpen, FileText, Image as ImageIcon, Microscope } from "lucide-react";
import { Link, useLocation } from "wouter";

const links = [
  ["/", "Overview"],
  ["/cases", "Cases"],
  ["/ml", "ML library"],
  ["/atlas", "Image atlas"],
  ["/sources", "Sources"],
] as const;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return (
    <div className="site">
      <header className="site-header">
        <div className="nav-wrap">
          <Link href="/" className="wordmark">
            <span><Microscope size={17} /></span>
            <b>CaPS</b>
            <small>Cancer Pathology Semantic Capsule</small>
          </Link>
          <nav className="main-nav" aria-label="Primary navigation">
            {links.map(([href, label]) => <Link key={href} href={href} className={location === href ? "active" : ""}>{label}</Link>)}
          </nav>
          <div className="header-end"><span className="status-dot" /> Research prototype</div>
        </div>
      </header>
      {children}
      <footer><div><b>CaPS</b> · Cancer Pathology Semantic Capsule</div><span>Research prototype · Public demo data · No PHI</span></footer>
    </div>
  );
}

export function Breadcrumb({ current }: { current: string }) {
  return <div className="breadcrumb-line"><Link href="/">CaPS</Link><span>/</span>{current}</div>;
}

export function SectionIcon({ kind }: { kind: "ml" | "image" | "source" }) {
  const Icon = kind === "ml" ? BookOpen : kind === "image" ? ImageIcon : FileText;
  return <Icon size={16} />;
}
