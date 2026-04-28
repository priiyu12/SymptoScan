import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import PatientDashboard from '../pages/PatientDashboard';
import SymptomFormPage from '../pages/SymptomFormPage';
import PredictionResultPage from '../pages/PredictionResultPage';
import PredictionHistoryPage from '../pages/PredictionHistoryPage';
import DoctorListPage from '../pages/DoctorListPage';
import DoctorDetailPage from '../pages/DoctorDetailPage';
import ConsultationPage from '../pages/ConsultationPage';
import ChatPage from '../pages/ChatPage';
import DoctorDashboard from '../pages/DoctorDashboard';
import AdminDashboard from '../pages/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route
          path="/patient/dashboard"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/symptoms"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <SymptomFormPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction-result"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PredictionResultPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/prediction-history"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PredictionHistoryPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorListPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctors/:id"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <DoctorDetailPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/consultations"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <ConsultationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:consultationId"
          element={
            <ProtectedRoute allowedRoles={['patient', 'doctor']}>
              <ChatPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/dashboard"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
