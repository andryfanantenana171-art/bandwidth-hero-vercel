'use strict'
const express = require('express')
const authenticate = require('./src/authenticate')
const params = require('./src/params')
const proxy = require('./src/proxy')

const app = express()
const PORT = process.env.PORT || 8080

app.enable('trust proxy')
app.get('/', authenticate, params, proxy)
app.get('/favicon.ico', (req, res) => res.status(204).end())

// Vercel imports the app as a serverless handler; only listen when run directly (local / Heroku / etc.)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Listening on ${PORT}`))
}

module.exports = app
