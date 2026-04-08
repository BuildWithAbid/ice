"use client";

import { useState, useEffect } from "react";
import type { Step } from "@/lib/types";
import { cn } from "@/lib/utils";
import { DiagramRenderer } from "./DiagramRenderer";
import { QuizWidget } from "./QuizWidget";
import { ChevronDown } from "lucide-react";

interface StepCardProps {
  step: Step;
  index: number;
}

export function StepCard({ step, index }: StepCardProps) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), index * 150);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={cn(
        "transition-all duration-500",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0"
      )}
    >
      <div className="group relative rounded-2xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
        {/* Step number indicator */}
        <div className="absolute -left-px -top-px flex h-8 w-8 items-center justify-center rounded-br-xl rounded-tl-2xl bg-primary text-xs font-bold text-primary-foreground">
          {step.number}
        </div>

        {/* Header */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-6 py-5 pl-12 text-left"
        >
          <h3 className="text-lg font-semibold text-foreground">
            {step.title}
          </h3>
          <ChevronDown
            className={cn(
              "h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200",
              expanded && "rotate-180"
            )}
          />
        </button>

        {/* Content */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expanded ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="border-t border-border px-6 py-5">
            {/* Main content */}
            <div
              className="prose prose-sm max-w-none text-foreground prose-strong:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none"
              dangerouslySetInnerHTML={{ __html: formatMarkdown(step.content) }}
            />

            {/* Analogy */}
            {step.analogy && (
              <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-amber-700">
                  Think of it like...
                </p>
                <p className="text-sm leading-relaxed text-amber-900">
                  {step.analogy}
                </p>
              </div>
            )}

            {/* Diagram */}
            {step.diagram && <DiagramRenderer chart={step.diagram} />}

            {/* Quiz */}
            {step.quiz && <QuizWidget quiz={step.quiz} />}
          </div>
        </div>
      </div>
    </div>
  );
}

const formatMarkdown = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`(.*?)`/g, "<code>$1</code>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n- /g, "</p><ul><li>")
    .replace(/<\/li>\n/g, "</li>")
    .replace(/^/, "<p>")
    .replace(/$/, "</p>")
    .replace(/<p><\/p>/g, "");
};
