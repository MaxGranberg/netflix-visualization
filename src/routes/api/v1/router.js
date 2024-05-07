/**
 * API version 1 routes.
 *
 * @author Max Granberg
 * @version 1.0.0
 */

import express from 'express'
import { router as mediaRouter } from './mediaRoutes.js'

export const router = express.Router()

router.get('/', (req, res) => res.json({ message: 'Hooray! Welcome to version 1 of this very simple RESTful API!' }))
router.use('/media', mediaRouter)
