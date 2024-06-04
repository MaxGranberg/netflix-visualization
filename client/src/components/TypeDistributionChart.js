import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { fetchData } from '../utils/fetchData';

const TypeDistributionChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [type, setType] = useState('');

  const handleFetchData = async () => {
    try {
      const result = await fetchData(type);
      console.log(result)
      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.error('Fetched data is not an array:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [type, chartType]);

  useEffect(() => {
    if (chartRef.current) {
      const ctx = chartRef.current.getContext('2d');
      const chartStatus = Chart.getChart(ctx);
      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      if (data.length === 0) {
        return;
      }

      const groupedData = data.reduce((acc, { release_year }) => {
        acc[release_year] = (acc[release_year] || 0) + 1;
        return acc;
      }, {});

      const years = Object.keys(groupedData);
      const counts = Object.values(groupedData);

      new Chart(ctx, {
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
      });
    }
  }, [data, chartType]);

  return (
    <div className="container mx-auto mt-10 mb-10 p-5 rounded shadow bg-white">
      <h1 className="text-xl text-center font-bold mb-4">Netflix Shows Data Visualization</h1>
      <div id="controls" className="flex flex-wrap justify-center gap-4 mb-4">
        <select value={type} onChange={(e) => setType(e.target.value)} className="form-select px-4 py-2 border rounded">
          <option value="">Movies & TV Shows</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="form-select px-4 py-2 border rounded">
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
      </div>
      <div id="chartContainer">
        <canvas ref={chartRef} id="typeDistributionChart"></canvas>
      </div>
    </div>
  );
};

export default TypeDistributionChart;
