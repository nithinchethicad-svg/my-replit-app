import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DebugPanel from "./components/DebugPanel";

import Upload from "./pages/upload";
import Questionnaire from "./pages/questionnaire";
import Generating from "./pages/generating";
import View from "./pages/view";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Upload} />
      <Route path="/questionnaire/:sessionId" component={Questionnaire} />
      <Route path="/generating/:sessionId" component={Generating} />
      <Route path="/view/:sessionId" component={View} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
        <DebugPanel />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
