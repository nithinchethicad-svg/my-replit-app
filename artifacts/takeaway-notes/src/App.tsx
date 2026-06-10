import { Switch, Route, Router as WouterRouter } from "wouter";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";

function PrintBar() {
  return (
    <div
      className="no-print"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <button
        onClick={() => window.print()}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "linear-gradient(135deg, #D4622A, #C89B3C)",
          color: "white",
          border: "none",
          borderRadius: 10,
          padding: "13px 22px",
          fontFamily: "Inter, sans-serif",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.04em",
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(212,98,42,0.45), 0 1px 4px rgba(0,0,0,0.18)",
          transition: "transform 0.12s, box-shadow 0.12s",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 7px 24px rgba(212,98,42,0.55), 0 2px 6px rgba(0,0,0,0.18)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 18px rgba(212,98,42,0.45), 0 1px 4px rgba(0,0,0,0.18)";
        }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 15V3m0 12-4-4m4 4 4-4" />
          <path d="M2 17v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2" />
        </svg>
        Download PDF
      </button>
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <Router />
      <PrintBar />
    </WouterRouter>
  );
}

export default App;
