// src/components/Sidebar.js

import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const [role, setRole] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userRole = localStorage.getItem('user_role');
    setRole(userRole);
  }, [location, localStorage.getItem('user_role')]);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    navigate('/login');
  };

  if (!role) {
    return null; // Or a spinner while fetching role
  }

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-purple-900 text-white flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
        <ul className="space-y-4">

          {/* PATIENT MENU */}
          {role === 'patient' && (
            <>
              <li>
                <Link to="/predict" className="hover:text-purple-300">Predict Symptoms</Link>
              </li>
              <li>
                <Link to="/doctors" className="hover:text-purple-300">Doctors</Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-purple-300">Feedback</Link>
              </li>
            </>
          )}

          {/* DOCTOR MENU */}
          {role === 'doctor' && (
            <>
              <li>
                <Link to="/doctor/consult-patients" className="hover:text-purple-300">Consult Patients</Link>
              </li>
              <li>
                <Link to="/doctor/feedback" className="hover:text-purple-300">Feedback to Website</Link>
              </li>
            </>
          )}

          {/* ADMIN MENU */}
          {role === 'admin' && (
            <>
              <li>
                <Link to="/admin/dashboard" className="hover:text-purple-300">Dashboard</Link>
              </li>
              <li>
                <Link to="/patient-feedback" className="hover:text-purple-300">Patient Feedback</Link>
              </li>
              <li>
                <Link to="/doctor-feedback" className="hover:text-purple-300">Doctor Feedback</Link>
              </li>
            </>
          )}

        </ul>
      </div>

      <div className="p-4">
        <button
          onClick={handleLogout}
          className="bg-red-600 w-full py-2 rounded hover:bg-red-700 transition duration-300"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
