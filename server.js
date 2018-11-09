const express = require('express')
const next = require('next')

// const routes = require('./routes')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    // routes.forEach(route => {
    //   server.get(route, (req, res) => {
    //     handle(req, res)
    //   })
    // })

    server.get('/d/:id', (req, res) => {
      const actualPage = '/download'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
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
