import { MongoClient, WithId } from 'mongodb'
import { VisitorRecord } from './api'

type DBParams = {
  mongourl: string,
  dbName: string,
  id: string,
  ttl: number
}

type DBType = {
  setTTL: (ttl: number) => void,
  setVisitor: (id: string) => void,
  getVisitor: (id: string) => Promise<WithId<Document> | null>,
  getVisitorCount: () => Promise<number | undefined>,
  set: (obj: VisitorRecord | undefined) => void,
  get: (obj?: any) => Promise<WithId<Document>[]>
}

export const db = ({ mongourl, dbName, id, ttl }: DBParams): Promise<DBType> => {
  return new Promise(resolve => {
    const url = mongourl.endsWith('/') ? mongourl.slice(0, -1) : mongourl

    MongoClient.connect(`${url}/${dbName}`, async (err, db) => {
      if (err || !db) throw err

      const dbo = db.db(dbName)

      const database = dbo.collection(`visitors-${id}`)
      const visitors = dbo.collection(`visitors-${id}-current`)

      visitors.dropIndexes()
      visitors.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl })

      resolve({
        setTTL: (ttl: number) => {
          visitors.dropIndexes()
          visitors.createIndex({ createdAt: 1 }, { expireAfterSeconds: ttl })
        },
        setVisitor: (id: string) => visitors.insertOne({ id, createdAt: new Date() }),
        getVisitor: async (id: string): Promise<any> => await visitors.findOne({ id }),
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
        set: (obj: VisitorRecord | undefined) => obj && database.insertOne(obj),
        get: async (obj = {}): Promise<any[]> =>
          new Promise(resolve => {
            database
              .find(obj, { projection: { _id: 0 } })
              .toArray((err, result) => {
                if (err) {
                  db.close()
                  throw err
                }
                resolve(result as any)
              })
          }),
      })
    })
  })
}
