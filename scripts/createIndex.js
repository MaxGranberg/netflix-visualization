import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: 'https://ecr1djz29:l95eu2pa4k@netflix-visualizatio-4529248334.eu-central-1.bonsaisearch.net:443',
  apiVersion: '7.10'
})

/**
 * Creates an index in Elasticsearch with predefined settings and mappings for the dataset.
 * The index will have a specified number of shards and replicas.
 */
async function createIndex () {
  const indexName = 'netflix_titles'

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

await createIndex().catch(console.error)
