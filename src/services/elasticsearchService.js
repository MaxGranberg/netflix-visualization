import { Client } from '@elastic/elasticsearch'

/**
 * ElasticsearchService class that provides methods to interact with Elasticsearch.
 */
export class ElasticsearchService {
  /**
   * Initializes a new instance of the Elasticsearch client.
   */
  constructor () {
    this.client = new Client({
      node: 'https://ecr1djz29:l95eu2pa4k@netflix-visualizatio-4529248334.eu-central-1.bonsaisearch.net:443',
      apiVersion: '7.10'
    })
  }

  /**
   * Searches media items in Elasticsearch based on provided criteria.
   *
   * @param {object} params - The search parameters.
   * @returns {Promise<Array>} The search results.
   */
  async search (params) {
    const { type, title, genre, year, query } = params

    console.log('Received params:', params)
    const searchQuery = {
      bool: {
        must: [],
        filter: []
      }
    }

    if (type && type.trim() !== '') {
      searchQuery.bool.must.push({ match: { type } })
    }
    if (title && title.trim() !== '') {
      searchQuery.bool.must.push({ match: { title: { query: title, operator: 'and', fuzziness: 'AUTO' } } })
    }
    if (genre && genre.trim() !== '') {
      searchQuery.bool.filter.push({ term: { 'listed_in.keyword': genre } })
    }
    if (year && year.trim() !== '') {
      searchQuery.bool.filter.push({ range: { release_year: { gte: year, lte: year } } })
    }
    if (query && query.trim() !== '') {
      searchQuery.bool.must.push({ multi_match: { query, fields: ['title^2', 'description', 'cast', 'director'] } })
    }

    console.log('Constructed search query:', JSON.stringify(searchQuery, null, 2))

    const allResults = []
    let from = 0
    const size = 100
    let totalHits = null

    try {
      do {
        const { body } = await this.client.search({
          index: 'netflix_titles',
          from,
          size,
          body: {
            query: searchQuery
          }
        })

        console.log('Elasticsearch response:', body)

        if (body.hits && Array.isArray(body.hits.hits)) {
          allResults.push(...body.hits.hits.map(hit => hit._source))
          totalHits = body.hits.total.value
          from += size
          console.log(`Fetched ${allResults.length} of ${totalHits} total results`)
        } else {
          console.error('Unexpected Elasticsearch response format:', body)
          throw new Error('Unexpected Elasticsearch response format')
        }
      } while (from < totalHits)

      return allResults
    } catch (error) {
      console.error('Error searching Elasticsearch:', error)
      throw error
    }
  }

  /**
   * Fetches the top countries with the most Netflix shows from Elasticsearch.
   *
   * @returns {Promise<Array>} The data for top countries.
   */
  async fetchTopCountries () {
    try {
      const { body } = await this.client.search({
        index: 'netflix_titles',
        body: {
          size: 0,
          aggs: {
            countries: {
              terms: {
                field: 'country',
                size: 10,
                missing: 'Unknown'
              }
            }
          }
        }
      })

      console.log('Elasticsearch top countries response:', JSON.stringify(body, null, 2))

      if (body.aggregations && body.aggregations.countries && body.aggregations.countries.buckets) {
        const countriesData = body.aggregations.countries.buckets.map(bucket => ({
          country: bucket.key,
          count: bucket.doc_count
        }))

        console.log('Parsed countries data:', countriesData)
        return countriesData
      } else {
        console.error('Aggregation response structure is not as expected:', body)
        return []
      }
    } catch (error) {
      console.error('Error fetching top countries from Elasticsearch:', error)
      throw error
    }
  }

  /**
   * Fetches the yearly production data from Elasticsearch.
   *
   * @param {string} type - The type of media (optional).
   * @returns {Promise<Array>} The yearly production data.
   */
  async fetchYearlyProduction (type = '') {
    try {
      const searchQuery = {
        bool: {
          must: [],
          filter: []
        }
      }

      if (type && type.trim() !== '') {
        searchQuery.bool.must.push({ match: { type } })
      }

      const { body } = await this.client.search({
        index: 'netflix_titles',
        size: 0,
        body: {
          query: searchQuery,
          aggs: {
            yearly_production: {
              terms: {
                field: 'release_year',
                size: 100,
                order: { _key: 'asc' }
              }
            }
          }
        }
      })

      if (body.aggregations && body.aggregations.yearly_production && body.aggregations.yearly_production.buckets) {
        const yearlyData = body.aggregations.yearly_production.buckets.map(bucket => ({
          year: bucket.key,
          count: bucket.doc_count
        }))

        return yearlyData
      } else {
        console.error('Aggregation response structure is not as expected:', body)
        return []
      }
    } catch (error) {
      console.error('Error fetching yearly production from Elasticsearch:', error)
      throw error
    }
  }
}

export const elasticsearchService = new ElasticsearchService()
