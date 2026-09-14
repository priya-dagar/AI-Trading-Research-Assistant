import { useState } from 'react'

interface Props {
  onSubmit: (question: string) => void
  loading: boolean
}

export default function QuestionForm({ onSubmit, loading }: Props) {
  const [value, setValue] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) onSubmit(value.trim())
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <label htmlFor="question" className="text-sm text-slate-400">
        Ask a trading question in plain language
      </label>
      <textarea
        id="question"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Does buying NIFTY after a 1% fall work better during high-volatility periods?"
        rows={3}
        disabled={loading}
        className="w-full rounded-md border border-slate-700 bg-[#131B2E] px-4 py-3 text-slate-100 placeholder:text-slate-500 focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF] disabled:opacity-60"
        />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="self-start rounded-md bg-[#5B8DEF] px-5 py-2 font-medium text-white transition hover:bg-[#4A7BDB] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? 'Structuring your question…' : 'Build experiment'}
      </button>
    </form>
  )
}