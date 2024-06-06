import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { fetchTopCountriesData } from '../utils/fetchData';

const TopCountriesChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchTopCountriesData();
        // Replace empty country names with "No country specified"
        const modifiedData = result.map(entry => ({
          ...entry,
          country: entry.country.trim() === '' ? 'No country specified' : entry.country
        }));
        setData(modifiedData);
      } catch (error) {
        console.error('Error fetching data for top countries. Please try again.', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chartStatus = Chart.getChart(ctx);
      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      const countries = data.map(entry => entry.country);
      const counts = data.map(entry => entry.count);

      new Chart(ctx, {
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
      });
    }
  }, [data]);

  return (
    <div className="container mx-auto mt-10 mb-10 p-5 rounded shadow bg-white">
      <h1 className="text-xl text-center font-bold mb-4">Top Producing Countries on Netflix</h1>
      <div id="countriesChartContainer">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default TopCountriesChart;
