import geoip from 'fast-geoip'

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

export const model = async data => ({
  total: data.length,
  ...data
    .sort((a, b) => (a.date < b.date ? -1 : 1))
    .reduce((acc, { country, date }) => {
      const d = new Date(date)
      const curDate = d.toLocaleDateString()

      // const curTime = ate.toLocaleTimeString()

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
