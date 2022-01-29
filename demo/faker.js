import geoip from 'fast-geoip'
import { db } from '../lib/db.js'

const zero255 = () => Math.floor(Math.random() * 255)
const randomIP = () => `${zero255()}.${zero255()}.${zero255()}.${zero255()}`
const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

const database = await db({
  mongourl: 'mongodb://localhost:27017/',
  id: 'default',
  dbName: 'visitor-counter-db',
  ttl: 3600
})

const fakeIt = () => {
  ;[...Array(10000)].map(async () => {
    const ip = randomIP()
    const location = await geoip.lookup(ip)

    await database.set({
      ip,
      countryCode: location?.country || false,
      country: location ? getCountryName.of(location.country) : false,
      date: Math.floor(Date.now() - Math.random() * 1000000000000),
    })
  })
}

fakeIt()
