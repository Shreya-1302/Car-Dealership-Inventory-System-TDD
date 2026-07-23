import React, { useState, useEffect } from 'react';

const VehicleForm = ({ initialValues, onSubmit, onCancel }) => {
  const isEditMode = !!initialValues;

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    category: '',
    price: '',
    quantity: ''
  });

  // Pre-fill form if editing
  useEffect(() => {
    if (initialValues) {
      setFormData({
        make: initialValues.make || '',
        model: initialValues.model || '',
        category: initialValues.category || '',
        price: initialValues.price !== undefined ? initialValues.price : '',
        quantity: initialValues.quantity !== undefined ? initialValues.quantity : ''
      });
    } else {
      setFormData({
        make: '',
        model: '',
        category: '',
        price: '',
        quantity: ''
      });
    }
  }, [initialValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Parse numeric fields
    const submissionData = {
      ...formData,
      price: Number(formData.price),
      quantity: Number(formData.quantity)
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-xl border border-gray-150 shadow-sm max-w-xl mx-auto">
      <h3 className="text-xl font-bold text-gray-950 border-b border-gray-100 pb-3">
        {isEditMode ? 'Edit Vehicle Information' : 'Add New Vehicle'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Make */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">Make <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="make"
            required
            value={formData.make}
            onChange={handleChange}
            placeholder="e.g. Ford, Tesla"
            className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Model */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">Model <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="model"
            required
            value={formData.model}
            onChange={handleChange}
            placeholder="e.g. Mustang, Model S"
            className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Category */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">Category <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Sedan, SUV, Electric"
            className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">Price ($) <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="price"
            required
            min="0"
            step="any"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 45000"
            className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>

        {/* Quantity */}
        <div className="flex flex-col sm:col-span-2">
          <label className="text-sm font-semibold text-gray-600 mb-1">Quantity <span className="text-red-500">*</span></label>
          <input
            type="number"
            name="quantity"
            required
            min="0"
            step="1"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="e.g. 5"
            className="px-3.5 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <div className="flex justify-end items-center space-x-3 pt-3 border-t border-gray-100">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg text-sm bg-white hover:bg-gray-50 active:scale-[0.98] transition"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-sm shadow hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition duration-150"
        >
          {isEditMode ? 'Save Changes' : 'Add Vehicle'}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
