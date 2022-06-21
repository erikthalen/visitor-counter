import express from 'express'
import counter from '../dist/visitor-counter.esm.mjs'

const app = express()
const stats = await counter()

app.use(await stats.record)
app.use(await stats.ui)

app.get('/', async (req, res) => {
  res.send(`Go to <a href="/visitor-counter">the ui</a> to see demo`)
})

console.log('express')

app.listen(3333, () => {
  console.log('listening on http://localhost:3333')
})
