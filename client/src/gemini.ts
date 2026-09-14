import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.LLM_API_KEY || '')

const SYSTEM_PROMPT = `You are a trading research assistant. Convert a user's natural-language trading question into a structured experiment.

Return ONLY valid JSON (no markdown, no backticks) matching this exact shape:
{
  "instrument": string | null,
  "timeframe": string | null,
  "entry": string | null,
  "exit": string | null,
  "holdingPeriod": string | null,
  "filters": string[],
  "question": string,
  "missingFields": string[]
}

Rules:
- Fill a field only if the user's question actually implies it. Do not invent specifics.
- If a field is not specified or is ambiguous, set it to null and add a short, specific clarifying question about it to "missingFields" (e.g. "How long should the position be held before exiting?").
- "question" should restate what the user is trying to find out, in one sentence.
- Do not include any text outside the JSON object.`

export interface ParsedExperiment {
  instrument: string | null
  timeframe: string | null
  entry: string | null
  exit: string | null
  holdingPeriod: string | null
  filters: string[]
  question: string
  missingFields: string[]
}

export async function parseTradingQuestion(userQuestion: string): Promise<ParsedExperiment> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const result = await model.generateContent([
    SYSTEM_PROMPT,
    `User question: "${userQuestion}"`
  ])

  const text = result.response.text().trim()
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim()

  return JSON.parse(cleaned) as ParsedExperiment
}