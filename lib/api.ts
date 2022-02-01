import geoip, { ipInfo } from 'fast-geoip'
import { IncomingMessage } from 'http'

const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

export const makeRecord = async (req: IncomingMessage) => {
  const forwardedForHeaders = Array.isArray(req.headers['x-forwarded-for']) ? req.headers['x-forwarded-for'][0] : req.headers['x-forwarded-for'] || '';
  const ip = forwardedForHeaders.split(',')[0] || req.socket.remoteAddress

  if (!ip || ip === '::ffff:127.0.0.1') return

  const location: ipInfo = await geoip.lookup(ip)

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
