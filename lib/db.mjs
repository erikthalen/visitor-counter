import { MongoClient } from 'mongodb'

export const db = ({ mongourl, dbName, id, ttl } = {}) => {
  return new Promise(resolve => {
    const url = mongourl.endsWith('/') ? mongourl.slice(0, -1) : mongourl

    MongoClient.connect(`${url}/${dbName}`, async (err, db) => {
      if (err) throw err

      const dbo = db.db(dbName)

      const database = dbo.collection(`visitors-${id}`)
      const visitors = dbo.collection(`visitors-${id}-current`)

      visitors.dropIndexes()
      visitors.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl })
      
      resolve({
        setTTL: ttl => {
          visitors.dropIndexes()
          visitors.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl })
        },
        setVisitor: id => visitors.insertOne({ id, createdAt: new Date() }),
        getVisitor: async id => await visitors.findOne({ id }),
        getVisitorCount: async () =>
          new Promise(resolve => {
            visitors.count({}, (err, count) => {
              if (err) {
                db.close()
                throw err
              }
              resolve(count)
            })
          }),
        set: obj => obj && database.insertOne(obj),
        get: (obj = {}) =>
          new Promise(resolve => {
            database
              .find(obj, { projection: { _id: 0 } })
              .toArray((err, result) => {
                if (err) {
                  db.close()
                  throw err
                }
                resolve(result)
              })
          }),
      })
    })
  })
}
