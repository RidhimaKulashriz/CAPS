import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import SiteLayout from "./components/SiteLayout";
import OverviewPage from "./pages/OverviewPage";
import CasesPage from "./pages/CasesPage";
import CaseDetailPage from "./pages/CaseDetailPage";
import MLLibraryPage from "./pages/MLLibraryPage";
import ImageAtlasPage from "./pages/ImageAtlasPage";
import SourcesPage from "./pages/SourcesPage";
import NotFound from "./pages/NotFound";

function Router() {
  return <Switch>
    <Route path="/" component={OverviewPage} />
    <Route path="/cases" component={CasesPage} />
    <Route path="/cases/:caseId" component={CaseDetailPage} />
    <Route path="/ml" component={MLLibraryPage} />
    <Route path="/atlas" component={ImageAtlasPage} />
    <Route path="/sources" component={SourcesPage} />
    <Route component={NotFound} />
  </Switch>;
}

export default function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><SiteLayout><Router /></SiteLayout></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
