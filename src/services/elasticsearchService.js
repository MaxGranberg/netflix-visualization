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
      searchQuery.bool.filter.push({ term: { 'type.keyword': type } })
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

    const allResults = []
    let from = 0
    const size = 100 // Can adjust this size
    let totalHits = null

    do {
      const response = await this.client.search({
        index: 'netflix_titles',
        from,
        size,
        body: {
          query: searchQuery
        }
      })

      allResults.push(...response.hits.hits.map(hit => hit._source))
      from += size
      totalHits = response.hits.total.value
    } while (from < totalHits)

    return allResults
  }

  /**
   * Fetches the top countries with the most Netflix shows from Elasticsearch.
   *
   * @returns {Promise<Array>} The data for top countries.
   */
  async fetchTopCountries () {
    try {
      const response = await this.client.search({
        index: 'netflix_titles',
        body: {
          size: 0,
          aggs: {
            countries: {
              terms: {
                field: 'country.keyword',
                size: 10
              }
            }
          }
        }
      })

      return response.aggregations.countries.buckets.map(bucket => ({
        country: bucket.key,
        count: bucket.doc_count
      }))
    } catch (error) {
      console.error('Error fetching top countries from Elasticsearch:', error)
      throw error
    }
  }
}

export const elasticsearchService = new ElasticsearchService()
