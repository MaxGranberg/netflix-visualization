import React, { useState, useEffect } from 'react';
import { fetchDataWithFilters } from '../utils/fetchData';

const Search = () => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [release_year, setYear] = useState('');
  const [data, setData] = useState([]);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const resultsPerPage = 20;

  const fetchSearchResults = async () => {
    const result = await fetchDataWithFilters(title, type, release_year, resultsPerPage, (page - 1) * resultsPerPage);
    setData(result.results);
    setTotalResults(result.total);
    setSearched(true);
  };

  const handleSearch = () => {
    setPage(1); // Reset to the first page
    fetchSearchResults(); // Fetch results when the search button is clicked
  };

  useEffect(() => {
    fetchSearchResults();
  }, [page]);

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handlePrevPage = () => {
    setPage(page - 1);
  };

  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const startYear = 1925;
    const years = [];

    for (let year = currentYear; year >= startYear; year--) {
      years.push(year);
    }

    return years;
  };

  return (
    <div className="container mx-auto mt-10 mb-10 p-8 rounded-lg shadow-lg bg-white">
      <h1 className="text-2xl text-center font-bold mb-6 text-gray-800">Search Netflix Titles</h1>
      <div id="controls" className="flex flex-wrap justify-center gap-4 mb-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search title..."
          className="form-input w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <select value={type} onChange={(e) => setType(e.target.value)} className="form-select w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">All Types</option>
          <option value="Movie">Movies</option>
          <option value="TV Show">TV Shows</option>
        </select>
        <select value={release_year} onChange={(e) => setYear(e.target.value)} className="form-select w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="">Year released...</option>
          {generateYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button onClick={handleSearch} className="w-full max-w-xs bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out">
          Search
        </button>
      </div>
      <div id="searchResults" className="mt-6">
        {searched && data.length === 0 ? (
          <p className="text-red-500 text-lg text-center">No results found.</p>
        ) : (
          <>
            <ul className="list-disc pl-5 space-y-3">
              {data.map((item) => (
                <li key={item.show_id} className="bg-gray-100 p-3 rounded-lg shadow-sm hover:bg-gray-200 transition duration-200">
                  {item.title} ({item.release_year}) - {item.type}
                </li>
              ))}
            </ul>
            <div className="flex justify-center mt-6">
              <button
                onClick={handlePrevPage}
                disabled={page === 1}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="mx-4 text-lg text-gray-700">Page {page} of {Math.ceil(totalResults / resultsPerPage)}</span>
              <button
                onClick={handleNextPage}
                disabled={page * resultsPerPage >= totalResults}
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Search;
