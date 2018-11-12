const express = require('express')
const next = require('next')
const axios = require('axios')
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
      const title = 'Download From Drive'
      const queryParams = { id: req.params.id, title }
      app.render(req, res, actualPage, queryParams)
    })

    server.get('/files', (req, res) => {
      const actualPage = '/files'
      const title = 'My Files'
      const queryParams = { title }
      handle(req, res, actualPage, queryParams)
    })

    server.get('/upload', (req, res) => {
      const actualPage = '/upload'
      const title = 'Upload Files'
      const queryParams = { title }
      handle(req, res, actualPage, queryParams)
    })

    server.get('/copyright', (req, res) => {
      const actualPage = '/copyright'
      const title = 'Copyright Policy'
      const queryParams = { title }
      handle(req, res, actualPage, queryParams)
    })

    server.get('/terms', (req, res) => {
      const actualPage = '/terms'
      const title = 'Terms & Conditions'
      const queryParams = { title }
      handle(req, res, actualPage, queryParams)
    })

    server.get('/privacy', (req, res) => {
      const actualPage = '/privacy'
      const title = 'Privacy Policy'
      const queryParams = { title }
      handle(req, res, actualPage, queryParams)
    })

    server.get('/:id', async (req, res) => {
      const { data } = await axios.get('https://api.anifiles.org/three', {
        params: {
          q: req.params.id
        }
      })
      const actualPage = '/download'
      const title = data && data.data ? data.data.filename : 'Not Found'
      const queryParams = { id: req.params.id, title }
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
