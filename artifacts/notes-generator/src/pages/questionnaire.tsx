import React, { useState } from "react";
import { useLocation, useParams } from "wouter";
import { useGetSession, useSubmitQuestionnaire, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { debugLog } from "@/lib/debug";

interface Question {
  id: string;
  question: string;
  type: "text" | "choice" | "multiChoice";
  options?: string[];
  placeholder?: string;
}

export default function Questionnaire() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: session, isLoading } = useGetSession(sessionId, {
    query: {
      enabled: !!sessionId,
      queryKey: getGetSessionQueryKey(sessionId)
    }
  });

  const submitMutation = useSubmitQuestionnaire();

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [extraQuestions, setExtraQuestions] = useState<Question[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const handleAnswerChange = (questionId: string, value: unknown) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiChoiceChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId]) ? (prev[questionId] as string[]) : [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  const handleSubmit = async () => {
    if (!sessionId) return;

    debugLog.info(`Submitting questionnaire for session ${sessionId}`, `answers: ${JSON.stringify(Object.keys(answers))}`);

    submitMutation.mutate(
      {
        sessionId,
        data: {
          answers,
          additionalInstructions: additionalInstructions || null
        }
      },
      {
        onSuccess: (result) => {
          if (result.ready) {
            debugLog.success("Questionnaire accepted — proceeding to generate");
            setLocation(`/generating/${sessionId}`);
          } else if (result.needsMoreInfo) {
            const fqs = (result.followUpQuestions as Question[] | undefined) ?? [];
            if (fqs.length > 0) {
              debugLog.info(`AI requested ${fqs.length} follow-up question(s)`, JSON.stringify(fqs.map(q => q.id)));
              setExtraQuestions(fqs);
              setSubmitted(true);
              toast({
                title: "A couple more things…",
                description: "Please answer these quick follow-up questions.",
              });
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              debugLog.info("No follow-ups — proceeding to generate");
              setLocation(`/generating/${sessionId}`);
            }
          }
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : String(err);
          debugLog.error("Questionnaire submission failed", msg);
          toast({
            title: "Submission failed",
            description: "There was an error saving your answers.",
            variant: "destructive"
          });
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

  const baseQuestions = (session.questions ?? []) as Question[];
  const displayQuestions = submitted && extraQuestions.length > 0 ? extraQuestions : baseQuestions;

  return (
    <div className="min-h-screen bg-background py-12 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto space-y-8">

        {/* Header */}
        <div className="space-y-2">
          {submitted ? (
            <>
              <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Almost there</div>
              <h1 className="text-3xl font-serif text-primary">A few more details</h1>
              <p className="text-muted-foreground">
                These quick answers will help us get the document exactly right.
              </p>
            </>
          ) : (
            <>
              <div className="text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1">Step 1 of 2</div>
              <h1 className="text-3xl font-serif text-primary">Let's refine the details</h1>
              <p className="text-muted-foreground">
                Tell us a bit about your event so we can tailor the document perfectly.
              </p>
            </>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: submitted ? "100%" : "50%" }}
          />
        </div>

        {/* Questions Card */}
        <Card className="p-8 space-y-10 shadow-sm border-muted">
          {displayQuestions.map((q) => (
            <QuestionField
              key={q.id}
              q={q}
              value={answers[q.id]}
              onChange={handleAnswerChange}
              onMultiChange={handleMultiChoiceChange}
            />
          ))}

          {/* Additional instructions — only on first pass */}
          {!submitted && (
            <div className="pt-6 border-t border-border space-y-3">
              <Label className="text-base font-semibold text-foreground">Additional Instructions <span className="font-normal text-muted-foreground">(Optional)</span></Label>
              <p className="text-sm text-muted-foreground">Tone nuances, things to emphasise, or anything else?</p>
              <Textarea
                placeholder="e.g. Keep it concise, emphasise the third section, use an upbeat tone…"
                className="min-h-[110px] bg-muted/30 focus:bg-background"
                value={additionalInstructions}
                onChange={(e) => setAdditionalInstructions(e.target.value)}
              />
            </div>
          )}
        </Card>

        <div className="flex justify-end">
          <Button
            size="lg"
            className="px-8 gap-2"
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Checking…</>
              : submitted
                ? <><ChevronRight className="w-4 h-4" /> Generate Notes</>
                : <><ChevronRight className="w-4 h-4" /> Continue</>
            }
          </Button>
        </div>
      </div>
    </div>
  );
}

function QuestionField({
  q,
  value,
  onChange,
  onMultiChange,
}: {
  q: Question;
  value: unknown;
  onChange: (id: string, val: unknown) => void;
  onMultiChange: (id: string, opt: string, checked: boolean) => void;
}) {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold text-foreground leading-snug">{q.question}</Label>

      {q.type === "text" && (
        <Textarea
          placeholder={q.placeholder || "Your answer…"}
          className="min-h-[90px] resize-y bg-muted/30 focus:bg-background"
          value={(value as string) || ""}
          onChange={(e) => onChange(q.id, e.target.value)}
        />
      )}

      {q.type === "choice" && q.options && (
        <RadioGroup
          value={(value as string) || ""}
          onValueChange={(val) => onChange(q.id, val)}
          className="space-y-2 pt-1"
        >
          {q.options.map((option, i) => (
            <div key={i} className="flex items-center space-x-3">
              <RadioGroupItem value={option} id={`${q.id}-${i}`} />
              <Label htmlFor={`${q.id}-${i}`} className="text-base font-normal cursor-pointer">
                {option}
              </Label>
            </div>
          ))}
        </RadioGroup>
      )}

      {q.type === "multiChoice" && q.options && (
        <div className="space-y-2 pt-1">
          {q.options.map((option, i) => {
            const isChecked = Array.isArray(value) && (value as string[]).includes(option);
            return (
              <div key={i} className="flex items-center space-x-3">
                <Checkbox
                  id={`${q.id}-${i}`}
                  checked={isChecked}
                  onCheckedChange={(checked) => onMultiChange(q.id, option, checked === true)}
                />
                <Label htmlFor={`${q.id}-${i}`} className="text-base font-normal cursor-pointer">
                  {option}
                </Label>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
