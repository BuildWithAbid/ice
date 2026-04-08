"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "neutral",
  fontFamily: "inherit",
  securityLevel: "loose",
});

interface DiagramRendererProps {
  chart: string;
}

export function DiagramRenderer({ chart }: DiagramRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !chart) return;

    const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;

    const render = async () => {
      try {
        const { svg } = await mermaid.render(id, chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch {
        setError(true);
      }
    };

    render();
  }, [chart]);

  if (error) {
    return (
      <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
        Diagram could not be rendered
      </div>
    );
  }

  return (
    <div className="my-4 flex justify-center overflow-x-auto rounded-xl border border-border bg-white p-6">
      <div ref={containerRef} className="[&_svg]:max-w-full" />
    </div>
  );
}
