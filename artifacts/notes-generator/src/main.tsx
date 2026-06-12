import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { installFetchInterceptor } from "./lib/debug";

installFetchInterceptor();

createRoot(document.getElementById("root")!).render(<App />);
