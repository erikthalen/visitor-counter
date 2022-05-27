import { MongoClient } from 'mongodb'

export const db = ({
  mongourl,
  dbName = 'visitor-counter',
  id,
  ttl = 3600,
} = {}) => {
  return new Promise(resolve => {
    const url = mongourl.endsWith('/') ? mongourl.slice(0, -1) : mongourl

    MongoClient.connect(`${url}/${dbName}`, async (err, db) => {
      if (err) throw err

      const dbo = db.db(dbName)

      const database = dbo.collection(id)
      const visitors = dbo.collection(`${id}-current`)

      try {
        // visitors.dropIndexes()
        visitors.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl })
      } catch (error) {
        console.log(error)
      }

      resolve({
        setTTL: ttl => {
          try {
            visitors.dropIndexes()
            visitors.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl })
          } catch (error) {
            console.log(error)
          }
        },
        setVisitor: id => {
          try {
            return visitors.insertOne({ id, createdAt: new Date() })
          } catch (error) {
            console.log(error)
          }
        },
        getVisitor: async id => {
          try {
            return await visitors.findOne({ id })
          } catch (error) {
            console.log(error)
          }
        },
        getVisitorCount: async () =>
          new Promise((resolve, reject) => {
            visitors.count({}, (error, count) => {
              if (error) {
                db.close()
                reject(error)
              }
              resolve(count)
            })
          }),
        set: obj => {
          try {
            if (obj) return database.insertOne(obj)
          } catch (error) {
            console.log(error)
          }
        },
        get: (obj = {}) =>
          new Promise((resolve, reject) => {
            database
              .find(obj, { projection: { _id: 0 } })
              .toArray((error, result) => {
                if (error) {
                  db.close()
                  reject(error)
                }
                resolve(result)
              })
          }),
      })
    })
  })
}
