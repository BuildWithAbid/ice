"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Level, Explanation } from "@/lib/types";
import { LevelSelector } from "@/components/LevelSelector";
import { StepCard } from "@/components/StepCard";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function ExplainPage() {
  const params = useParams<{ topic: string }>();
  const router = useRouter();
  const topic = decodeURIComponent(params.topic);

  const [level, setLevel] = useState<Level>("beginner");
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExplanation = useCallback(async () => {
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, level }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Something went wrong");
        return;
      }

      setExplanation(data.data);
    } catch {
      setError("Failed to fetch explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, level]);

  useEffect(() => {
    fetchExplanation();
  }, [fetchExplanation]);

  return (
    <div className="min-h-full bg-gradient-to-b from-muted/30 to-background">
      <div className="mx-auto max-w-3xl px-6 py-10">
        {/* Navigation */}
        <button
          onClick={() => router.push("/")}
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to search
        </button>

        {/* Topic header */}
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {topic}
        </h1>
        <p className="mb-6 text-muted-foreground">
          {explanation?.summary || "Generating your personalized explanation..."}
        </p>

        {/* Level selector */}
        <div className="mb-10">
          <LevelSelector value={level} onChange={setLevel} />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="mb-4 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              Crafting your explanation...
            </p>
            <p className="mt-1 text-xs text-muted-foreground/60">
              This may take a few seconds
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="mb-3 text-sm text-red-800">{error}</p>
            <button
              onClick={fetchExplanation}
              className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-800 transition-colors hover:bg-red-200"
            >
              Try again
            </button>
          </div>
        )}

        {/* Steps */}
        {explanation && !loading && (
          <div className="space-y-6">
            {explanation.steps.map((step, i) => (
              <StepCard key={step.number} step={step} index={i} />
            ))}

            {/* Completion */}
            <div className="rounded-2xl border border-border bg-white p-8 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                You made it!
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You&apos;ve completed all {explanation.steps.length} steps.
                Try a different level or explore a new topic.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => router.push("/")}
                  className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
                >
                  New topic
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
