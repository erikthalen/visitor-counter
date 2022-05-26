import { randomUUID } from 'crypto'
import { cookies } from './cookies.mjs'
import { makeRecord, model } from './api.mjs'
import { db } from './db.mjs'
import { time } from './time.mjs'
import url from 'url'
import fs from 'fs'

export default async ({
  mongourl = 'mongodb://localhost:27017/',
  // dbName = 'visitor-counter-db',
  // ttl = 3600,
  id = 'default',
  // cookieKey = 'visitor-counter-id',
} = {}) => {
  const database = await db({ id, mongourl /*, dbName */ })
  const cookieKey = 'visitor-counter-id'

  async function get(param) {
    if (!param) return model(await database.get())

    const [start, finish] = param.split('-')
    const from = time[start]
      ? Date.now() - time[start]
      : new Date(start).getTime()
    const to = finish ? new Date(finish).getTime() : Date.now()

    const result = await database.get({ date: { $gte: from, $lte: to } })

    return model(result)
  }

  return {
    record: async (req, res, next) => {
      const visitorId = cookies(req.headers.cookie)[`${cookieKey}-${id}`]

      if (!(await database.getVisitor(visitorId))) {
        const newVisitorId = randomUUID()
        database.setVisitor(newVisitorId)
        database.set(await makeRecord(req))
        res.setHeader('Set-Cookie', `${`${cookieKey}-${id}`}=${newVisitorId}`)
      }

      if (typeof next === 'function') next()
    },

    get: get,

    visitors: async () => await database.getVisitorCount(),

    async ui(req, res, next) {
      const { pathname, query } = url.parse(req.url, true)

      if (pathname.replaceAll('/', '') === 'visitor-counter') {
        if (!query.range) res.end(fs.readFileSync('./lib/ui.html'))
        // if (!query.range) res.end(ui())

        res.end(
          JSON.stringify(await get(query.range === 'all' ? false : query.range))
        )
      }

      if (typeof next === 'function') next()
    },
  }
}
