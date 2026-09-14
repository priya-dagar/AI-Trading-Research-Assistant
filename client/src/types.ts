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