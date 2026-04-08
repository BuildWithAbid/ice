"use client";

import { useState } from "react";
import type { Quiz } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CheckCircle2, XCircle, HelpCircle } from "lucide-react";

interface QuizWidgetProps {
  quiz: Quiz;
}

export function QuizWidget({ quiz }: QuizWidgetProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const isCorrect = selected === quiz.correctId;

  const handleSelect = (id: string) => {
    if (revealed) return;
    setSelected(id);
  };

  const handleCheck = () => {
    if (!selected) return;
    setRevealed(true);
  };

  const handleReset = () => {
    setSelected(null);
    setRevealed(false);
  };

  return (
    <div className="mt-6 rounded-xl border border-border bg-muted/20 p-5">
      <div className="mb-3 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-primary" />
        <h4 className="text-sm font-semibold text-foreground">
          Check your understanding
        </h4>
      </div>

      <p className="mb-4 text-sm font-medium text-foreground">
        {quiz.question}
      </p>

      <div className="space-y-2">
        {quiz.options.map((option) => {
          const isThis = selected === option.id;
          const isAnswer = option.id === quiz.correctId;

          let optionStyle = "border-border hover:border-primary/30 hover:bg-muted/50";
          if (revealed && isAnswer) {
            optionStyle = "border-green-300 bg-green-50 text-green-900";
          } else if (revealed && isThis && !isCorrect) {
            optionStyle = "border-red-300 bg-red-50 text-red-900";
          } else if (isThis) {
            optionStyle = "border-primary bg-primary/5";
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={revealed}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left text-sm transition-all duration-150",
                optionStyle,
                revealed && "cursor-default"
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold uppercase",
                  isThis && !revealed
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-muted-foreground"
                )}
              >
                {option.id}
              </span>
              <span className="flex-1">{option.text}</span>
              {revealed && isAnswer && (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
              )}
              {revealed && isThis && !isCorrect && (
                <XCircle className="h-4 w-4 shrink-0 text-red-500" />
              )}
            </button>
          );
        })}
      </div>

      {!revealed && (
        <button
          onClick={handleCheck}
          disabled={!selected}
          className={cn(
            "mt-4 rounded-lg px-5 py-2 text-sm font-medium transition-all",
            selected
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "cursor-not-allowed bg-muted text-muted-foreground"
          )}
        >
          Check Answer
        </button>
      )}

      {revealed && (
        <div className="mt-4 space-y-3">
          <div
            className={cn(
              "rounded-lg p-3 text-sm",
              isCorrect
                ? "bg-green-50 text-green-800"
                : "bg-amber-50 text-amber-800"
            )}
          >
            <span className="font-semibold">
              {isCorrect ? "Correct!" : "Not quite."}
            </span>{" "}
            {quiz.explanation}
          </div>
          <button
            onClick={handleReset}
            className="text-sm font-medium text-primary hover:underline"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
