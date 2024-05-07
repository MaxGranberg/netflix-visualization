/**
 *
 */
async function fetchData (type = '') {
  const params = new URLSearchParams()

  if (type.trim() !== '') {
    params.append('type', type)
  }

  try {
    const response = await fetch(`http://localhost:8080/api/v1/media/search?${params.toString()}`)
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
async function renderTypeDistributionChart (data, chartType = 'bar') {
  const ctx = document.getElementById('typeDistributionChart').getContext('2d')
  // JS - Destroy exiting Chart Instance to reuse <canvas> element
  const chartStatus = Chart.getChart('typeDistributionChart')
  if (chartStatus !== undefined) {
    chartStatus.destroy()
  }

  const groupedData = data.reduce((acc, { release_year }) => {
    acc[release_year] = (acc[release_year] || 0) + 1
    return acc
  }, {})

  const years = Object.keys(groupedData)
  const counts = Object.values(groupedData)

  window.myChart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: years,
      datasets: [{
        label: 'Number of Titles Released Each Year',
        data: counts,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
        fill: chartType !== 'line'
      }]
    }
  })
}

/**
 * Setup and add event listeners.
 */
document.addEventListener('DOMContentLoaded', () => {
  const typeFilter = document.getElementById('typeFilter')
  const chartTypeSelect = document.getElementById('chartTypeSelect')

  /**
   *
   */
  const performSearch = async () => {
    const data = await fetchData(typeFilter.value)
    renderTypeDistributionChart(data, chartTypeSelect.value)
  }

  typeFilter.addEventListener('change', performSearch)
  chartTypeSelect.addEventListener('change', () => performSearch()) // Update chart when type changes

  // Initial fetch and render
  performSearch()
})
