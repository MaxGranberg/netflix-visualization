/**
 * The starting point of the application.
 *
 * @author Max Granberg
 * @version 1.0.0
 */

import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import logger from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import bodyParser from 'body-parser'
import { router } from './routes/router.js'

try {
  const app = express()
  const __dirname = path.dirname(fileURLToPath(import.meta.url))

  // Set various HTTP headers to make the application little more secure (https://www.npmjs.com/package/helmet).
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        styleSrc: ["'self'", 'https://cdn.jsdelivr.net', "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'", 'https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1']
      }
    }
    // Other Helmet options...
  }))

  // Enable CORS for the server
  app.use(cors({ origin: ['', 'https://netflix-visualization-ddbaf3e0356b.herokuapp.com/', 'http://localhost:3000'], credentials: true }))

  // Set up a morgan logger using the dev format for log entries.
  app.use(logger('dev'))

  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '..', 'client/build')))

  // Parse requests of the content type application/json.
  app.use(express.json())

  app.use(bodyParser.json())

  // Register routes.
  app.use('/', router)

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'))
  })

  // Error handler.
  app.use(function (err, req, res, next) {
    err.status = err.status || 500

    if (req.app.get('env') !== 'development') {
      return res
        .status(err.status)
        .json({
          status: err.status,
          message: err.message
        })
    }

    // Development only!
    // Only providing detailed error in development.
    return res
      .status(err.status)
      .json({
        status: err.status,
        message: err.message,
        cause: err.cause
          ? {
              status: err.cause.status,
              message: err.cause.message,
              stack: err.cause.stack
            }
          : null,
        stack: err.stack
      })
  })

  const PORT = process.env.PORT || 3000
  // Starts the HTTP server listening for connections.
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
} catch (err) {
  console.error(err)
  process.exitCode = 1
}
