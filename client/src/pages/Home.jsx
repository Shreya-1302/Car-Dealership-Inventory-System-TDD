import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { token, user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
        <h1 className="text-4xl font-extrabold text-indigo-600 mb-4">Car Dealership</h1>
        <p className="text-gray-600 mb-8">
          Welcome to the Car Dealership Inventory System. Please log in or register to manage vehicles.
        </p>

        {token ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">You are logged in as {user?.role}</p>
            <Link
              to="/dashboard"
              className="block w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition"
            >
              Go to Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-md shadow-md transition"
              >
                Go to Admin Panel
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/login"
              className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md shadow-md transition"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="py-2 px-4 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-md transition"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
