import http from 'http'
import counter from '../dist/visitor-counter.esm.mjs'

const stats = await counter()

const httpServer = http.createServer(async (req, res) => {
  await stats.record(req, res)
  await stats.ui(req, res)

  if (req.url === '/')
    res.end(`<html><code>Go to <a href="/visitor-counter">the ui</a> to see demo</code></html>`)
})

httpServer.listen(3333, () => console.log('running on http://localhost:3333'))
