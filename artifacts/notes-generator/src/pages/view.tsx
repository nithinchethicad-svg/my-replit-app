import React, { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useGetSession, useEditNotes, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerTrigger } from "@/components/ui/drawer";
import { Loader2, Download, Pencil, ImagePlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { NotePage, NoteSection, NoteItem } from "@workspace/api-client-react";

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

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    if (!sessionId || !editInstructions.trim()) return;
    
    editMutation.mutate({
      sessionId,
      data: {
        instructions: editInstructions,
        uploadedImageUrls: [] // Optional extension for image attachments
      }
    }, {
      onSuccess: () => {
        toast({
          title: "Notes updated",
          description: "Your document has been revised successfully."
        });
        setIsDrawerOpen(false);
        setEditInstructions("");
        // Invalidate session to refetch notes
        queryClient.invalidateQueries({ queryKey: getGetSessionQueryKey(sessionId) });
      },
      onError: () => {
        toast({
          title: "Revision failed",
          description: "There was an error updating your document.",
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const pages = session.notes?.pages as NotePage[] || [];

  return (
    <div className="min-h-screen bg-muted/30 pb-24">
      {/* Top Banner (No Print) */}
      <div className="bg-background border-b border-border sticky top-0 z-10 p-4 no-print shadow-sm flex items-center justify-between">
        <h1 className="text-xl font-serif text-primary">Document Viewer</h1>
        <div className="text-sm text-muted-foreground">
          {pages.length} Pages
        </div>
      </div>

      {/* Document Canvas */}
      <div className="max-w-4xl mx-auto py-12 px-4 space-y-12">
        {pages.map((page, i) => (
          <PageCard key={page.id || i} page={page} index={i + 1} />
        ))}
      </div>

      {/* Floating Action Buttons (No Print) */}
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
                <DrawerDescription>
                  Tell the editor what you want to change. Be as specific as possible.
                </DrawerDescription>
              </DrawerHeader>
              <div className="p-4 pb-0 space-y-4">
                <Textarea 
                  placeholder="e.g. Make the introduction shorter, use a more professional tone, remove the last section..."
                  className="min-h-[150px] text-base"
                  value={editInstructions}
                  onChange={(e) => setEditInstructions(e.target.value)}
                />
                {/* Visual placeholder for image attachment if needed */}
                <Button variant="outline" size="sm" className="gap-2" type="button">
                  <ImagePlus className="w-4 h-4" />
                  Attach Image
                </Button>
              </div>
              <DrawerFooter className="flex-row justify-end space-x-2 pt-6">
                <Button variant="outline" onClick={() => setIsDrawerOpen(false)}>Cancel</Button>
                <Button 
                  onClick={handleEdit} 
                  disabled={!editInstructions.trim() || editMutation.isPending}
                  className="px-8"
                >
                  {editMutation.isPending ? "Revising..." : "Submit Revision"}
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

function PageCard({ page, index }: { page: NotePage, index: number }) {
  return (
    <div className="bg-white shadow-lg border border-border/50 mx-auto aspect-[1/1.414] w-full max-w-[800px] overflow-hidden relative print-page p-12 sm:p-16 flex flex-col font-sans">
      
      {/* Cover Page Layout */}
      {page.type === 'cover' && (
        <div className="flex-1 flex flex-col justify-center text-center space-y-8">
          {page.band && <div className="text-sm font-semibold tracking-widest uppercase text-muted-foreground">{page.band}</div>}
          <div className="space-y-4">
            <h1 className="text-5xl font-serif text-primary leading-tight font-bold">{page.title}</h1>
            {page.subtitle && <h2 className="text-2xl text-foreground font-serif opacity-90">{page.subtitle}</h2>}
          </div>
          {(page.eventName || page.eventDate) && (
            <div className="mt-16 text-lg text-muted-foreground space-y-1">
              {page.eventName && <div>{page.eventName}</div>}
              {page.eventDate && <div>{page.eventDate}</div>}
            </div>
          )}
        </div>
      )}

      {/* Content / Section Page Layout */}
      {(page.type === 'content' || page.type === 'section') && (
        <div className="flex-1 flex flex-col">
          <div className="mb-10 pb-4 border-b-2 border-primary/20">
            {page.band && <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">{page.band}</div>}
            <h2 className="text-3xl font-serif text-primary font-semibold">{page.title}</h2>
          </div>
          
          <div className="flex-1 space-y-8">
            {page.sections?.map((section: NoteSection, idx: number) => (
              <div key={idx} className="space-y-3">
                {section.title && <h3 className="text-xl font-medium text-foreground mb-3">{section.title}</h3>}
                
                {section.items && section.items.length > 0 && (
                  <ul className="space-y-4 list-none pl-0">
                    {section.items.map((item: NoteItem, itemIdx: number) => (
                      <li key={itemIdx} className="flex gap-4">
                        <span className="text-primary mt-1 opacity-70">•</span>
                        <div>
                          <strong className="text-foreground block mb-0.5">{item.t}</strong>
                          {item.n && <span className="text-muted-foreground block leading-relaxed">{item.n}</span>}
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {page.quote && (
              <blockquote className="border-l-4 border-primary/30 pl-6 py-2 my-8 italic text-xl text-foreground/80 font-serif">
                "{page.quote}"
                {page.quoteSource && <footer className="text-sm font-sans font-medium mt-3 text-muted-foreground">— {page.quoteSource}</footer>}
              </blockquote>
            )}

            {page.imageUrl && (
              <div className="my-8 rounded-lg overflow-hidden border border-border">
                <img src={page.imageUrl} alt="Document illustration" className="w-full h-auto object-cover max-h-[300px]" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reflection / QA Page Layout */}
      {(page.type === 'reflection' || page.type === 'qa') && (
        <div className="flex-1 flex flex-col">
          <div className="mb-10 pb-4 border-b-2 border-primary/20">
            {page.band && <div className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-2">{page.band}</div>}
            <h2 className="text-3xl font-serif text-primary font-semibold">{page.title}</h2>
          </div>
          
          <div className="flex-1 space-y-12 mt-4">
            {page.questions?.map((q: { q: string }, idx: number) => (
              <div key={idx} className="space-y-6">
                <div className="text-xl font-medium text-foreground leading-snug">{q.q}</div>
                <div className="w-full border-b border-dashed border-border/60"></div>
                <div className="w-full border-b border-dashed border-border/60"></div>
                <div className="w-full border-b border-dashed border-border/60"></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Page Footer */}
      <div className="mt-8 pt-4 flex justify-between text-xs text-muted-foreground font-medium uppercase tracking-wider">
        <span>{page.band || "Takeaway Notes"}</span>
        <span>Page {index}</span>
      </div>
    </div>
  );
}
