import { api } from './visitor-counter/api.js'
import { db } from './visitor-counter/db.js'

const randomIP = () =>
  `${Math.floor(Math.random() * 255)}.${Math.floor(
    Math.random() * 255
  )}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`

const database = await db('mongodb://localhost:27017/')

export const run = () => {
  const data = [...Array(30000)]
    .map(() => api.createFromIP(randomIP()))
    .map(item => ({
      ...item,
      date: Math.floor(Date.now() - Math.random() * 10000000000),
    }))

  data.forEach(database.set)
}

run()
