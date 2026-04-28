import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Doctor Dashboard</h1>
      <p>Welcome, {user?.full_name}</p>
      <p>Email: {user?.email}</p>
      <p>Role: {user?.role}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default DoctorDashboard;
