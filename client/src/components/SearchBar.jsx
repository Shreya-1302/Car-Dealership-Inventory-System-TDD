import React, { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    make: '',
    model: '',
    category: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanedFilters = {};
    Object.keys(filters).forEach((key) => {
      const val = filters[key];
      if (val !== undefined && val !== '') {
        cleanedFilters[key] = val;
      }
    });
    onSearch(cleanedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      make: '',
      model: '',
      category: '',
      minPrice: '',
      maxPrice: ''
    };
    setFilters(resetFilters);
    onSearch({});
  };

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-lg p-6 mb-8 relative z-10">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filter Inventory
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Make */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-indigo-200 mb-1">Make</label>
            <input
              type="text"
              name="make"
              value={filters.make}
              onChange={handleChange}
              placeholder="e.g. Tesla"
              className="px-3 py-2 border-0 bg-white/95 text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150"
            />
          </div>

          {/* Model */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-indigo-200 mb-1">Model</label>
            <input
              type="text"
              name="model"
              value={filters.model}
              onChange={handleChange}
              placeholder="e.g. Model Y"
              className="px-3 py-2 border-0 bg-white/95 text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-indigo-200 mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={filters.category}
              onChange={handleChange}
              placeholder="e.g. SUV, Sedan"
              className="px-3 py-2 border-0 bg-white/95 text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150"
            />
          </div>

          {/* Min Price */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-indigo-200 mb-1">Min Price ($)</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              min="0"
              className="px-3 py-2 border-0 bg-white/95 text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150"
            />
          </div>

          {/* Max Price */}
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-indigo-200 mb-1">Max Price ($)</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              min="0"
              className="px-3 py-2 border-0 bg-white/95 text-gray-900 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition duration-150"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-white/20 text-white font-medium rounded-lg text-sm bg-white/5 hover:bg-white/10 hover:shadow-sm active:scale-[0.98] transition duration-150 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear Filters
          </button>
          
          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-150 flex items-center gap-1.5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Search Inventory
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
