import geoip from 'fast-geoip'
import { db } from '../lib/db.mjs'

const zero255 = () => Math.floor(Math.random() * 255)
const randomIP = () => `${zero255()}.${zero255()}.${zero255()}.${zero255()}`
const getCountryName = new Intl.DisplayNames(['en'], { type: 'region' })

const database = await db({
  mongourl: 'mongodb://localhost:27017/',
})

const COUNT = 10000

const fakeIt = () => {
  return Promise.all(
    [...Array(COUNT)].map(async () => {
      const ip = randomIP()
      const location = await geoip.lookup(ip)

      return await database.set({
        ip,
        countryCode: location?.country || false,
        country: location ? getCountryName.of(location.country) : false,
        date: Math.floor(Date.now() - Math.random() * 10000000000),
      })
    })
  )
}

try {
  const res = await fakeIt()
  console.log(`Done creating ${COUNT} fake users`)
} catch (error) {
  console.log('Error creating fake visitors:', error)
}

process.exit(0)
