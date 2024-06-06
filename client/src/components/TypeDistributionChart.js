import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import { fetchYearlyProductionData } from '../utils/fetchData';

const TypeDistributionChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('bar');
  const [type, setType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchYearlyProductionData(type);
      if (Array.isArray(result)) {
        setData(result);
      } else {
        console.error('Fetched data is not an array:', result);
        setData([]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchData();
  }, [type, chartType]);

  useEffect(() => {
    if (chartRef.current && !loading) {
      const ctx = chartRef.current.getContext('2d');
      const chartStatus = Chart.getChart(ctx);
      if (chartStatus !== undefined) {
        chartStatus.destroy();
      }

      if (data.length === 0) {
        return;
      }

      const years = data.map(entry => entry.year);
      const counts = data.map(entry => entry.count);

      new Chart(ctx, {
        type: chartType,
        data: {
          labels: years,
          datasets: [{
            label: 'Number of Titles Released this Year',
            data: counts,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: chartType !== 'line'
          }]
        }
      });
    }
  }, [data, chartType, loading]);

  return (
    <div className="container mx-auto mt-10 mb-10 p-5 rounded shadow bg-white">
      <h1 className="text-2xl text-center font-bold mb-6">Netflix Shows Data Visualization</h1>
      <div id="controls" className="flex flex-wrap justify-center gap-4 mb-6">
        <select value={type} onChange={(e) => setType(e.target.value)} className="form-select px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Movies & TV Shows</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
        <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="form-select px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
      </div>
      <div className="flex justify-center items-center h-[600px] w-full">
        {loading ? (
          <div className="text-center text-xl">Loading...</div>
        ) : (
          <canvas ref={chartRef} className="max-w-full h-full"></canvas>
        )}
      </div>
    </div>
  );
};

export default TypeDistributionChart;