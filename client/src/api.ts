import type { ParsedExperiment } from './types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function parseQuestion(question: string): Promise<ParsedExperiment> {
  const res = await fetch(`${API_URL}/parse`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error || 'Request failed')
  }

  return res.json()
}