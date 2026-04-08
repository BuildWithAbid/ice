"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

const SUGGESTIONS = [
  "How does DNS work?",
  "What is recursion?",
  "How does HTTPS encryption work?",
  "What are neural networks?",
  "How does garbage collection work?",
  "What is the blockchain?",
  "How do databases index data?",
  "What is event-driven architecture?",
];

export function TopicInput() {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();

  const handleSubmit = useCallback(
    (topic: string) => {
      const trimmed = topic.trim();
      if (!trimmed) return;
      const slug = encodeURIComponent(trimmed);
      router.push(`/explain/${slug}`);
    },
    [router]
  );

  const filteredSuggestions = query.length > 0
    ? SUGGESTIONS.filter((s) =>
        s.toLowerCase().includes(query.toLowerCase())
      )
    : SUGGESTIONS;

  return (
    <div className="relative w-full max-w-2xl">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(query);
        }}
      >
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl border bg-white px-5 py-4 shadow-sm transition-all duration-200",
            isFocused
              ? "border-primary/30 shadow-lg shadow-primary/5 ring-4 ring-primary/5"
              : "border-border hover:border-primary/20 hover:shadow-md"
          )}
        >
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="What do you want to understand?"
            className="flex-1 bg-transparent text-lg outline-none placeholder:text-muted-foreground/60"
          />
          {query && (
            <kbd className="hidden rounded-lg border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground sm:inline-block">
              Enter
            </kbd>
          )}
        </div>
      </form>

      {isFocused && filteredSuggestions.length > 0 && (
        <div className="absolute top-full z-10 mt-2 w-full rounded-xl border border-border bg-white p-2 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Try asking about...
          </p>
          {filteredSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onMouseDown={() => {
                setQuery(suggestion);
                handleSubmit(suggestion);
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted"
            >
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
