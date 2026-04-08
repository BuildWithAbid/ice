import { TopicInput } from "@/components/TopicInput";
import { Sparkles, BookOpen, BrainCircuit } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Hero */}
      <section className="flex flex-1 flex-col items-center justify-center px-6 py-24">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5" />
          Powered by AI
        </div>

        <h1 className="mb-4 max-w-3xl text-center text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
          Understand anything,{" "}
          <span className="bg-gradient-to-r from-neutral-900 via-neutral-600 to-neutral-900 bg-clip-text text-transparent">
            step by step
          </span>
        </h1>

        <p className="mb-10 max-w-xl text-center text-lg leading-relaxed text-muted-foreground">
          Type any topic and get a beautiful visual explanation with diagrams,
          analogies, and quizzes — tailored to your level.
        </p>

        <TopicInput />

        {/* Feature pills */}
        <div className="mt-16 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<BookOpen className="h-5 w-5" />}
            title="Step-by-step"
            description="Complex topics broken into digestible steps"
          />
          <FeatureCard
            icon={<BrainCircuit className="h-5 w-5" />}
            title="Interactive quizzes"
            description="Test your understanding as you learn"
          />
          <FeatureCard
            icon={<Sparkles className="h-5 w-5" />}
            title="Visual diagrams"
            description="Flowcharts and diagrams that clarify concepts"
          />
        </div>
      </section>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-border bg-white p-5 text-center shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
