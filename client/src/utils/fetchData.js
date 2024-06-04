export async function fetchData(type = '') {
  const params = new URLSearchParams();

  if (type.trim() !== '') {
    params.append('type', type);
  }

  try {
    const response = await fetch(`https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1/media/search?${params.toString()}`, {
    });
    const data = await response.json();
     // Detailed logging to understand the response structure
     console.log('Fetch data with filters response:', data);

    // Check if data.hits and data.hits.hits are present
    if (data.hits && Array.isArray(data.hits.hits)) {
      return data.hits.hits.map(hit => hit._source); // Return the _source of each hit
    } else {
      console.error('Unexpected data format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export async function fetchDataWithFilters(title = '', type = '', year = '') {
  const params = new URLSearchParams();

  if (title.trim() !== '') {
    params.append('title', title);
  }
  if (type.trim() !== '') {
    params.append('type', type);
  }
  if (year.trim() !== '') {
    params.append('year', year);
  }

  try {
    const response = await fetch(`https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1/media/search?${params.toString()}`, {
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

export async function fetchTopCountriesData() {
  try {
    const response = await fetch('https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1/media/top-countries', {
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching top countries data:', error);
    throw error;
  }
}
