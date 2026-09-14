import { useState } from 'react'
import QuestionForm from './components/QuestionForm'
import ExperimentCard from './components/ExperimentCard'
import { parseQuestion } from './api'
import type { ParsedExperiment } from './types'

function App() {
  const [experiment, setExperiment] = useState<ParsedExperiment | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (question: string) => {
    setLoading(true)
    setError(null)
    setExperiment(null)
    try {
      const result = await parseQuestion(question)
      setExperiment(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0B1220] px-6 py-16">
      <div className="mx-auto max-w-[640px]">
        <h1 className="text-2xl font-semibold text-slate-100">
          AI Trading Research Assistant
        </h1>
        <p className="mt-2 text-sm text-slate-400">
          Turn a plain-language trading question into a structured, testable experiment.
        </p>

        <div className="mt-8">
          <QuestionForm onSubmit={handleSubmit} loading={loading} />
        </div>

        {error && (
          <p className="mt-6 text-sm text-[#F2545B]">{error}</p>
        )}

        {experiment && (
          <div className="mt-8">
            <ExperimentCard experiment={experiment} onUpdate={setExperiment} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App