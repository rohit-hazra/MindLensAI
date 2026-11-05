/* global process */
import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()
const port = Number(process.env.SERVER_PORT || 5000)
const mlUrl = process.env.ML_SERVICE_URL || 'http://127.0.0.1:8000'
app.use(cors())
app.use(express.json({ limit: '32kb' }))
app.get('/api/health', (_, res) => res.json({ ok: true, service: 'mindlens-api', mlService: mlUrl }))
app.post('/api/analyze', async (req, res) => {
  const text = typeof req.body?.text === 'string' ? req.body.text.trim() : ''
  if (!text) return res.status(400).json({ error: 'Text is required.' })
  if (text.length > 500) return res.status(400).json({ error: 'Text must be 500 characters or fewer.' })
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(`${mlUrl}/predict`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ text }), signal: controller.signal })
    const body = await response.json().catch(() => null)
    if (!response.ok) return res.status(response.status).json({ error: body?.detail || 'The model service could not analyze this caption.' })
    return res.json(body)
  } catch (error) {
    return res.status(503).json({ error: error.name === 'AbortError' ? 'The model service timed out.' : 'The model service is unavailable.' })
  } finally { clearTimeout(timeout) }
})
app.listen(port, () => console.log(`MindLens API listening on ${port}`))
