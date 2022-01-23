```js
// Example usage:
import http from 'http'
import { metrics } from 'metrics'

// init the package with a mongodb url
const stats = await metrics({ mongourl: 'mongodb://localhost:27017/' })

const httpServer = http.createServer(async (req, res) => {
  // add recorder in request handler
  stats.record(req, res)

  // get stats somewhere in your app
  // range param can be either:
  // '2021,1,1' -> returns visitor count from date to now
  // '2021,1,1-2021,12,31' -> returns visitor count between dates
  // second | minute | hour | day | month | year -> helpers
  res.end(await range('month'))
})

httpServer.listen(3333, () => console.log('running on http://localhost:3333'))

// api
metrics.record(req, res) // track visitor
metrics.curretly()       // current number of visitors
metrics.get()            // get all stats
metrics.range(from, to)  // get stats within date range
```
