import geoip from 'fast-geoip'
import { IncomingMessage } from 'http'
import { WithId } from 'mongodb'

const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

export type VisitorRecord = {
  ip: string,
  countryCode: string | false,
  country: string | false,
  date: number
}

export const makeRecord = async (req: IncomingMessage): Promise<VisitorRecord | undefined> => {
  const headers = req.headers['x-forwarded-for']
  const forwardedForHeaders = Array.isArray(headers) ? headers[0] : headers || '';
  const ip = forwardedForHeaders.split(',')[0] || req.socket.remoteAddress

  if (!ip || ip === '::ffff:127.0.0.1') return

  const location = await geoip.lookup(ip)

  return {
    ip,
    countryCode: location?.country || false,
    country: location ? getCountryName.of(location.country) : false,
    date: Date.now(),
  }
}

export const model = async (data: any[]) => ({
  total: data.length,
  countries: data.reduce((acc: any, { country }: VisitorRecord) => {
    return { ...acc, [country.toString()]: (acc[country.toString()] || 0) + 1 }
  }, {}),
  // data,
})
