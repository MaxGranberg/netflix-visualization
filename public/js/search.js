document.addEventListener('DOMContentLoaded', () => {
  const searchButton = document.getElementById('searchButton')
  searchButton.addEventListener('click', performSearch)
})

/**
 *
 */
async function fetchData (title = '', type = '', year = '') {
  const params = new URLSearchParams()

  if (title.trim() !== '') {
    params.append('title', title)
  }
  if (type.trim() !== '') {
    params.append('type', type)
  }
  if (year.trim() !== '') {
    params.append('year', year)
  }

  try {
    const response = await fetch(`https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1/media/search?${params.toString()}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

/**
 *
*/
async function performSearch () {
  const title = document.getElementById('searchBox').value
  const type = document.getElementById('typeFilter').value
  const year = document.getElementById('yearFilter').value

  const data = await fetchData(title, type, year)
  displayResults(data)
}

/**
 * Display the results based on the search. Tailwind classes for styling.
 *
 * @param {Array} data - The data to display
 */
function displayResults (data) {
  const resultsContainer = document.getElementById('searchResults')
  resultsContainer.textContent = '' // Clear previous results

  if (data.length === 0) {
    resultsContainer.textContent = 'No results found.'
    resultsContainer.classList.add('text-red-500', 'text-lg', 'text-center')
    return;
  } else {
    resultsContainer.classList.remove('text-red-500', 'text-lg', 'text-center')
  }

  const ul = document.createElement('ul')
  ul.classList.add('list-disc', 'pl-5', 'space-y-2')
  data.forEach(item => {
    const li = document.createElement('li')
    li.textContent = `${item.title} (${item.release_year}) - ${item.type}`
    li.classList.add('bg-white', 'p-2', 'rounded', 'shadow', 'hover:bg-gray-100')
    ul.appendChild(li)
  })
  resultsContainer.appendChild(ul)
}
