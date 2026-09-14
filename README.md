# AI Trading Research Assistant — Mini Prototype

A small prototype that turns a natural-language trading question into a structured,
testable experiment — and asks the user for anything important that's missing,
rather than guessing.

## Live Demo
https://ai-trading-research-assistant-rosy.vercel.app/

## What it does

1. User types a question in plain English (e.g. "Does buying NIFTY after a 1% fall
   work better during high-volatility periods?")
2. The backend sends it to Gemini with a strict extraction prompt, which returns a
   structured experiment: instrument, timeframe, entry/exit conditions, holding
   period, filters, and the underlying research question.
3. Any field the question didn't actually specify is left `null` and paired with a
   specific clarifying question (not a generic "missing info" flag).
4. The user can answer each clarifying question inline, and the experiment updates
   live until it's fully specified.

## Architecture

- **Frontend**: React + TypeScript + Vite, styled with Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **LLM**: Google Gemini (`gemini-3.6-flash`) via the `@google/genai` SDK

Frontend and backend are separate services connected over a REST API
(`POST /parse`). This keeps the LLM call, API key, and prompt logic server-side
only, and makes the two deployable independently (frontend to Vercel, backend to
Render).

### Why a structured JSON contract instead of a chat interface

The assignment's evaluation explicitly warns against "simply creating a chatbot
wrapper." Instead of streaming conversational text, the backend enforces a strict
JSON schema for the LLM's response (instrument, timeframe, entry, exit,
holdingPeriod, filters, question, missingFields), which the frontend renders as a
clean structured "experiment ticket" rather than a chat transcript. This makes the
system's understanding of the question inspectable and testable, not just
readable.

### Handling ambiguity

Missing fields aren't silently defaulted. The prompt explicitly instructs the
model to leave a field `null` and generate a specific, actionable clarifying
question for it (e.g. "How long should the position be held before exiting?"
rather than a generic "holding period missing"). The frontend renders one input
per missing field, and answering it merges directly into the experiment state
without a second LLM round-trip.

## Tech decisions worth calling out

- **Gemini model migration mid-build**: started on `gemini-1.5-flash`, which
  returned a 404 (deprecated). Moved through `gemini-flash-latest` (intermittent
  503s under load) to `gemini-3.6-flash` on the current `@google/genai` SDK
  (the older `@google/generative-ai` package is being phased out). Added
  retry-with-backoff for transient 503s.
- **Robust JSON extraction**: rather than trusting the model to never add stray
  text around the JSON, the backend extracts the substring between the first `{`
  and last `}` before parsing, so minor formatting drift doesn't break parsing.

## Running locally

**Backend**
```bash
cd server
npm install
cp .env.example .env   # add your Gemini API key as LLM_API_KEY
npm run dev             # runs on http://localhost:4000
```

**Frontend**
```bash
cd client
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:4000
npm run dev              # runs on http://localhost:5173
```

## What I'd improve with more time

- Persist experiments (localStorage or a lightweight DB) so a user could revisit
  past questions instead of losing state on refresh.
- Wire the finished, fully-specified experiment into a mock backtesting endpoint
  (the assignment's optional bonus), returning a sample result and a clear
  distinction between what the data shows vs. what's inferred from it.
- Add basic input validation/rate-limiting on the `/parse` endpoint before any
  real deployment.
- Expand the missing-field types beyond the current five so the model isn't
  constrained to a fixed schema when a question implies something outside it
  (e.g. slippage assumptions, transaction costs).

## AI tools used

See `AI_USAGE.md`.
