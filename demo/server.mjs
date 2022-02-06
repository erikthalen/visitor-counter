import http from 'http'
import url from 'url'
import indexHtml from './html.mjs'
import counter from '../dist/visitor-counter.esm.mjs'

const params = (req, param) => {
  const query = url.parse(req.url, true).query
  return query[param] || typeof query[param] === 'string'
}

const stats = await counter({ id: 'demo-page', ttl: 1800 })

const httpServer = http.createServer(async (req, res) => {
  await stats.record(req, res)

  if (params(req, 'all')) {
    const response = await stats.get()
    res.end(JSON.stringify(response, null, 2))
  }

  if (params(req, 'range')) {
    const result = await stats.get(params(req, 'range'))
    res.end(JSON.stringify(result, null, 2))
  }

  if (params(req, 'current')) {
    const result = await stats.visitors()
    res.end(JSON.stringify(result, null, 2))
  }

  if (req.url === '/') res.end(indexHtml)
})

httpServer.listen(3333, () => console.log('running on http://localhost:3333'))
