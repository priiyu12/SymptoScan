import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Unauthorized. Please login again.');
        return;
      }

      try {
        const res = await axios.get('http://127.0.0.1:8000/api/users/admin-dashboard/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setStats(res.data);
      } catch (err) {
        console.error(err.response || err.message);
        setError('Failed to fetch dashboard stats.');
      }
    };

    fetchStats();
  }, []);

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-red-100">
        <div className="bg-white p-8 rounded shadow text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#cccfff] to-[#42006c]">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#cccfff] to-[#42006c]">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Admin Dashboard</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-200 p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold">Total Patients</h3>
            <p className="text-3xl text-purple-900">{stats.total_patients}</p>
          </div>

          <div className="bg-indigo-200 p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold">Total Doctors</h3>
            <p className="text-3xl text-indigo-900">{stats.total_doctors}</p>
          </div>

          <div className="bg-green-200 p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold">Total Feedbacks</h3>
            <p className="text-3xl text-green-900">{stats.total_feedbacks}</p>
          </div>

          <div className="bg-yellow-200 p-6 rounded shadow text-center">
            <h3 className="text-xl font-semibold">Total Predictions</h3>
            <p className="text-3xl text-yellow-900">{stats.total_predictions}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
