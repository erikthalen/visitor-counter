import { getClientIp } from '@supercharge/request-ip'
import geoip from 'geoip-lite'

const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

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

  getCountries: stats => {
    const result = stats.reduce((acc, { country }) => {
      const name = country ? getCountryName.of(country) : false
      return {
        ...acc,
        [name]: (acc[name] || 0) + 1,
      }
    }, {})

    return result
  },
}
