import geoip from 'geoip-lite'

export const makeRecord = req => {
  const ip =
    (req.headers['x-forwarded-for'] || '').split(',')[0] ||
    req.connection.remoteAddress

  if (!ip || ip === '::ffff:127.0.0.1') return

  const location = geoip.lookup(ip)

  return {
    ip,
    country: location?.country || false,
    date: Date.now(),
  }
}
