import { getClientIp } from '@supercharge/request-ip'
import geoip from 'geoip-lite'

const dataModel = req => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection.remoteAddress ||
    getClientIp(req)

  if (!ip) return

  const location = geoip.lookup(ip)

  return {
    ip,
    country: location?.country || false,
    date: Date.now(),
  }
}

export const api = {
  create: req => dataModel(req),
  // createFromIP: ip => dataModel(ip),
}
