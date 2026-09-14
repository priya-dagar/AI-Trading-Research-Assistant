import { useState } from 'react'
import type { ParsedExperiment } from '../types'

interface Props {
  experiment: ParsedExperiment
  onUpdate: (updated: ParsedExperiment) => void
}

const FIELD_ROWS: { key: keyof ParsedExperiment; label: string }[] = [
  { key: 'instrument', label: 'Instrument' },
  { key: 'timeframe', label: 'Timeframe' },
  { key: 'entry', label: 'Entry condition' },
  { key: 'exit', label: 'Exit condition' },
  { key: 'holdingPeriod', label: 'Holding period' }
]

export default function ExperimentCard({ experiment, onUpdate }: Props) {
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const handleAnswer = (field: string) => {
    const value = drafts[field]?.trim()
    if (!value) return

    onUpdate({
      ...experiment,
      [field]: value,
      missingFields: experiment.missingFields.filter((m) => m.field !== field)
    })
    setDrafts((d) => ({ ...d, [field]: '' }))
  }

  return (
    <div className="rounded-md border border-slate-700 bg-[#131B2E]">
      <div className="border-b border-slate-700 px-5 py-3">
        <p className="text-xs text-slate-400">Research question</p>
        <p className="mt-1 text-slate-100">{experiment.question}</p>
      </div>

      <div className="divide-y divide-slate-800">
        {FIELD_ROWS.map(({ key, label }) => {
          const value = experiment[key] as string | null
          const isMissing = value === null
          return (
            <div key={key} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-slate-400">{label}</span>
              <span
                className={`font-mono text-sm ${
                  isMissing ? 'text-[#F2545B]' : 'text-[#E7ECF3]'
                }`}
              >
                {isMissing ? 'not specified' : value}
              </span>
            </div>
          )
        })}

        {experiment.filters.length > 0 && (
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-sm text-slate-400">Filters</span>
            <span className="font-mono text-sm text-[#E7ECF3]">
              {experiment.filters.join(', ')}
            </span>
          </div>
        )}
      </div>

      {experiment.missingFields.length > 0 && (
        <div className="border-t border-slate-700 bg-[#0B1220] px-5 py-4">
          <p className="text-sm font-medium text-[#F2545B]">
            Before this can be tested, we need to know:
          </p>
          <div className="mt-3 space-y-3">
            {experiment.missingFields.map((m) => (
              <div key={m.field} className="flex flex-col gap-1.5">
                <label className="text-sm text-slate-300">{m.question}</label>
                <div className="flex gap-2">
                  <input
                    value={drafts[m.field] || ''}
                    onChange={(e) =>
                      setDrafts((d) => ({ ...d, [m.field]: e.target.value }))
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleAnswer(m.field)}
                    placeholder="Type your answer…"
                    className="flex-1 rounded-md border border-slate-700 bg-[#131B2E] px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-[#5B8DEF] focus:outline-none focus:ring-1 focus:ring-[#5B8DEF]"
                  />
                  <button
                    onClick={() => handleAnswer(m.field)}
                    disabled={!drafts[m.field]?.trim()}
                    className="rounded-md bg-[#5B8DEF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4A7BDB] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Fill in
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {experiment.missingFields.length === 0 && (
        <div className="border-t border-slate-700 bg-[#0B1220] px-5 py-3">
          <p className="text-sm font-medium text-[#3ECF8E]">
            Experiment is fully specified and ready to test.
          </p>
        </div>
      )}
    </div>
  )
}