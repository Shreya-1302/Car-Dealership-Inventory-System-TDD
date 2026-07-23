import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { token, user } = useContext(AuthContext);

  return (
    <div className="flex-grow flex items-center justify-center p-6 min-h-[calc(100vh-4rem)] relative z-10">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/20 text-center">
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-wide">Car Dealership</h1>
        <p className="text-indigo-200 mb-8">
          Welcome to the Car Dealership Inventory System. Please log in or register to manage vehicles.
        </p>

        {token ? (
          <div className="space-y-4">
            <p className="text-sm text-indigo-300">You are logged in as <span className="capitalize font-bold">{user?.role}</span></p>
            <Link
              to="/dashboard"
              className="block w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Go to Dashboard
            </Link>
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="block w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
              >
                Go to Admin Panel
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/login"
              className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition hover:scale-[1.01] active:scale-[0.99]"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="py-2.5 px-4 border border-white/25 text-white hover:bg-white/5 font-semibold rounded-lg transition"
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
