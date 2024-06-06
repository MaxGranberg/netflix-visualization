import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Search from './components/Search';
import TopCountriesChart from './components/TopCountriesChart';
import TypeDistributionChart from './components/TypeDistributionChart';

const App = () => {
  return (
    <Router>
      <div>
        <header className="bg-blue-500 text-white p-4 shadow-md w-full">
          <div id="visualizationLinks" className="flex justify-center space-x-4">
            <Link to="/" className="hover:bg-blue-700 transition duration-300 ease-in-out rounded py-2 px-4">Home</Link>
            <Link to="/search" className="hover:bg-blue-700 transition duration-300 ease-in-out rounded py-2 px-4">Search</Link>
            <Link to="/top-countries" className="hover:bg-blue-700 transition duration-300 ease-in-out rounded py-2 px-4">Top Countries</Link>
          </div>
        </header>
        <main className="container mx-auto mb-10 bg-white">
          <Routes>
            <Route path="/" element={<TypeDistributionChart />} />
            <Route path="/search" element={<Search />} />
            <Route path="/top-countries" element={<TopCountriesChart />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
