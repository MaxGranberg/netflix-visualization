import { Client } from '@elastic/elasticsearch'
import csvtojson from 'csvtojson'
import path from 'path'
import { fileURLToPath } from 'url'

const client = new Client({
  node: 'https://localhost:9200',
  auth: {
    username: 'elastic',
    password: process.env.ELASTIC_PASSWORD
  },
  tls: {
    rejectUnauthorized: false // This is not recommended in production
  }
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const datasetPath = path.join(__dirname, '..', 'netflix_titles.csv')

/**
 * Reads the dataset from the provided path and indexes it into the 'netflix_titles' index in Elasticsearch.
 * This script uses the bulk API for efficient indexing.
 */
async function indexData () {
  const dataset = await csvtojson().fromFile(datasetPath)

  const body = dataset.flatMap(doc => {
    // Preprocess the data as needed
    // Convert the date_added to a proper ISO format if necessary or keep it as is if it matches the Elasticsearch date format
    if (doc.date_added) {
      try {
        // Parse the date and convert it to ISO format
        const parsedDate = new Date(doc.date_added)
        if (!isNaN(parsedDate)) {
          doc.date_added = parsedDate.toISOString()
        } else {
          // If the date can't be parsed, set it to null or leave it as is
          doc.date_added = null
        }
      } catch (e) {
        // If there's an error in parsing the date, set it to null or leave it as is
        doc.date_added = null
      }
    } else {
      // If the date_added is empty, set it to null
      doc.date_added = null
    }

    return [{ index: { _index: 'netflix_titles', _id: doc.show_id } }, doc]
  })

  const response = await client.bulk({ refresh: true, body })
  console.log(response.errors)

  // First, check the response status.
  if (response.statusCode >= 400) {
    console.error(`Unexpected status code: ${response.statusCode}`)
  } else if (response.errors) {
    console.log('Errors occurred during indexing:')

    for (const item of response.items) {
      if (item.index && item.index.error) {
        console.log(item.index.error)
      }
    }
  } else {
    console.log('All documents indexed successfully.')
  }
}

await indexData().catch(console.error)
