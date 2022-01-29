import http from 'http'
import url from 'url'
import indexHtml from './html.js'
import visitorCounter from '../lib/index.js'

const params = (req, param) => {
  const query = url.parse(req.url, true).query
  return query[param] || typeof query[param] === 'string'
}

const stats = await visitorCounter({ id: 'demo-page', ttl: 60 * 30 })

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

  if (req.url === '/') res.end(indexHtml)
})

httpServer.listen(3333, () => console.log('running on http://localhost:3333'))
