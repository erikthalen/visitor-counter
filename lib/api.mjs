import geoip from 'fast-geoip'
import { time } from './time.mjs'

const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

export const createModel = async (ip, date = Date.now()) => {
  const location = await geoip.lookup(ip)

  return {
    ip,
    countryCode: location?.country || false,
    country: location ? getCountryName.of(location.country) : false,
    date,
  }
}

export const makeRecord = async req => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection.remoteAddress

  if (!ip || ip === '::ffff:127.0.0.1') return

  return await createModel(ip)
}

const round = (t, scale) => Math.round(t / scale) * scale

export const model = async (data, scale) => ({
  total: data.length,
  ...data
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .reduce((acc, { country, date }) => {
      const d = new Date(scale ? round(date, time.hour) : date)
      const curDate = scale
        ? d.toLocaleTimeString()
        : d.toLocaleDateString()

      return {
        ...acc,
        countries: {
          ...acc.countries,
          [country]: ((acc.countries && acc.countries[country]) || 0) + 1,
        },
        dates: {
          ...acc.dates,
          [curDate]: ((acc.dates && acc.dates[curDate]) || 0) + 1,
        },
      }
    }, {}),
})
