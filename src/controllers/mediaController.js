/* eslint-disable camelcase */
/**
 * Defines the MediaController class.
 *
 * @author Max Granberg
 * @version 1.0.0
 */

import { elasticsearchService } from '../services/elasticsearchService.js'

/**
 * Encapsulates a controller.
 */
export class MediaController {
  /**
   * Sends a JSON response containing all movies and tv-shows.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getAllMedia (req, res, next) {
    try {
      const { type, title, listed_in, release_year, limit, offset } = req.query
      const media = await elasticsearchService.search({
        type,
        title,
        genre: listed_in,
        year: release_year,
        limit,
        offset
      })
      res.json(media)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing the search results for movies and tv-shows based on the user's query.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async searchMedia (req, res, next) {
    try {
      const { title, type, year } = req.query
      const results = await elasticsearchService.search({ title, type, year })
      res.json(results)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing the top countries with the most Netflix shows.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getTopCountries (req, res, next) {
    try {
      const topCountries = await elasticsearchService.fetchTopCountries()
      res.json(topCountries)
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a JSON response containing the yearly production data.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async getYearlyProduction (req, res, next) {
    try {
      const { type } = req.query
      const yearlyProduction = await elasticsearchService.fetchYearlyProduction(type)
      res.json(yearlyProduction)
    } catch (error) {
      next(error)
    }
  }
}
