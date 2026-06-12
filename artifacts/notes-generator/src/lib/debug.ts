export type LogLevel = "info" | "success" | "warn" | "error";

export interface LogEntry {
  id: number;
  ts: number;
  level: LogLevel;
  message: string;
  detail?: string;
}

type Listener = (entries: LogEntry[]) => void;

let counter = 0;
let entries: LogEntry[] = [];
const listeners = new Set<Listener>();

function notify() {
  for (const l of listeners) l([...entries]);
}

export const debugLog = {
  add(level: LogLevel, message: string, detail?: string) {
    const entry: LogEntry = { id: counter++, ts: Date.now(), level, message, detail };
    entries = [entry, ...entries].slice(0, 200);
    notify();
    return entry;
  },
  info: (msg: string, detail?: string) => debugLog.add("info", msg, detail),
  success: (msg: string, detail?: string) => debugLog.add("success", msg, detail),
  warn: (msg: string, detail?: string) => debugLog.add("warn", msg, detail),
  error: (msg: string, detail?: string) => debugLog.add("error", msg, detail),
  clear() { entries = []; notify(); },
  subscribe(fn: Listener) {
    listeners.add(fn);
    fn([...entries]);
    return () => listeners.delete(fn);
  },
};

export function installFetchInterceptor() {
  const originalFetch = window.fetch.bind(window);
  window.fetch = async (input, init) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : (input as Request).url;
    const method = init?.method ?? (input instanceof Request ? input.method : "GET");
    const shortUrl = url.replace(window.location.origin, "").replace(/^\/api/, "/api");
    const t0 = Date.now();
    debugLog.info(`→ ${method} ${shortUrl}`);
    try {
      const res = await originalFetch(input, init);
      const ms = Date.now() - t0;
      const level: LogLevel = res.ok ? "success" : "error";
      debugLog.add(level, `← ${res.status} ${shortUrl} (${ms}ms)`);
      return res;
    } catch (err) {
      const ms = Date.now() - t0;
      debugLog.error(`✗ ${method} ${shortUrl} (${ms}ms)`, String(err));
      throw err;
    }
  };
}
