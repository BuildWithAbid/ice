# Interactive Concept Explainer (ICE)

## Tech Stack
- **Framework**: Next.js 14+ with App Router, TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Diagrams**: Mermaid.js for flowcharts/sequence diagrams
- **AI**: OpenAI GPT-4.1 Mini (default) with Anthropic Claude (fallback) for generating explanations
- **Caching**: Upstash Redis for caching generated explanations

## Project Structure
```
app/
  page.tsx                    — Landing page with topic search
  explain/[topic]/page.tsx    — Explanation display page
  api/explain/route.ts        — POST endpoint for AI calls (OpenAI primary, Anthropic fallback)
  layout.tsx                  — Root layout with fonts and metadata
  globals.css                 — Tailwind base + custom design tokens
components/
  TopicInput.tsx              — Search input with autocomplete feel
  LevelSelector.tsx           — Beginner/Intermediate/Advanced toggle
  StepCard.tsx                — Individual explanation step card
  DiagramRenderer.tsx         — Mermaid.js rendering wrapper
  QuizWidget.tsx              — Interactive quiz per step
lib/
  types.ts                    — All TypeScript interfaces
  prompts.ts                  — System prompt + prompt engineering
  redis.ts                    — Upstash Redis client
  utils.ts                    — Shared utilities (cn, slug helpers)
```

## Conventions

### Code Style
- Use `function` declarations for components, arrow functions for handlers/utilities
- Prefer named exports over default exports for components
- Use `cn()` from lib/utils.ts for conditional class merging
- Keep components focused — one component per file
- Server Components by default; add `"use client"` only when needed

### TypeScript
- Strict mode enabled. No `any` types.
- Define all API response shapes in lib/types.ts
- Use `interface` for object shapes, `type` for unions/intersections

### Styling
- Tailwind utility-first. No custom CSS unless absolutely necessary.
- Design system: clean, spacious, premium educational feel (Stripe docs × Brilliant.org)
- Use CSS custom properties via globals.css for theme tokens
- Animations: subtle, purposeful. Staggered reveals for steps, smooth transitions.
- Mobile-first responsive design

### API
- All AI calls go through app/api/explain/route.ts (OpenAI GPT-4.1 Mini primary, Anthropic Claude fallback)
- Cache responses in Redis keyed by `topic:level`
- Return structured JSON matching the Explanation type
- Handle errors gracefully with typed error responses

### Environment Variables
```
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```
