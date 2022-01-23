Demo:
https://counter.xxxxxxxxxx.xyz/

```js
// Example usage:
import http from 'http'
import { visitorCounter } from 'visitor-counter'

// init the package with a mongodb url
const stats = await visitorCounter({ mongourl: 'mongodb://localhost:27017/' })
        
const httpServer = http.createServer(async (req, res) => {
  // add recorder in request handler
  stats.record(req, res)
  
  // get stats somewhere in your app
  // range param can be either:
  // '2021,1,1' -> returns visitor count from date to now
  // '2021,1,1-2021,12,31' -> returns visitor count between dates
  // second | minute | hour | day | month | year -> helpers
  const lastMonthVisitors = await stats.range('month')
  
  res.end(JSON.stringify(lastMonthVisitors))
})

httpServer.listen(3333, () => console.log("running on http://localhost:3333"))
```
```js
// api
stats.record(req, res) // track visitor
stats.curretly()       // current number of visitors
stats.get()            // get all stats
stats.range(from, to)  // get stats within date range
```

options:
| Name     | Description                                           | Type   | Default                      |
|----------|-------------------------------------------------------|--------|------------------------------|
| mongourl | url to mongodb server                                 | String | 'mongodb://localhost:27017/' |
| id       | collections name prefix, when using multiple counters | String | 'default'                    |
| ttl      | time in ms between visitors are flushed               | Number | 3600000                      |
