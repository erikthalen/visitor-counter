import { cookies } from './cookies.js'
import { randomUUID } from 'crypto'
import { visitors } from './visitors.js'
import { api } from './api.js'
import { db } from './db.js'
import { time } from './time.js'
export * as utilities from './utils.js'

const COOKIE_KEY = 'metrics_visitor_id'

let flusher = null

export const metrics = async ({ mongourl, ttl = 3600000 }) => {
  const database = await db(mongourl)

  // remove visitors that's older than TTL
  if (!flusher) flusher = setInterval(() => visitors.flush(ttl), ttl / 2)

  const model = data => ({
    currently: visitors.size(),
    total: data.length,
    countries: api.getCountries(data),
    data,
  })

  return {
    // main function
    record: (req, res) => {
      const id = cookies(req.headers.cookie)[COOKIE_KEY]

      // save record of a new user
      if (!visitors.get(id)) {
        const visitorId = randomUUID()
        res.setHeader('Set-Cookie', `${COOKIE_KEY}=${visitorId}`)
        visitors.set(visitorId, Date.now())
        database.set(api.create(req))
      }
    },

    // api
    curretly: visitors.size,
    get: async () => model(await database.get()),
    range: async param => {
      // param example: month
      // param example: 2022,1,10
      // param example: 2022,1,10-2022,1,11
      const [start, finish] = param.split('-')
      const from = time[start]
        ? Date.now() - time[start]
        : new Date(start).getTime()
      const to = finish ? new Date(finish).getTime() : Date.now()

      const result = await database.get({ date: { $gte: from, $lte: to } })

      return model(result)
    },
  }
}
