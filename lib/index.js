import { cookies } from './cookies.js'
import { randomUUID } from 'crypto'
import { visitors } from './visitors.js'
import { api } from './api.js'
import { db } from './db.js'
import { time } from './time.js'

const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

const COOKIE_KEY = 'visitor-counter-id'

let flusher = null

export const visitorCounter = async ({
  mongourl,
  ttl = 3600000,
  id = 'default',
} = {}) => {
  const database = await db({ id, mongourl })

  // remove visitors that's older than TTL
  if (!flusher) flusher = setInterval(() => visitors.flush(ttl), ttl / 2)

  const model = data => ({
    currently: visitors.size(),
    total: data.length,
    countries: data.reduce((acc, { country }) => {
      const name = country ? getCountryName.of(country) : false
      return { ...acc, [name]: (acc[name] || 0) + 1 }
    }, {}),
    data,
  })

  return {
    // main function
    record: (req, res) => {
      const visitorId = cookies(req.headers.cookie)[`${COOKIE_KEY}-${id}`]

      // save record of a new user
      if (!visitors.get(visitorId)) {
        const newVisitorId = randomUUID()
        res.setHeader('Set-Cookie', `${`${COOKIE_KEY}-${id}`}=${newVisitorId}`)
        visitors.set(newVisitorId, Date.now())
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
