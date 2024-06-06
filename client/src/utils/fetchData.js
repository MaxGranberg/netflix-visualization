export async function fetchData(type = '') {
  const params = new URLSearchParams();

  if (type.trim() !== '') {
    params.append('type', type);
  }

  try {
    const response = await fetch(`https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1/media/search?${params.toString()}`, {});
    const data = await response.json();

    // Detailed logging to understand the response structure
    console.log('Fetch data with filters response:', data);

    // Directly return the array if it's in the correct format
    if (Array.isArray(data)) {
      return data;
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

export async function fetchYearlyProductionData(type) {
  try {
    const response = await fetch(`https://netflix-visualization-ddbaf3e0356b.herokuapp.com/api/v1/media/yearly-production?type=${type}`, {
      method: 'GET'
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching yearly production data:', error);
    throw error;
  }
}
