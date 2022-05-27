import { db } from '../lib/db.mjs'
import { createModel } from '../lib/api.mjs'

const zero255 = () => Math.floor(Math.random() * 255)
const randomIP = () => `${zero255()}.${zero255()}.${zero255()}.${zero255()}`

const database = await db({
  mongourl: 'mongodb://127.0.0.1:27017',
  id: 'default',
})

const COUNT = 10000

const fakeIt = () => {
  return Promise.all(
    [...Array(COUNT)].map(async (_, i) => {
      const ip = randomIP()

      await database.set(
        await createModel(ip, Math.floor(Date.now() - Math.random() * 10000000000))
      )

      console.clear()
      console.log(`Created ${i} fake users`)
    })
  )
}

try {
  await fakeIt()
  console.log(`Done creating ${COUNT} fake users`)
} catch (error) {
  console.log('Error creating fake visitors:', error)
}

process.exit(0)
