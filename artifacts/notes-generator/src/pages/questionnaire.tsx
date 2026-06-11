import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useGetSession, useSubmitQuestionnaire, getGetSessionQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [additionalInstructions, setAdditionalInstructions] = useState("");

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleMultiChoiceChange = (questionId: string, option: string, checked: boolean) => {
    setAnswers(prev => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      if (checked) {
        return { ...prev, [questionId]: [...current, option] };
      } else {
        return { ...prev, [questionId]: current.filter((o: string) => o !== option) };
      }
    });
  };

  const handleSubmit = async () => {
    if (!sessionId) return;
    
    submitMutation.mutate({
      sessionId,
      data: {
        answers,
        additionalInstructions: additionalInstructions || null
      }
    }, {
      onSuccess: (result) => {
        if (result.ready) {
          setLocation(`/generating/${sessionId}`);
        } else if (result.needsMoreInfo) {
          toast({
            title: "More clarification needed",
            description: result.message || "Please answer a few follow-up questions.",
          });
        }
      },
      onError: () => {
        toast({
          title: "Submission failed",
          description: "There was an error saving your answers.",
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

  const questions = session.questions || [];

  return (
    <div className="min-h-screen bg-background py-12 px-6 sm:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-serif text-primary">Let's refine the details</h1>
          <p className="text-muted-foreground">
            We found some areas that need your direction to create the perfect document.
          </p>
        </div>

        <Card className="p-8 space-y-10 shadow-sm border-muted">
          {questions.map((q) => (
            <div key={q.id} className="space-y-4">
              <Label className="text-lg font-medium text-foreground leading-snug">{q.question}</Label>
              
              {q.type === 'text' && (
                <Textarea 
                  placeholder={q.placeholder || "Your answer..."}
                  className="min-h-[100px] resize-y bg-muted/30 focus:bg-background"
                  value={answers[q.id] || ""}
                  onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                />
              )}

              {q.type === 'choice' && q.options && (
                <RadioGroup 
                  value={answers[q.id] || ""} 
                  onValueChange={(val) => handleAnswerChange(q.id, val)}
                  className="space-y-3 pt-2"
                >
                  {q.options.map((option, i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <RadioGroupItem value={option} id={`${q.id}-${i}`} />
                      <Label htmlFor={`${q.id}-${i}`} className="text-base font-normal cursor-pointer">{option}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}

              {q.type === 'multiChoice' && q.options && (
                <div className="space-y-3 pt-2">
                  {q.options.map((option, i) => {
                    const isChecked = Array.isArray(answers[q.id]) && answers[q.id].includes(option);
                    return (
                      <div key={i} className="flex items-center space-x-3">
                        <Checkbox 
                          id={`${q.id}-${i}`} 
                          checked={isChecked}
                          onCheckedChange={(checked) => handleMultiChoiceChange(q.id, option, checked === true)}
                        />
                        <Label htmlFor={`${q.id}-${i}`} className="text-base font-normal cursor-pointer">{option}</Label>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}

          <div className="pt-6 border-t border-border space-y-4">
            <Label className="text-lg font-medium text-foreground">Additional Instructions (Optional)</Label>
            <p className="text-sm text-muted-foreground">Any specific tone, layout preferences, or things to emphasize?</p>
            <Textarea 
              placeholder="E.g. Keep it concise, emphasize the third section, use an upbeat tone..."
              className="min-h-[120px] bg-muted/30 focus:bg-background"
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
            />
          </div>
        </Card>

        <div className="flex justify-end">
          <Button 
            size="lg" 
            className="px-8" 
            onClick={handleSubmit}
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? "Submitting..." : "Generate Notes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
