import React, { useEffect, useRef, useState } from "react";
import { debugLog, LogEntry, LogLevel } from "@/lib/debug";
import { X, Minus, Terminal, Trash2, GripHorizontal } from "lucide-react";

const LEVEL_STYLES: Record<LogLevel, string> = {
  info:    "text-blue-400",
  success: "text-green-400",
  warn:    "text-yellow-400",
  error:   "text-red-400",
};

const LEVEL_PREFIX: Record<LogLevel, string> = {
  info:    "INF",
  success: "OK ",
  warn:    "WRN",
  error:   "ERR",
};

function fmt(ts: number) {
  const d = new Date(ts);
  return d.toTimeString().slice(0, 8) + "." + String(d.getMilliseconds()).padStart(3, "0");
}

export default function DebugPanel() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [visible, setVisible] = useState(true);
  const [minimised, setMinimised] = useState(false);
  const [pos, setPos] = useState({ x: 16, y: 16 });
  const [expanded, setExpanded] = useState<number | null>(null);

  const dragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => debugLog.subscribe(setEntries), []);

  const onPointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("[data-no-drag]")) return;
    dragging.current = true;
    dragOffset.current = {
      x: e.clientX - pos.x,
      y: e.clientY - pos.y,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    setPos({
      x: Math.max(0, e.clientX - dragOffset.current.x),
      y: Math.max(0, e.clientY - dragOffset.current.y),
    });
  };

  const onPointerUp = () => { dragging.current = false; };

  if (!visible) {
    return (
      <button
        onClick={() => setVisible(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-zinc-900 border border-zinc-700 text-zinc-300 rounded-full p-2 shadow-lg hover:bg-zinc-800 transition-colors"
        title="Open debug panel"
      >
        <Terminal className="w-4 h-4" />
      </button>
    );
  }

  const errorCount = entries.filter(e => e.level === "error").length;

  return (
    <div
      ref={panelRef}
      className="fixed z-[9999] select-none"
      style={{ left: pos.x, top: pos.y, width: minimised ? 220 : 440 }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      <div className="bg-zinc-950 border border-zinc-700 rounded-lg shadow-2xl overflow-hidden font-mono text-xs">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border-b border-zinc-700 cursor-grab active:cursor-grabbing">
          <GripHorizontal className="w-3 h-3 text-zinc-600 shrink-0" />
          <Terminal className="w-3 h-3 text-zinc-400 shrink-0" />
          <span className="text-zinc-300 font-semibold text-xs flex-1 truncate">Debug Panel</span>
          {errorCount > 0 && (
            <span className="bg-red-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
              {errorCount} ERR
            </span>
          )}
          <div className="flex items-center gap-1 ml-1" data-no-drag="">
            <button
              onClick={() => debugLog.clear()}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Clear logs"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => setMinimised(m => !m)}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title={minimised ? "Expand" : "Minimise"}
            >
              <Minus className="w-3 h-3" />
            </button>
            <button
              onClick={() => setVisible(false)}
              className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
              title="Hide"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Log body */}
        {!minimised && (
          <div className="h-72 overflow-y-auto p-2 space-y-0.5 bg-zinc-950" data-no-drag="">
            {entries.length === 0 && (
              <p className="text-zinc-600 text-center py-8">No activity yet…</p>
            )}
            {entries.map(e => (
              <div
                key={e.id}
                className="rounded px-1.5 py-0.5 hover:bg-zinc-900 cursor-pointer transition-colors"
                onClick={() => setExpanded(prev => prev === e.id ? null : e.id)}
              >
                <div className="flex items-start gap-2">
                  <span className="text-zinc-600 shrink-0 mt-px">{fmt(e.ts)}</span>
                  <span className={`font-bold shrink-0 mt-px ${LEVEL_STYLES[e.level]}`}>
                    {LEVEL_PREFIX[e.level]}
                  </span>
                  <span className={`break-all leading-tight ${LEVEL_STYLES[e.level]}`}>
                    {e.message}
                  </span>
                </div>
                {expanded === e.id && e.detail && (
                  <div className="mt-1 ml-20 text-zinc-400 whitespace-pre-wrap break-all bg-zinc-900 rounded p-2">
                    {e.detail}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
