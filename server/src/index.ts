import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { parseTradingQuestion } from './gemini'

const app = express()
app.use(cors())
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.post('/parse', async (req, res) => {
  const { question } = req.body

  if (!question || typeof question !== 'string' || !question.trim()) {
    return res.status(400).json({ error: 'A "question" string is required.' })
  }

  try {
    const experiment = await parseTradingQuestion(question)
    res.json(experiment)
  } catch (err) {
    console.error('Parse error:', err)
    res.status(500).json({ error: 'Failed to parse the question. Please try again.' })
  }
})

const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})