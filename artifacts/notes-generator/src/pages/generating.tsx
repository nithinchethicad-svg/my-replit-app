import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "wouter";
import { useGenerateNotes } from "@workspace/api-client-react";
import { Loader2, Clock, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { debugLog } from "@/lib/debug";
import { Button } from "@/components/ui/button";

const MAX_RETRIES = 8;

type Phase = "generating" | "rate-limited" | "failed";

export default function Generating() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const generateMutation = useGenerateNotes();
  const hasTriggered = useRef(false);
  const retryTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [phase, setPhase] = useState<Phase>("generating");
  const [retryAttempt, setRetryAttempt] = useState(0);
  const [countdown, setCountdown] = useState(0);

  const clearRetryTimer = () => {
    if (retryTimerRef.current) {
      clearInterval(retryTimerRef.current);
      retryTimerRef.current = null;
    }
  };

  const triggerGenerate = useCallback((attempt: number) => {
    if (!sessionId) return;
    setPhase("generating");
    debugLog.info(`Generation attempt ${attempt + 1}/${MAX_RETRIES} for session ${sessionId}`);

    generateMutation.mutate({ sessionId }, {
      onSuccess: () => {
        debugLog.success("Notes generated successfully — navigating to view");
        clearRetryTimer();
        setLocation(`/view/${sessionId}`);
      },
      onError: (err) => {
        // Detect 503 rate-limit response
        const apiErr = err as { status?: number; data?: { error?: string; retryAfterSecs?: number; message?: string } };
        const isRateLimited = apiErr?.status === 503 && apiErr?.data?.error === "rate_limited";

        if (isRateLimited && attempt < MAX_RETRIES - 1) {
          const waitSecs = apiErr.data?.retryAfterSecs ?? 60;
          debugLog.warn(
            `Rate limited (attempt ${attempt + 1}/${MAX_RETRIES}) — retrying in ${waitSecs}s`,
            apiErr.data?.message
          );
          setPhase("rate-limited");
          setCountdown(waitSecs);
          setRetryAttempt(attempt + 1);

          // Live countdown
          clearRetryTimer();
          let remaining = waitSecs;
          retryTimerRef.current = setInterval(() => {
            remaining -= 1;
            setCountdown(remaining);
            if (remaining <= 0) {
              clearRetryTimer();
              triggerGenerate(attempt + 1);
            }
          }, 1000);
        } else {
          const msg = err instanceof Error ? err.message : String(err);
          debugLog.error(`Generation failed after ${attempt + 1} attempt(s)`, msg);
          clearRetryTimer();
          setPhase("failed");
          toast({
            title: "Generation failed",
            description: isRateLimited
              ? "The AI service is currently overloaded. Please try again in a few minutes."
              : "Something went wrong while crafting your document.",
            variant: "destructive",
          });
        }
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, setLocation, toast]);

  useEffect(() => {
    if (!sessionId || hasTriggered.current) return;
    hasTriggered.current = true;
    triggerGenerate(0);
    return clearRetryTimer;
  }, [sessionId, triggerGenerate]);

  // ── Generating UI ──────────────────────────────────────────────────────────
  if (phase === "generating") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse" />
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-serif text-foreground">Crafting Your Document</h2>
            <p className="text-muted-foreground text-lg">
              {retryAttempt > 0
                ? `Retry attempt ${retryAttempt + 1} of ${MAX_RETRIES} — almost there…`
                : "Our editor is reviewing your notes, structuring the content, and formatting the final piece. This usually takes about 30 seconds."}
            </p>
          </div>
          <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary animate-[pulse_2s_ease-in-out_infinite] rounded-full w-full opacity-80" />
          </div>
        </div>
      </div>
    );
  }

  // ── Rate-limited / countdown UI ────────────────────────────────────────────
  if (phase === "rate-limited") {
    const pct = Math.max(0, Math.min(100, (countdown / 60) * 100));
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="4" className="text-muted" />
              <circle
                cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="4"
                className="text-amber-500 transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 44}`}
                strokeDashoffset={`${2 * Math.PI * 44 * (1 - pct / 100)}`}
                strokeLinecap="round"
              />
            </svg>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-serif text-foreground">AI Service Busy</h2>
            <p className="text-muted-foreground">
              The AI is handling too many requests right now. Auto-retrying in{" "}
              <span className="font-semibold text-amber-500 tabular-nums">{countdown}s</span>…
            </p>
            <p className="text-xs text-muted-foreground">
              Attempt {retryAttempt} of {MAX_RETRIES} — your document will be ready soon.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => {
              clearRetryTimer();
              triggerGenerate(retryAttempt);
            }}
          >
            <RefreshCw className="w-3.5 h-3.5" /> Retry now
          </Button>
        </div>
      </div>
    );
  }

  // ── Failed UI ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-destructive/10 flex items-center justify-center">
          <span className="text-4xl">⚠️</span>
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-serif text-foreground">Generation Failed</h2>
          <p className="text-muted-foreground">
            Something went wrong. You can try generating again or go back and adjust your settings.
          </p>
        </div>
        <div className="flex gap-3 justify-center">
          <Button
            variant="outline"
            onClick={() => setLocation(`/questionnaire/${sessionId}`)}
          >
            Back to questionnaire
          </Button>
          <Button
            onClick={() => {
              hasTriggered.current = false;
              setPhase("generating");
              setRetryAttempt(0);
              triggerGenerate(0);
            }}
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Try again
          </Button>
        </div>
      </div>
    </div>
  );
}
