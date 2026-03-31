import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, Stethoscope, History, LogOut, User, Menu } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');

        // Fetch user info
        const userRes = await axios.get('http://127.0.0.1:8000/api/auth/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(userRes.data.full_name || userRes.data.email.split('@')[0]);

        // Fetch prediction history
        const historyRes = await axios.get('http://127.0.0.1:8000/api/predict/history/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPredictions(historyRes.data.history || []);
      } catch (err) {
        console.error("Failed to fetch prediction history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Resolved':
        return 'bg-green-100 text-green-800';
      case 'Consulted':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#0066CC]" />
              <span className="text-xl font-semibold text-gray-900">SymptoScan</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/patient/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/patient/symptoms')}>
                Check Symptoms
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate('/patient/doctors')}>
                Find Doctors
              </Button>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col gap-2">
                <Button variant="ghost" className="justify-start" onClick={() => navigate('/patient/dashboard')}>
                  Dashboard
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => navigate('/patient/symptoms')}>
                  Check Symptoms
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => navigate('/patient/doctors')}>
                  Find Doctors
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, {userName || 'Patient'} 👋
          </h1>
          <p className="text-gray-600">How are you feeling today?</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white"
            onClick={() => navigate('/patient/symptoms')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                Start
              </Button>
            </div>
            <h3 className="text-xl font-semibold mb-2">Check Symptoms</h3>
            <p className="text-blue-100 text-sm">
              Enter your symptoms and get instant AI-powered disease prediction
            </p>
          </Card>

          <Card
            className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br from-green-500 to-green-600 text-white"
            onClick={() => navigate('/patient/doctors')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white text-green-600 hover:bg-green-50"
              >
                Browse
              </Button>
            </div>
            <h3 className="text-xl font-semibold mb-2">Find a Doctor</h3>
            <p className="text-green-100 text-sm">
              Connect with certified healthcare professionals for consultation
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow border-0 shadow-md">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <History className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">Your Health History</h3>
            <p className="text-gray-600 text-sm mb-4">
              {predictions.length} predictions recorded
            </p>
            <div className="text-sm text-gray-600">
              Last check: {predictions.length > 0 ? new Date(predictions[0].created_at).toLocaleDateString() : 'Never'}
            </div>
          </Card>
        </div>

        {/* Recent Predictions */}
        <Card className="p-6 shadow-md border-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Recent Predictions</h2>
            <Button variant="ghost" size="sm" className="text-[#0066CC]">
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-4 text-gray-500">Loading history...</div>
            ) : predictions.slice(0, 3).map((prediction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-[#0066CC]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{prediction.predicted_disease}</h3>
                    <p className="text-sm text-gray-600">{new Date(prediction.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className="bg-green-100 text-green-800">
                    Complete
                  </Badge>
                </div>
              </div>
            ))}

            {!loading && predictions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No predictions yet</p>
                <p className="text-sm">Start by checking your symptoms</p>
              </div>
            )}
          </div>
        </Card>

        {/* Health Tips */}
        <Card className="p-6 mt-6 bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-md">
          <h3 className="font-semibold text-gray-900 mb-3">💡 Health Tip of the Day</h3>
          <p className="text-gray-600 text-sm">
            Stay hydrated! Drinking adequate water throughout the day helps maintain body temperature,
            keeps joints lubricated, prevents infections, and improves sleep quality and cognition.
          </p>
        </Card>
      </div>
    </div>
  );
}
