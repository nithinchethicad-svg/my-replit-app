import React, { useState } from "react";
import { useParams } from "wouter";
import { useGetSession, useEditNotes, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger } from "@/components/ui/drawer";
import { Loader2, Download, Pencil, ImagePlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { NotePage, NoteSection, NoteItem } from "@workspace/api-client-react";

// ── Colour-scheme palette map ─────────────────────────────────────────────────
interface Palette {
  accent: string;
  accentLight: string;
  accentMid: string;
  bg: string;
  text: string;
}

const PALETTES: Record<string, Palette> = {
  "Blue & White": { accent: "#1e40af", accentLight: "#dbeafe", accentMid: "#3b82f6", bg: "#f8faff", text: "#1e293b" },
  "Earth Tones":  { accent: "#92400e", accentLight: "#fef3c7", accentMid: "#d97706", bg: "#fffbeb", text: "#1c1917" },
  "Dark & Bold":  { accent: "#111827", accentLight: "#f3f4f6", accentMid: "#374151", bg: "#f9fafb", text: "#111827" },
  "Soft & Pastel":{ accent: "#7c3aed", accentLight: "#ede9fe", accentMid: "#a78bfa", bg: "#faf5ff", text: "#2e1065" },
  "Green & Gold": { accent: "#065f46", accentLight: "#d1fae5", accentMid: "#d97706", bg: "#f0fdf9", text: "#064e3b" },
  "Monochrome":   { accent: "#374151", accentLight: "#f3f4f6", accentMid: "#6b7280", bg: "#fafafa", text: "#111827" },
};

function getPalette(colorScheme?: string): Palette | null {
  if (!colorScheme) return null;
  for (const [key, palette] of Object.entries(PALETTES)) {
    if (colorScheme.startsWith(key)) return palette;
  }
  return null; // "Similar to PPT" → no override
}

function paletteToVars(p: Palette): React.CSSProperties {
  return {
    "--page-accent": p.accent,
    "--page-accent-light": p.accentLight,
    "--page-accent-mid": p.accentMid,
    "--page-bg": p.bg,
    "--page-text": p.text,
  } as React.CSSProperties;
}

// ── View page ─────────────────────────────────────────────────────────────────

export default function View() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: session, isLoading } = useGetSession(sessionId, {
    query: {
      enabled: !!sessionId,
      queryKey: getGetSessionQueryKey(sessionId)
    }
  });

  const editMutation = useEditNotes();
  const [editInstructions, setEditInstructions] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handlePrint = () => window.print();

  const handleEdit = () => {
    if (!sessionId || !editInstructions.trim()) return;

    editMutation.mutate(
      { sessionId, data: { instructions: editInstructions, uploadedImageUrls: [] } },
      {
        onSuccess: () => {
          toast({ title: "Notes updated", description: "Your document has been revised." });
          setIsDrawerOpen(false);
          setEditInstructions("");
          queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey(sessionId) });
        },
        onError: () => {
          toast({ title: "Revision failed", description: "There was an error updating your document.", variant: "destructive" });
        }
      }
    );
  };

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pages = (session.notes?.pages ?? []) as NotePage[];
  const answers = (session.answers ?? {}) as Record<string, string>;
  const colorScheme = answers.color_scheme as string | undefined;
  const palette = getPalette(colorScheme);
  const paletteVars = palette ? paletteToVars(palette) : {};

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Top Banner */}
      <div className="bg-background border-b border-border sticky top-0 z-10 p-4 no-print shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-serif text-primary">Document Viewer</h1>
        <div className="flex items-center gap-3">
          {colorScheme && (
            <span className="text-xs text-muted-foreground border border-border rounded-full px-3 py-1 font-medium hidden sm:block">
              {colorScheme.split(" — ")[0]}
            </span>
          )}
          <span className="text-sm text-muted-foreground">{pages.length} Pages</span>
        </div>
      </div>

      {/* Document Canvas */}
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12" style={paletteVars}>
        {pages.map((page, i) => (
          <PageCard key={page.id ?? i} page={page} index={i + 1} hasPalette={!!palette} />
        ))}
      </div>

      {/* Floating Actions */}
      <div className="fixed bottom-8 left-8 right-8 flex justify-between items-center no-print pointer-events-none">
        <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
          <DrawerTrigger asChild>
            <Button size="lg" variant="secondary" className="pointer-events-auto rounded-full shadow-lg border border-border h-14 px-6 gap-2">
              <Pencil className="w-5 h-5" />
              Edit Notes
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <div className="mx-auto w-full max-w-2xl">
              <DrawerHeader>
                <DrawerTitle className="text-2xl font-serif">Revise Document</DrawerTitle>
                <DrawerDescription>Tell the editor what to change. Be as specific as possible.</DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0 space-y-4">
                <Textarea
                  placeholder="e.g. Make the introduction shorter, use a more professional tone, remove the last section…"
                  className="min-h-[150px] text-base"
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                />
                <Button variant="outline" size="sm" className="gap-2" type="button">
                  <ImagePlus className="w-4 h-4" />
                  Attach Image
                </Button>
              </div>
              <DrawerFooter className="flex-row justify-end space-x-2 pt-6">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                <Button onClick={handleEdit} disabled={!editInstructions.trim() || editMutation.isPending} className="px-8">
                  {editMutation.isPending ? "Revising…" : "Submit Revision"}
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>

        <Button size="lg" className="pointer-events-auto rounded-full shadow-lg h-14 px-8 gap-2 text-base font-medium" onClick={handlePrint}>
          <Download className="w-5 h-5" />
          Download PDF
        </Button>
      </div>
    </div>
  );
}

// ── Page Card ─────────────────────────────────────────────────────────────────

