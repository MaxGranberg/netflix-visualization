import React, { useState } from 'react';
import { fetchDataWithFilters } from '../utils/fetchData';

const Search = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [year, setYear] = useState('');
  const [data, setData] = useState([]);

  const handleSearch = async () => {
    const result = await fetchDataWithFilters(title, type, year);
    setData(result);
  };

  return (
    <div className="container mx-auto mt-10 mb-10 p-5 rounded shadow bg-white">
      <h1 className="text-xl text-center font-bold mb-4">Search Netflix Titles</h1>
      <div id="controls" className="flex flex-wrap justify-center gap-4 mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search title..."
          className="form-input px-4 py-2 border rounded"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="form-select px-4 py-2 border rounded">
          <option value="">All Types</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Year released..."
          className="form-input px-4 py-2 border rounded"
        />
        <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Search
        </button>
      </div>
      <div id="searchResults" className="mt-4">
        {data.length === 0 ? (
          <p className="text-red-500 text-lg text-center">No results found.</p>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {data.map((item) => (
              <li key={item.show_id} className="bg-white p-2 rounded shadow hover:bg-gray-100">
                {item.title} ({item.release_year}) - {item.type}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Search;
