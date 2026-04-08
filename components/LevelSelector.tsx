"use client";

import type { Level } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LevelSelectorProps {
  value: Level;
  onChange: (level: Level) => void;
}

const LEVELS: { value: Level; label: string; description: string }[] = [
  {
    value: "beginner",
    label: "Beginner",
    description: "Simple language, lots of analogies",
  },
  {
    value: "intermediate",
    label: "Intermediate",
    description: "Technical detail, balanced depth",
  },
  {
    value: "advanced",
    label: "Advanced",
    description: "Deep dive, implementation details",
  },
];

export function LevelSelector({ value, onChange }: LevelSelectorProps) {
  return (
    <div className="flex gap-2">
      {LEVELS.map((level) => (
        <button
          key={level.value}
          onClick={() => onChange(level.value)}
          className={cn(
            "group relative flex flex-col items-start rounded-xl border px-4 py-3 text-left transition-all duration-200",
            value === level.value
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border hover:border-primary/30 hover:bg-muted/50"
          )}
        >
          <span
            className={cn(
              "text-sm font-semibold transition-colors",
              value === level.value
                ? "text-primary"
                : "text-foreground"
            )}
          >
            {level.label}
          </span>
          <span className="text-xs text-muted-foreground">
            {level.description}
          </span>
          {value === level.value && (
            <div className="absolute -top-px left-4 right-4 h-0.5 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}
