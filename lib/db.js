import { MongoClient } from 'mongodb'

export const db = ({
  mongourl = 'mongodb://localhost:27017/',
  dbName = 'visitor-counter-db',
  id,
} = {}) => {
  return new Promise(resolve => {
    MongoClient.connect(`${mongourl}${dbName}`, (err, db) => {
      if (err) throw err

      const dbo = db.db(dbName)
      const database = dbo.collection(`visitors-${id}`)

      resolve({
        set: obj => obj && database.insertOne(obj),
        get: (obj = {}) =>
          new Promise(resolve => {
            database
              .find(obj, { projection: { _id: 0 } })
              .toArray((err, result) => {
                if (err) throw err
                resolve(result)
              })
          }),
      })
    })
  })
}
