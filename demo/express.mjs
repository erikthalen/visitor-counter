import express from 'express'
import counter from '../dist/visitor-counter.esm.mjs'

const app = express()
const stats = await counter()

app.use(await stats.record)

app.get('/', async (req, res) => {
  res.send(`<pre>${JSON.stringify(await stats.get(), null, 2)}</pre>`)
})

app.listen(3333)
