const express = require('express')
const next = require('next')
require('dotenv').config()

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app
  .prepare()
  .then(() => {
    const server = express()

    server.get('/d/:id', (req, res) => {
      const actualPage = '/download-drive'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('/files', (req, res) => {
      handle(req, res)
    })

    server.get('/upload', (req, res) => {
      handle(req, res)
    })

    server.get('/copyright', (req, res) => {
      handle(req, res)
    })

    server.get('/terms', (req, res) => {
      handle(req, res)
    })

    server.get('/privacy', (req, res) => {
      handle(req, res)
    })

    server.get('/:id', (req, res) => {
      const actualPage = '/download'
      const queryParams = { id: req.params.id }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('*', (req, res) => {
      handle(req, res)
    })

    server.listen(process.env.PORT, err => {
      if (err) throw err
      console.log(`> Ready on http://localhost:${process.env.PORT}`)
    })
  })
  .catch(error => {
    console.error(error.stack)
  })
