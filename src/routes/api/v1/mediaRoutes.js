/**
 * Defines the media router.
 *
 * @author Max Granberg
 * @version 1.0.0
 */
import express from 'express'
import { MediaController } from '../../../controllers/mediaController.js'

export const router = express.Router()

const controller = new MediaController()

router.get('/search', controller.searchMedia)
router.get('/top-countries', controller.getTopCountries)
router.get('/yearly-production', controller.getYearlyProduction)
