import geoip from 'fast-geoip'

const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

export const makeRecord = async req => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection.remoteAddress

  if (!ip || ip === '::ffff:127.0.0.1') return

  const location = await geoip.lookup(ip)

  return {
    ip,
    countryCode: location?.country || false,
    country: location ? getCountryName.of(location.country) : false,
    date: Date.now(),
  }
}

export const model = async data => ({
  total: data.length,
  countries: data.reduce((acc, { country }) => {
    return { ...acc, [country]: (acc[country] || 0) + 1 }
  }, {}),
  // data,
})
