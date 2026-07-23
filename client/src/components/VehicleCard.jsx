import React from 'react';

const VehicleCard = ({ vehicle, onPurchase }) => {
  const { _id, make, model, category, price, quantity } = vehicle;

  const isOutOfStock = quantity === 0;

  // Format currency
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/15 hover:border-white/30 hover:shadow-indigo-500/10 transition-all duration-300 flex flex-col justify-between h-full group relative z-10">
      {/* Visual Car Icon Container */}
      <div className="bg-gradient-to-br from-indigo-950/40 to-purple-950/40 p-6 flex justify-center items-center relative overflow-hidden h-40 border-b border-white/10">
        <svg className="w-20 h-20 text-indigo-400 opacity-60 group-hover:scale-110 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V15a1 1 0 01-1 1h-1.17" />
        </svg>
        <span className="absolute top-3 right-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 shadow-sm border border-white/20 backdrop-blur-md capitalize">
          {category}
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition">
            {make} {model}
          </h3>
          <p className="text-2xl font-extrabold text-indigo-300 mb-4">
            {formatPrice(price)}
          </p>
        </div>

        <div>
          {/* Stock Display */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-indigo-200 font-medium">Availability</span>
            {isOutOfStock ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-500/20 text-red-200 border border-red-500/30">
                Out of Stock
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-250 border border-emerald-500/30">
                {quantity} {quantity === 1 ? 'unit' : 'units'} left
              </span>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={() => onPurchase(_id)}
            disabled={isOutOfStock}
            className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-205 ${
              isOutOfStock
                ? 'bg-white/5 text-white/30 border border-white/10 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md hover:scale-[1.01] active:scale-[0.99]'
            }`}
          >
            {isOutOfStock ? 'Sold Out' : 'Purchase'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