function PageCard({ page, index, hasPalette }: { page: NotePage; index: number; hasPalette: boolean }) {
  const accent     = hasPalette ? "var(--page-accent)"       : "hsl(var(--primary))";
  const accentLight= hasPalette ? "var(--page-accent-light)" : "hsl(var(--primary) / 0.08)";
  const accentMid  = hasPalette ? "var(--page-accent-mid)"   : "hsl(var(--primary) / 0.4)";
  const pageBg     = hasPalette ? "var(--page-bg)"           : "#ffffff";
  const pageText   = hasPalette ? "var(--page-text)"         : "hsl(var(--foreground))";

  return (
    <div
      className="shadow-lg border mx-auto aspect-[1/1.414] w-full max-w-[800px] overflow-hidden relative print-page p-12 sm:p-16 flex flex-col font-sans"
      style={{ background: pageBg, color: pageText, borderColor: `${accent}22` }}
    >
      {/* Cover Page */}
      {page.type === "cover" && (
        <div className="flex-1 flex flex-col justify-center text-center space-y-8">
          <div style={{ borderTop: `4px solid ${accent}`, borderLeft: `4px solid ${accent}`, position: "absolute", top: 28, left: 40, width: 48, height: 48 }} />
          <div style={{ borderTop: `4px solid ${accent}`, borderRight: `4px solid ${accent}`, position: "absolute", top: 28, right: 40, width: 48, height: 48 }} />
          <div style={{ borderBottom: `4px solid ${accent}`, borderLeft: `4px solid ${accent}`, position: "absolute", bottom: 40, left: 40, width: 48, height: 48 }} />
          <div style={{ borderBottom: `4px solid ${accent}`, borderRight: `4px solid ${accent}`, position: "absolute", bottom: 40, right: 40, width: 48, height: 48 }} />

          {page.band && (
            <div className="text-xs font-bold tracking-widest uppercase" style={{ color: accentMid }}>{page.band}</div>
          )}
          <div className="space-y-3">
            <h1 className="text-5xl font-serif font-bold leading-tight" style={{ color: accent }}>{page.title}</h1>
            {page.subtitle && <h2 className="text-2xl font-serif opacity-90">{page.subtitle}</h2>}
          </div>
          <div style={{ width: 80, height: 2, background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, margin: "0 auto" }} />
          {(page.eventName || page.eventDate) && (
            <div className="text-base space-y-1" style={{ color: accentMid }}>
              {page.eventName && <div className="font-semibold">{page.eventName}</div>}
              {page.eventDate && <div>{page.eventDate}</div>}
            </div>
          )}
        </div>
      )}

      {/* Content / Section */}
      {(page.type === "content" || page.type === "section") && (
        <div className="flex-1 flex flex-col">
          <div className="mb-8 pb-4" style={{ borderBottom: `2px solid ${accentLight}` }}>
            {page.band && (
              <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: accentMid }}>{page.band}</div>
            )}
            <h2 className="text-3xl font-serif font-semibold" style={{ color: accent }}>{page.title}</h2>
          </div>

          <div className="flex-1 space-y-7">
            {page.sections?.map((section: NoteSection, idx: number) => (
              <div key={idx} className="space-y-3">
                {section.title && (
                  <h3 className="text-lg font-semibold" style={{ color: pageText }}>{section.title}</h3>
                )}
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-3 list-none pl-0">
                    {section.items.map((item: NoteItem, itemIdx: number) => (
                      <li key={itemIdx} className="flex gap-3">
                        <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ background: accent }} />
                        <div>
                          <strong className="block text-sm font-semibold mb-0.5" style={{ color: pageText }}>{item.t}</strong>
                          {item.n && <span className="text-sm leading-relaxed opacity-75">{item.n}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {page.quote && (
              <blockquote
                className="pl-5 py-2 my-6 italic text-lg font-serif"
                style={{ borderLeft: `4px solid ${accentMid}`, color: pageText, opacity: 0.85 }}
              >
                "{page.quote}"
                {page.quoteSource && (
                  <footer className="text-sm font-sans font-medium mt-2 not-italic" style={{ color: accentMid }}>— {page.quoteSource}</footer>
                )}
              </blockquote>
            )}

            {page.imageUrl && (
              <div className="my-6 rounded-lg overflow-hidden border" style={{ borderColor: accentLight }}>
                <img src={page.imageUrl} alt="Illustration" className="w-full h-auto object-cover max-h-[280px]" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reflection / QA */}
      {(page.type === "reflection" || page.type === "qa") && (
        <div className="flex-1 flex flex-col">
          <div className="mb-8 pb-4" style={{ borderBottom: `2px solid ${accentLight}` }}>
            {page.band && (
              <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: accentMid }}>{page.band}</div>
            )}
            <h2 className="text-3xl font-serif font-semibold" style={{ color: accent }}>{page.title}</h2>
          </div>
          <div className="flex-1 space-y-10 mt-2">
            {page.questions?.map((q: { q: string }, idx: number) => (
              <div key={idx} className="space-y-4">
                <div className="text-base font-medium leading-snug" style={{ color: pageText }}>{q.q}</div>
                <div className="w-full h-px border-dashed" style={{ borderColor: `${accentMid}88`, borderTopWidth: 1 }} />
                <div className="w-full h-px border-dashed" style={{ borderColor: `${accentMid}88`, borderTopWidth: 1 }} />
                <div className="w-full h-px border-dashed" style={{ borderColor: `${accentMid}88`, borderTopWidth: 1 }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page footer */}
      <div className="mt-8 pt-3 flex justify-between text-xs font-semibold uppercase tracking-wider" style={{ borderTop: `1px solid ${accentLight}`, color: accentMid }}>
        <span>{page.band ?? "Takeaway Notes"}</span>
        <span>Page {index}</span>
      </div>
    </div>
  );
}
