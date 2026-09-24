import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteLayout from "./components/SiteLayout";
import WorkbenchPage from "./pages/WorkbenchPage";
import NotFound from "./pages/NotFound";
function Router() { return <Switch>
  <Route path="/" component={() => <WorkbenchPage focus="command" />} />
  <Route path="/cases" component={() => <WorkbenchPage focus="cases" />} />
  <Route path="/cases/:caseId" component={() => <WorkbenchPage focus="cases" />} />
  <Route path="/model" component={() => <WorkbenchPage focus="model" />} />
  <Route path="/prototypes" component={() => <WorkbenchPage focus="prototypes" />} />
  <Route path="/embeddings" component={() => <WorkbenchPage focus="embeddings" />} />
  <Route path="/capsule" component={() => <WorkbenchPage focus="capsule" />} />
  <Route path="/network" component={() => <WorkbenchPage focus="network" />} />
  <Route path="/observability" component={() => <WorkbenchPage focus="observability" />} />
  <Route path="/research" component={() => <WorkbenchPage focus="research" />} />
  <Route path="/ml" component={() => <WorkbenchPage focus="videos" />} />
  <Route path="/atlas" component={() => <WorkbenchPage focus="images" />} />
  <Route path="/sources" component={() => <WorkbenchPage focus="research" />} />
  <Route component={NotFound} />
</Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><SiteLayout><Router /></SiteLayout></TooltipProvider></ThemeProvider></ErrorBoundary>; }
