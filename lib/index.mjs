import { randomUUID } from 'crypto'
import { cookies } from './cookies.mjs'
import { makeRecord, model } from './api.mjs'
import { db } from './db.mjs'
import { time } from './time.mjs'
import url from 'url'
import { ui } from './ui.html'

export default async ({
  mongourl = 'mongodb://127.0.0.1:27017',
  id = 'default',
} = {}) => {
  const database = await db({ id, mongourl })

  async function get(param) {
    if (!param) return model(await database.get())

    const [start, finish] = param.split('-')
    const from = time[start]
      ? Date.now() - time[start]
      : new Date(start).getTime()
    const to = finish ? new Date(finish).getTime() : Date.now()

    const result = await database.get({ date: { $gte: from, $lte: to } })
    const short = to - from < time.week

    return model(result, short)
  }

  return {
    get,

    record: async (req, res, next) => {
      // console.log(req.headers.host)
      const cookieKey = 'vc-id'
      const visitorId = cookies(req.headers.cookie)[`${cookieKey}-${id}`]

      if (!(await database.getVisitor(visitorId))) {
        const newVisitorId = randomUUID()
        database.setVisitor(newVisitorId)
        database.set(await makeRecord(req))
        res.setHeader('Set-Cookie', `${`${cookieKey}-${id}`}=${newVisitorId}`)
      }

      if (typeof next === 'function') next()
    },

    visitors: async () => await database.getVisitorCount(),

    async ui(req, res, next) {
      const { pathname, query } = url.parse(req.url, true)

      if (pathname.replaceAll('/', '') === 'visitor-counter') {
        if (!query.range) {
          res.end(ui)
          return
        }

        res.end(
          JSON.stringify(await get(query.range === 'all' ? false : query.range))
        )
      }
    },
  }
}
