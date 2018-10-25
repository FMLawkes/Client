const { createReadStream } = require('fs')
const express = require('express')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()
    server.get('/sw.js', (req, res) => {
      res.setHeader('content-type', 'text/javascript')
      createReadStream('./offline/serviceWorker.js').pipe(res)
    })
    server.get('*', (req, res) => {
      handle(req, res)
    })

    server.listen(3000, err => {
      if (err) throw err
      console.log('> Ready on http://localhost:3000')
    })
  })
  .catch(error => {
    console.error(error.stack)
  })
