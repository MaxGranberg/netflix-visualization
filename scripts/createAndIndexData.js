import { Client } from '@elastic/elasticsearch'
import csvtojson from 'csvtojson'
import path from 'path'
import { fileURLToPath } from 'url'

const client = new Client({
  node: process.env.REACT_APP_BONSAI_URL,
  apiVersion: '7.10'
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const datasetPath = path.join(__dirname, '..', 'netflix_titles.csv')

/**
 * Deletes an index in Elasticsearch.
 *
 * @param {string} indexName - The name of the index to delete.
 */
async function deleteIndex (indexName) {
  try {
    await client.indices.delete({ index: indexName })
    console.log(`Index ${indexName} deleted.`)
  } catch (error) {
    if (error.meta.body.error.type !== 'index_not_found_exception') {
      console.error('Error deleting index:', error)
    } else {
      console.log(`Index ${indexName} does not exist.`)
    }
  }
}

/**
 * Creates an index in Elasticsearch with predefined settings and mappings for the dataset.
 * The index will have a specified number of shards and replicas.
 */
async function createIndex () {
  const indexName = 'netflix_titles'
  try {
    await client.indices.create({
      index: indexName,
      body: {
        settings: {
          number_of_shards: 1,
          number_of_replicas: 1
        },
        mappings: {
          properties: {
            show_id: { type: 'keyword' },
            type: { type: 'keyword' },
            title: { type: 'text' },
            director: { type: 'text' },
            cast: { type: 'text' },
            country: { type: 'keyword' },
            date_added: { type: 'date', format: 'MMMM d, yyyy||yyyy-MM-dd' },
            release_year: { type: 'integer' },
            rating: { type: 'keyword' },
            duration: { type: 'text' },
            listed_in: { type: 'text' },
            description: { type: 'text' }
          }
        }
      }
    })
    console.log(`Index ${indexName} created.`)
  } catch (error) {
    console.error('Error creating index:', error)
  }
}

/**
 * Reads the dataset from the provided path and indexes it into the 'netflix_titles' index in Elasticsearch/Bonsai.
 * This script uses the bulk API for efficient indexing.
 */
async function indexData () {
  try {
    const dataset = await csvtojson().fromFile(datasetPath)
    console.log(`Total documents to index: ${dataset.length}`)

    const chunkSize = 1000
    for (let i = 0; i < dataset.length; i += chunkSize) {
      const chunk = dataset.slice(i, i + chunkSize)
      const body = chunk.flatMap(doc => {
        if (doc.date_added) {
          try {
            const parsedDate = new Date(doc.date_added)
            doc.date_added = !isNaN(parsedDate) ? parsedDate.toISOString().split('T')[0] : null
          } catch (e) {
            doc.date_added = null
          }
        } else {
          doc.date_added = null
        }
        return [{ index: { _index: 'netflix_titles', _id: doc.show_id } }, doc]
      })

      const response = await client.bulk({ refresh: true, body })

      if (response.errors) {
        console.log('Errors occurred during indexing:')
        for (const item of response.items) {
          if (item.index && item.index.error) {
            console.log(item.index.error)
          }
        }
      } else {
        console.log(`Chunk ${i / chunkSize + 1} indexed successfully.`, response.statusCode)
      }
    }

    console.log('All documents indexed successfully.')
  } catch (error) {
    console.error('Error indexing data:', error)
  }
}

/**
 * Verifies the total document count in the 'netflix_titles' index.
 */
async function verifyDataCount () {
  try {
    await client.indices.refresh({ index: 'netflix_titles' })
    const response = await client.count({ index: 'netflix_titles' })
    console.log('Total documents in netflix_titles index:', response.body.count)
  } catch (error) {
    console.error('Error verifying document count:', error)
  }
}

/**
 * Main function to orchestrate the index deletion, creation, data indexing, and verification.
 */
async function main () {
  await deleteIndex('netflix_titles')
  await createIndex()
  await indexData()
  await verifyDataCount()
}

main().catch(console.error)
