document.addEventListener('DOMContentLoaded', function () {
  renderTopCountriesChart()
})

/**
 * Renders the top countries with the most Netflix shows.
 */
async function renderTopCountriesChart () {
  try {
    const data = await fetchTopCountriesData()
    renderCountryDistributionChart(data)
  } catch (error) {
    throw error('Error fetching data for top countries. Please try again.')
  }
}

/**
 * Fetches data for the top countries with the most Netflix shows.
 *
 * @returns {Promise<Array>} The data for top countries.
 */
async function fetchTopCountriesData () {
  try {
    const response = await fetch('https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1/media/top-countries')
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching top countries data:', error)
    throw error
  }
}

/**
 * Renders a pie chart to visualize the distribution of Netflix shows by top countries.¨
 *
 * @param {Array} data - The data for top countries.
 */
async function renderCountryDistributionChart (data) {
  const ctx = document.getElementById('topCountriesChart').getContext('2d')
  // Destroy existing Chart Instance to reuse <canvas> element
  const chartStatus = Chart.getChart('topCountriesChart')
  if (chartStatus !== undefined) {
    chartStatus.destroy()
  }

  const countries = data.map(entry => entry.country)
  const counts = data.map(entry => entry.count)

  window.myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: countries,
      datasets: [{
        label: 'Movies & Shows produced',
        data: counts,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(255, 0, 0, 0.2)',
          'rgba(0, 255, 0, 0.2)',
          'rgba(0, 0, 255, 0.2)',
          'rgba(255, 255, 0, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 0, 0, 1)',
          'rgba(0, 255, 0, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(255, 255, 0, 1)'
        ],
        borderWidth: 1
      }]
    }
  })
}
