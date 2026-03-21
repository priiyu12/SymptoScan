import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import SymptomInputPage from './pages/SymptomInputPage';
import PredictionResultPage from './pages/PredictionResultPage';
import DoctorListingPage from './pages/DoctorListingPage';
import ChatConsultationPage from './pages/ChatConsultationPage';
import DoctorDashboard from './pages/DoctorDashboard';
import AdminDashboard from './pages/AdminDashboard';

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    // Redirect to their respective dashboard if they try to access a role they don't have
    if (userRole === 'patient') return <Navigate to="/patient/dashboard" replace />;
    if (userRole === 'doctor') return <Navigate to="/doctor/dashboard" replace />;
    if (userRole === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Routes */}
        <Route path="/patient/dashboard" element={<PrivateRoute allowedRoles={['patient']}><PatientDashboard /></PrivateRoute>} />
        <Route path="/patient/symptoms" element={<PrivateRoute allowedRoles={['patient']}><SymptomInputPage /></PrivateRoute>} />
        <Route path="/patient/prediction" element={<PrivateRoute allowedRoles={['patient']}><PredictionResultPage /></PrivateRoute>} />
        <Route path="/patient/doctors" element={<PrivateRoute allowedRoles={['patient']}><DoctorListingPage /></PrivateRoute>} />
        <Route path="/patient/chat" element={<PrivateRoute allowedRoles={['patient']}><ChatConsultationPage /></PrivateRoute>} />

        {/* Doctor Routes */}
        <Route path="/doctor/dashboard" element={<PrivateRoute allowedRoles={['doctor']}><DoctorDashboard /></PrivateRoute>} />
        <Route path="/doctor/chat" element={<PrivateRoute allowedRoles={['doctor', 'patient']}><ChatConsultationPage /></PrivateRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
