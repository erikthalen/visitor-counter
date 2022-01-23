import { getClientIp } from '@supercharge/request-ip'
import geoip from 'geoip-lite'

const dataModel = ip => {
  const location = geoip.lookup(ip)

  return {
    ip,
    country: location?.country || false,
    date: Date.now(),
  }
}

export const api = {
  create: req => dataModel(getClientIp(req)),
  createFromIP: ip => dataModel(ip),
}
