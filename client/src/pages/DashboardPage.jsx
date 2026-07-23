import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import VehicleCard from '../components/VehicleCard';
import SearchBar from '../components/SearchBar';

const DashboardPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch all vehicles on mount
  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axiosClient.get('/vehicles');
      setVehicles(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch vehicles');
    } finally {
      setLoading(false);
    }
  };

  // Handle vehicle search
  const handleSearch = async (filters) => {
    setLoading(true);
    setError('');
    try {
      if (Object.keys(filters).length === 0) {
        const response = await axiosClient.get('/vehicles');
        setVehicles(response.data);
        return;
      }
      const response = await axiosClient.get('/vehicles/search', { params: filters });
      setVehicles(response.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Search failed');
    } finally {
      setLoading(false);
    }
  };

  // Handle vehicle purchase
  const handlePurchase = async (id) => {
    setError('');
    setSuccessMessage('');
    try {
      const response = await axiosClient.post(`/vehicles/${id}/purchase`);
      const updatedVehicle = response.data.vehicle;
      
      // Update quantity of purchased vehicle in state
      setVehicles((prevVehicles) =>
        prevVehicles.map((vehicle) =>
          vehicle._id === id ? { ...vehicle, quantity: updatedVehicle.quantity } : vehicle
        )
      );

      setSuccessMessage(`Successfully purchased the ${updatedVehicle.make} ${updatedVehicle.model}!`);
      
      // Auto-clear success message after 4 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 4000);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Purchase failed');
    }
  };

  return (
    <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Vehicle Inventory
            </h1>
            <p className="mt-2 text-sm text-indigo-200">
              Browse available cars, check quantities, and make purchases.
            </p>
          </div>
          
          <button
            onClick={fetchVehicles}
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-white/20 rounded-lg shadow-sm text-sm font-semibold text-white bg-white/5 hover:bg-white/10 transition"
          >
            <svg className="w-4 h-4 mr-2 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.235" />
            </svg>
            Refresh List
          </button>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start space-x-3 text-red-200 backdrop-blur-sm">
            <svg className="w-5 h-5 flex-shrink-0 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-start space-x-3 text-emerald-250 backdrop-blur-sm animate-fade-in-down">
            <svg className="w-5 h-5 flex-shrink-0 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Inventory Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
            <p className="mt-4 text-sm text-indigo-200 font-medium">Loading inventory...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl">
            <svg className="mx-auto h-12 w-12 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-semibold text-white">No vehicles available</h3>
            <p className="mt-1 text-sm text-indigo-200">The dealership inventory is currently empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle._id}
                vehicle={vehicle}
                onPurchase={handlePurchase}
              />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default DashboardPage;
