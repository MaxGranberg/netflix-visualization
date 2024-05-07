import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: process.env.ELASTIC_NODE,
  auth: {
    apiKey: process.env.API_KEY
  }
})

/**
 * Creates an index in Elasticsearch with predefined settings and mappings for the dataset.
 * The index will have a specified number of shards and replicas.
 */
async function createIndex () {
  const indexName = 'netflix_titles'

  // Check if the index already exists
  const { body: indexExists } = await client.indices.exists({ index: indexName })

  if (indexExists) {
    console.log(`Index ${indexName} already exists.`)
  } else {
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
            date_added: { type: 'date', format: 'MMMM d, yyyy' },
            release_year: { type: 'date' },
            rating: { type: 'keyword' },
            duration: { type: 'text' },
            listed_in: { type: 'text' },
            description: { type: 'text' }
          }
        }
      }
    })
    console.log(`Index ${indexName} created.`)
  }
}

await createIndex().catch(console.error)
