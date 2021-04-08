const express = require('express')
import { Request, Response } from 'express'
const Sentry = require('@sentry/node')
require('dotenv').config()
const Tracing = require('@sentry/tracing')
const cors = require('cors')
const app = express()
if (process.env.NODE_ENV != 'test') {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app })
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  })
}
require('./db/mongo')
const notFound = require('./middlewares/notFound')
const handleErrors = require('./middlewares/handleErrors')
const logger = require('./middlewares/loggerMiddleware')
const peopleRouter = require('./controllers/people')
const postRouter = require('./controllers/posts')

app.use(cors())
app.use(express.json())
app.use(logger)

if (process.env.NODE_ENV != 'test') {
  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler())
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler())
}

app.get('/', (request: Request, response: Response) => {
  response.send('<h1>Hi from dev Portfolio v1.0.0</h1>')
})

app.use('/api/people', peopleRouter)
app.use('/api/posts', postRouter)

if (process.env.NODE_ENV != 'test') {
  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler())
}

app.use(handleErrors)
app.use(notFound)

const PORT = process.env.PORT || 3001
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`)
})
module.exports = { app, server }
