# Visitor counter

Minimal effort way of tracking the amount of visitors on your website.  
Uses [Mongo DB](https://www.mongodb.com/) to store stats.

[![npm](https://img.shields.io/npm/v/visitor-counter)](https://www.npmjs.com/package/visitor-counter)
[![Downloads](https://img.shields.io/npm/dt/visitor-counter)](https://www.npmjs.com/package/visitor-counter)
[![Last commit](https://img.shields.io/github/last-commit/erikthalen/visitor-counter)](https://github.com/erikthalen/visitor-counter/commits/main)
[![Sponsors](https://img.shields.io/github/sponsors/erikthalen)](https://github.com/erikthalen)

## Demo:

https://counter.xxxxxxxxxx.xyz/

## Usage

```js
// Node http server
import http from 'http'
import visitorCounter from 'visitor-counter'

// init the package with a mongodb url
const stats = await visitorCounter({ mongourl: 'mongodb://localhost:27017/' })

const httpServer = http.createServer(async (req, res) => {
  // add recorder in request handler
  await stats.record(req, res)

  // get stats somewhere in your app
  // param can be either:
  // '2021,1,1' -> returns visitor count from date to now
  // '2021,1,1-2021,12,31' -> returns visitor count between dates
  // second | minute | hour | day | week | month | year -> helpers
  const lastMonthVisitors = await stats.get('month')

  res.end(JSON.stringify(lastMonthVisitors))
})

httpServer.listen(3333, () => console.log('running on http://localhost:3333'))
```

```js
// Express
import express from 'express'
import visitorCounter from 'visitor-counter'
const app = express()
const stats = await visitorCounter()

app.use(await stats.record)

app.get('/', async (req, res) => {
  res.send(JSON.stringify(await stats.get('month')))
})

app.listen(3000)
```

## API

```js
await stats.record(req, res) // track visitor
await stats.get() // get all stats
await stats.get(from, to) // get stats within date range
await stats.visitors() // get current amount of visitors
```

options:
| Name | Description | Type | Default |
|----------|-------------------------------------------------------|--------|------------------------------|
| `mongourl` | url to mongodb server | String | `'mongodb://localhost:27017'` |
| `id` | collections name prefix, when using multiple counters | String | `'default'` |
| `ttl` | time in seconds between visitors are flushed | Number | `3600` |
| `dbName` | Name of the database to store stats in | String | `'visitor-counter-db'` |
| `cookieKey` | Key of coolie to store visitor id under | String | `'visitor-counter-id'` |
