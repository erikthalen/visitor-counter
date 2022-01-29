import express from 'express'
import visitorCounter from '../lib/index.js'

const app = express()
const stats = await visitorCounter()

app.use(await stats.record)

app.get('/', async (req, res) => {
  res.send(`<pre>${JSON.stringify(await stats.get(), null, 2)}</pre>`)
})

app.listen(3333)
