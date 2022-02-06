import { randomUUID } from 'crypto'
import { cookies } from './cookies.js'
import { makeRecord, model } from './api.js'
import { db } from './db.js'
import { time } from './time.js'

import { IncomingMessage, OutgoingMessage } from 'http'

export default async ({
  mongourl = 'mongodb://localhost:27017/',
  dbName = 'visitor-counter-db',
  ttl = 3600,
  id = 'default',
  cookieKey = 'visitor-counter-id',
} = {}) => {
  const database = await db({ id, mongourl, dbName, ttl })

  return {
    record: async (req: IncomingMessage, res: OutgoingMessage, next: any) => {
      const visitorId = cookies(req.headers.cookie)[`${cookieKey}-${id}`]

      if (!(await database.getVisitor(visitorId))) {
        const newVisitorId = randomUUID()
        database.setVisitor(newVisitorId)
        database.set(await makeRecord(req))
        res.setHeader('Set-Cookie', `${`${cookieKey}-${id}`}=${newVisitorId}`)
      }

      if (typeof next === 'function') next()
    },

    get: async (param: string | undefined) => {
      if (!param) return model(await database.get())

      const [start, finish] = param.split('-')
      const from = time[start]
        ? Date.now() - time[start]
        : new Date(start).getTime()
      const to = finish ? new Date(finish).getTime() : Date.now()

      const result = await database.get({ date: { $gte: from, $lte: to } })

      return model(result)
    },

    visitors: async () => await database.getVisitorCount()
  }
}
