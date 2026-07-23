import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white font-medium rounded-md hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
        <div className="bg-indigo-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-indigo-900 mb-2">Welcome Back!</h2>
          <p className="text-indigo-700">Logged in as: <strong className="font-bold">{user?.userId || 'User'}</strong></p>
          <p className="text-indigo-700">Role: <strong className="font-bold capitalize">{user?.role || 'user'}</strong></p>
        </div>
        <p className="text-gray-600">
          This is your private dashboard. You can access this route because you are authenticated.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
