import express from 'express'
import counter from '../lib/index.mjs'

const app = express()
const stats = await counter()

app.use(await stats.record)
app.use(await stats.ui)

app.get('/', async (req, res) => {
  res.send(`Go to <a href="/visitor-counter">the ui</a> to see demo`)
})

app.listen(3333)
