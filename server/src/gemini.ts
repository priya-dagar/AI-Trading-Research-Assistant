import { GoogleGenAI } from '@google/genai'

const ai = new GoogleGenAI({ apiKey: process.env.LLM_API_KEY || '' })

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
  "missingFields": { "field": "timeframe" | "exit" | "holdingPeriod" | "instrument" | "entry", "question": string }[]
}

Rules:
- Fill a field only if the user's question actually implies it. Do not invent specifics.
- If a field is not specified or is ambiguous, set it to null and add an entry to "missingFields" with the exact field name and a short, specific clarifying question (e.g. { "field": "holdingPeriod", "question": "How long should the position be held before exiting?" }).
- "question" should restate what the user is trying to find out, in one sentence.
- Do not include any text outside the JSON object.`

export interface MissingField {
  field: 'instrument' | 'timeframe' | 'entry' | 'exit' | 'holdingPeriod'
  question: string
}

export interface ParsedExperiment {
  instrument: string | null
  timeframe: string | null
  entry: string | null
  exit: string | null
  holdingPeriod: string | null
  filters: string[]
  question: string
  missingFields: MissingField[]
}

export async function parseTradingQuestion(userQuestion: string): Promise<ParsedExperiment> {
  const maxRetries = 3
  let lastError: unknown

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `${SYSTEM_PROMPT}\n\nUser question: "${userQuestion}"`
      })

      const text = (response.text || '').trim()
      const cleaned = text.replace(/^```json\s*/i, '').replace(/```$/, '').trim()

      return JSON.parse(cleaned) as ParsedExperiment
    } catch (err) {
      lastError = err
      const is503 = err instanceof Error && err.message.includes('503')
      if (is503 && attempt < maxRetries) {
        await new Promise((r) => setTimeout(r, attempt * 1000))
        continue
      }
      throw err
    }
  }

  throw lastError
}