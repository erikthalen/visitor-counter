import { db } from './visitor-counter/db.js'

const zero255 = () => Math.floor(Math.random() * 255)
const randomIP = () => `${zero255()}.${zero255()}.${zero255()}.${zero255()}`

const database = await db({
  mongourl: 'mongodb://localhost:27017/',
  id: 'demo-page',
})

export const makeSomeFakeVisitors = () => {
  ;[...Array(30000)].map(() => {
    const ip = randomIP()
    const location = geoip.lookup(ip)

    database.set({
      ip,
      country: location?.country || false,
      date: Math.floor(Date.now() - Math.random() * 10000000000),
    })
  })
}

makeSomeFakeVisitors()
