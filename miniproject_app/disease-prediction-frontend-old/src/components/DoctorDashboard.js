// src/components/DoctorDashboard.js
import React from 'react';

const DoctorDashboard = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#cccfff] to-[#42006c]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-lg text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Doctor Dashboard</h1>
        <p className="text-gray-600">Welcome Doctor! Use the sidebar to navigate.</p>
      </div>
    </div>
  );
};

export default DoctorDashboard;
