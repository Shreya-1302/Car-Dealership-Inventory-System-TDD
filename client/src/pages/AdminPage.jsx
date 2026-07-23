import React, { useEffect, useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import VehicleForm from '../components/VehicleForm';
import SearchBar from '../components/SearchBar';
import { AuthContext } from '../context/AuthContext';

const AdminPage = () => {
  const { user } = useContext(AuthContext);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Modals state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [restockAmount, setRestockAmount] = useState('');
  const [formSubmitError, setFormSubmitError] = useState('');

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
      setError(err.response?.data?.error || err.message || 'Failed to fetch inventory');
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
      setVehicles((prev) =>
        prev.map((v) => (v._id === id ? { ...v, quantity: updatedVehicle.quantity } : v))
      );
      setSuccessMessage(`Successfully purchased the ${updatedVehicle.make} ${updatedVehicle.model}!`);
      clearNotificationsAfterTimeout();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Purchase failed');
    }
  };

  // Add vehicle
  const handleAddSubmit = async (formData) => {
    setFormSubmitError('');
    try {
      const response = await axiosClient.post('/vehicles', formData);
      const newVehicle = response.data;
      setVehicles((prev) => [newVehicle, ...prev]);
      setSuccessMessage(`Successfully added ${newVehicle.make} ${newVehicle.model}!`);
      closeModal();
      clearNotificationsAfterTimeout();
    } catch (err) {
      setFormSubmitError(err.response?.data?.error || err.message || 'Failed to add vehicle');
    }
  };

  // Edit vehicle
  const handleEditSubmit = async (formData) => {
    setFormSubmitError('');
    try {
      const response = await axiosClient.put(`/vehicles/${selectedVehicle._id}`, formData);
      const updatedVehicle = response.data;
      setVehicles((prev) =>
        prev.map((v) => (v._id === selectedVehicle._id ? updatedVehicle : v))
      );
      setSuccessMessage(`Successfully updated ${updatedVehicle.make} ${updatedVehicle.model}!`);
      closeModal();
      clearNotificationsAfterTimeout();
    } catch (err) {
      setFormSubmitError(err.response?.data?.error || err.message || 'Failed to update vehicle');
    }
  };

  // Delete vehicle
  const handleDelete = async (id, make, model) => {
    if (!window.confirm(`Are you sure you want to delete the ${make} ${model}?`)) {
      return;
    }
    setError('');
    setSuccessMessage('');
    try {
      await axiosClient.delete(`/vehicles/${id}`);
      setVehicles((prev) => prev.filter((v) => v._id !== id));
      setSuccessMessage(`Successfully deleted the ${make} ${model}.`);
      clearNotificationsAfterTimeout();
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Delete failed');
    }
  };

  // Restock vehicle
  const handleRestockSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitError('');
    const quantity = Number(restockAmount);
    if (!restockAmount || isNaN(quantity) || quantity <= 0) {
      setFormSubmitError('Please enter a valid positive number');
      return;
    }

    try {
      const response = await axiosClient.post(`/vehicles/${selectedVehicle._id}/restock`, { quantity });
      const updatedVehicle = response.data.vehicle;
      setVehicles((prev) =>
        prev.map((v) => (v._id === selectedVehicle._id ? updatedVehicle : v))
      );
      setSuccessMessage(`Successfully restocked ${quantity} units of ${updatedVehicle.make} ${updatedVehicle.model}!`);
      closeModal();
      clearNotificationsAfterTimeout();
    } catch (err) {
      setFormSubmitError(err.response?.data?.error || err.message || 'Restock failed');
    }
  };

  const openAddModal = () => {
    setSelectedVehicle(null);
    setFormSubmitError('');
    setActiveModal('add');
  };

  const openEditModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setFormSubmitError('');
    setActiveModal('edit');
  };

  const openRestockModal = (vehicle) => {
    setSelectedVehicle(vehicle);
    setRestockAmount('');
    setFormSubmitError('');
    setActiveModal('restock');
  };

  const closeModal = () => {
    setActiveModal(null);
    setSelectedVehicle(null);
    setRestockAmount('');
    setFormSubmitError('');
  };

  const clearNotificationsAfterTimeout = () => {
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  // Metrics
  const totalVehicles = vehicles.length;
  const totalStock = vehicles.reduce((sum, v) => sum + v.quantity, 0);
  const outOfStockCount = vehicles.filter((v) => v.quantity === 0).length;

  return (
    <div className="flex-grow py-8 px-4 sm:px-6 lg:px-8 relative z-10 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 pb-6 border-b border-white/10">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
              <span className="p-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </span>
              Admin Control Panel
            </h1>
            <p className="mt-2 text-sm text-indigo-200">
              Manage inventory, add new car models, restock quantities, or remove listings.
            </p>
          </div>
          
          <button
            onClick={openAddModal}
            className="mt-4 md:mt-0 inline-flex items-center justify-center px-5 py-2.5 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition duration-150"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Vehicle
          </button>
        </div>

        {/* Success / Error Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg flex items-start space-x-3 text-red-200 backdrop-blur-sm">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-start space-x-3 text-emerald-250 backdrop-blur-sm animate-fade-in-down">
            <svg className="w-5 h-5 text-emerald-450 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {/* Metrics 1 */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/15 shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Unique Models</p>
              <h3 className="text-2xl font-bold text-white mt-1">{loading ? '...' : totalVehicles}</h3>
            </div>
            <span className="p-3 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </span>
          </div>

          {/* Metrics 2 */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/15 shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Total Stock</p>
              <h3 className="text-2xl font-bold text-white mt-1">{loading ? '...' : totalStock}</h3>
            </div>
            <span className="p-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </span>
          </div>

          {/* Metrics 3 */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-xl border border-white/15 shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-indigo-200 uppercase tracking-wider">Out Of Stock</p>
              <h3 className={`text-2xl font-bold mt-1 ${outOfStockCount > 0 ? 'text-red-405' : 'text-white'}`}>
                {loading ? '...' : outOfStockCount}
              </h3>
            </div>
            <span className={`p-3 rounded-lg border ${outOfStockCount > 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-white/5 text-indigo-250 border-white/10'}`}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onSearch={handleSearch} />

        {/* Main Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-400"></div>
            <p className="mt-4 text-sm text-indigo-200 font-medium">Loading inventory...</p>
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl">
            <svg className="mx-auto h-14 w-14 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="mt-4 text-lg font-bold text-white">Inventory is empty</h3>
            <p className="mt-2 text-sm text-indigo-200">Get started by creating your first car model.</p>
            <button
              onClick={openAddModal}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition"
            >
              Add Vehicle
            </button>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 shadow-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10">
                <thead className="bg-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-indigo-200 uppercase tracking-wider">Make & Model</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-indigo-200 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-indigo-200 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-indigo-200 uppercase tracking-wider">Quantity</th>
                    <th scope="col" className="px-6 py-3.5 text-right text-xs font-bold text-indigo-200 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10 bg-transparent">
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle._id} className="hover:bg-white/5 transition duration-100">
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <div className="text-sm font-bold text-white">{vehicle.make}</div>
                        <div className="text-xs text-indigo-200">{vehicle.model}</div>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-white/90 border border-white/10 capitalize">
                          {vehicle.category}
                        </span>
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-sm font-bold text-white">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(vehicle.price)}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap">
                        {vehicle.quantity === 0 ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-200 border border-red-500/30">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-250 border border-emerald-500/30">
                            {vehicle.quantity} available
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4.5 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        {/* Purchase Button */}
                        <button
                          onClick={() => handlePurchase(vehicle._id)}
                          disabled={vehicle.quantity === 0}
                          className={`inline-flex items-center transition ${
                            vehicle.quantity === 0
                              ? 'text-white/20 cursor-not-allowed'
                              : 'text-indigo-300 hover:text-indigo-150 font-semibold'
                          }`}
                          title="Purchase"
                        >
                          <svg className="w-5 h-5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          Purchase
                        </button>

                        {/* Restock Button */}
                        <button
                          onClick={() => openRestockModal(vehicle)}
                          className="inline-flex items-center text-emerald-350 hover:text-emerald-200 transition"
                          title="Restock"
                        >
                          <svg className="w-5 h-5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Restock
                        </button>
                        
                        {/* Edit Button */}
                        <button
                          onClick={() => openEditModal(vehicle)}
                          className="inline-flex items-center text-indigo-300 hover:text-indigo-150 transition"
                          title="Edit"
                        >
                          <svg className="w-5 h-5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Edit
                        </button>
                        
                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(vehicle._id, vehicle.make, vehicle.model)}
                          className="inline-flex items-center text-red-400 hover:text-red-300 transition"
                          title="Delete"
                        >
                          <svg className="w-5 h-5 mr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add/Edit Vehicle Modal Overlay */}
        {(activeModal === 'add' || activeModal === 'edit') && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-slate-900 w-full max-w-xl rounded-2xl shadow-2xl border border-white/15 overflow-hidden transform transition-all">
              
              {/* Form submit error badge inside modal */}
              {formSubmitError && (
                <div className="bg-red-500/20 text-red-200 text-xs font-semibold p-4 border-b border-red-500/30 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formSubmitError}</span>
                </div>
              )}

              <VehicleForm
                initialValues={activeModal === 'edit' ? selectedVehicle : null}
                onSubmit={activeModal === 'edit' ? handleEditSubmit : handleAddSubmit}
                onCancel={closeModal}
              />
            </div>
          </div>
        )}

        {/* Restock Modal Overlay */}
        {activeModal === 'restock' && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-white/15 p-6 relative">
              <h3 className="text-xl font-bold text-white mb-3 border-b border-white/10 pb-3">
                Restock Inventory
              </h3>
              
              {formSubmitError && (
                <div className="mb-4 p-3 bg-red-500/20 text-red-200 rounded-lg text-sm border border-red-500/30 flex items-center gap-2 font-medium">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{formSubmitError}</span>
                </div>
              )}

              <p className="text-sm text-indigo-200 mb-4">
                How many units of <strong className="text-white">{selectedVehicle?.make} {selectedVehicle?.model}</strong> do you want to add to the inventory? (Current stock: {selectedVehicle?.quantity})
              </p>

              <form onSubmit={handleRestockSubmit}>
                <div className="mb-5 flex flex-col">
                  <label className="text-xs font-semibold text-indigo-200 mb-1">Restock Amount</label>
                  <input
                    type="number"
                    min="1"
                    step="1"
                    required
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(e.target.value)}
                    placeholder="e.g. 10"
                    className="px-3.5 py-2 border-0 bg-white/95 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition rounded-lg text-sm font-medium"
                  />
                </div>

                <div className="flex justify-end items-center space-x-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-white/20 text-white font-semibold rounded-lg text-sm bg-white/5 hover:bg-white/10 active:scale-[0.98] transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-sm shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-155"
                  >
                    Confirm Restock
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminPage;
