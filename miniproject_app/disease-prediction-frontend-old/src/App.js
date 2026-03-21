// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Components
import Sidebar from './components/Sidebar';
import Login from './components/Login';
import Register from './components/Register';
import PredictDisease from './components/Predict'; // ✅ Patient Predict Symptoms
import Chat from './components/Chat';
import Feedback from './components/Feedback';
import PatientFeedback from './components/PatientFeedback';
import DoctorFeedback from './components/DoctorFeedback';
import DoctorList from './pages/DoctorList';
import PrivateRoute from './components/PrivateRoute';
import Unauthorized from './components/Unauthorized';
import DoctorDashboard from './components/DoctorDashboard';
import AdminDashboard from './components/AdminDashboard';
import DoctorChatRooms from './components/DoctorChatRooms'; // ✅ Doctor's Chat Rooms

function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />

        <div className="flex-1 ml-64 bg-gradient-to-r from-[#cccfff] to-[#42006c] min-h-screen p-8">
          <Routes>

            {/* ✅ Public Routes */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ✅ Patient Routes */}
            <Route
              path="/predict"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <PredictDisease />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <DoctorList />
                </PrivateRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <PrivateRoute allowedRoles={['patient']}>
                  <Feedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/chat/:roomId"
              element={
                <PrivateRoute allowedRoles={['patient', 'doctor']}>
                  <Chat />
                </PrivateRoute>
              }
            />

            {/* ✅ Doctor Routes */}
            <Route
              path="/doctor/dashboard"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/feedback"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <Feedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor/consult-patients"
              element={
                <PrivateRoute allowedRoles={['doctor']}>
                  <DoctorChatRooms />
                </PrivateRoute>
              }
            />

            {/* ✅ Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/patient-feedback"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <PatientFeedback />
                </PrivateRoute>
              }
            />
            <Route
              path="/doctor-feedback"
              element={
                <PrivateRoute allowedRoles={['admin']}>
                  <DoctorFeedback />
                </PrivateRoute>
              }
            />

            {/* ✅ Fallback Route */}
            <Route path="*" element={<Navigate to="/login" replace />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
