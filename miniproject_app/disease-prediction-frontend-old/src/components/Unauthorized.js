import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-100">
      <div className="bg-white p-8 rounded shadow-md text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-700 mb-6">You do not have permission to view this page.</p>
        <Link
          to="/login"
          onClick={() => localStorage.clear()}
          className="inline-block px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
