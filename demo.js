import http from 'http'
import fs from 'fs'
import { visitorCounter } from './lib/index.js'
import * as utilities from './utils.js'

const stats = await visitorCounter()

const dom = string => JSON.stringify(string, null, 2)

const httpServer = http.createServer(async (req, res) => {
  stats.record(req, res)

  if (utilities.params(req, 'all')) {
    res.end(dom(await stats.get()))
    return
  }

  if (utilities.params(req, 'range')) {
    res.end(dom(await stats.range(utilities.params(req, 'range'))))
    return
  }

  if (req.url === '/') res.end(fs.readFileSync('index.html'))
  if (req.url === '/currently') res.end(stats.curretly().toString())
})

httpServer.listen(3333, () => console.log('running on http://localhost:3333'))
