import React, { useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { useGenerateNotes } from "@workspace/api-client-react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { debugLog } from "@/lib/debug";

export default function Generating() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const generateMutation = useGenerateNotes();
  const hasTriggered = useRef(false);

  useEffect(() => {
    if (!sessionId || hasTriggered.current) return;
    hasTriggered.current = true;

    debugLog.info(`Starting generation for session ${sessionId}`);

    generateMutation.mutate({ sessionId }, {
      onSuccess: () => {
        debugLog.success("Notes generated successfully — navigating to view");
        setLocation(`/view/${sessionId}`);
      },
      onError: (err) => {
        const msg = err instanceof Error ? err.message : String(err);
        debugLog.error("Generation failed", msg);
        console.error(err);
        toast({
          title: "Generation failed",
          description: "Something went wrong while crafting your document.",
          variant: "destructive"
        });
      }
    });
  }, [sessionId, generateMutation, setLocation, toast]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-pulse"></div>
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-serif text-foreground">Crafting Your Document</h2>
          <p className="text-muted-foreground text-lg">
            Our editor is reviewing your notes, structuring the content, and formatting the final piece. This usually takes about 30 seconds.
          </p>
        </div>

        <div className="w-full max-w-xs mx-auto h-2 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary animate-[pulse_2s_ease-in-out_infinite] rounded-full w-full opacity-80" />
        </div>
      </div>
    </div>
  );
}
