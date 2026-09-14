# AI Usage Note

## Which AI tools I used
Claude (Anthropic) as a development partner throughout the build — planning,
scaffolding, debugging, and code generation.

## What I used it for
- Deciding between the two assignment options based on the actual job description
- Scoping the build to fit a 4–6 hour window
- Scaffolding the project structure (React/Vite client, Express/TypeScript server)
- Writing the Gemini prompt and JSON schema for structured extraction
- Debugging real issues that came up during the build: a PowerShell/curl syntax
  mismatch, a stale file causing a route 404, and — the most significant one — a
  live Gemini model deprecation/SDK migration (`gemini-1.5-flash` → `gemini-flash-latest`
  → `gemini-3.6-flash`, and `@google/generative-ai` → `@google/genai`) that
  surfaced mid-build via the API's own error messages
- Designing the UI direction (a dark, terminal/trade-ticket-inspired look instead
  of a generic SaaS-card layout) and implementing it in Tailwind
- Building the inline clarification flow so missing fields can be filled in
  without a second round-trip to the LLM

## What I decided myself
- Choosing Option 1 over Option 2, based on matching the assignment to the actual
  role's day-to-day responsibilities (implementation-heavy, not thinking-note-heavy)
- The overall architecture split (separate frontend/backend services rather than
  a single Next.js app)
- The product decision to surface missing fields as specific, answerable
  questions rather than a generic "incomplete" state
- Verifying each fix actually worked against the running app before moving to
  the next step, rather than accepting generated code on faith

## What I reviewed or modified
- Iterated on the Gemini integration multiple times as the API returned
  different errors (404 deprecated model, 503 capacity, another 404 pointing to
  a newer model) — each fix was verified against real terminal output before
  moving forward, not assumed to work
- Kept the JSON-extraction logic defensive (extracting between first/last brace)
  after recognizing the initial markdown-fence-only cleanup was fragile