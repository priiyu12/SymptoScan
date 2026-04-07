// Added dashboard initialization logic to fetch doctor profile,
// availability status, and consultation history from backend.
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, Users, Calendar, Clock, LogOut, User, Menu, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { useState, useEffect } from 'react';
import { Switch } from '../components/ui/switch';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';


export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('access_token');

        // Fetch user info
        const userRes = await axios.get(`${API_BASE_URL}/api/auth/users/me/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserName(userRes.data.full_name || userRes.data.email.split('@')[0]);

        // Fetch availability
        const availRes = await axios.get(`${API_BASE_URL}/api/users/availability/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsAvailable(availRes.data.is_available);

        // Fetch consultations
        const res = await axios.get(`${API_BASE_URL}/api/consultation/history/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const allRooms = res.data.results || res.data || [];
        setChatRooms(allRooms);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAvailabilityToggle = async (checked: boolean) => {
    setIsAvailable(checked);
    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_BASE_URL}/api/users/availability/`,
        { is_available: checked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Failed to update availability:', error);
      // Revert on error
      setIsAvailable(!checked);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'Accepted':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const pendingRequests = chatRooms.filter(c => !c.is_paid || c.status === 'PENDING');
  const activeRequests = chatRooms.filter(c => c.status === 'ACTIVE');
  const pastRequests = chatRooms.filter(c => c.status === 'EXPIRED' || c.status === 'COMPLETED');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="h-7 w-7 text-[#0066CC]" />
              <span className="text-xl font-semibold text-gray-900">SymptoScan</span>
              <Badge className="ml-2 bg-green-100 text-green-800">Doctor</Badge>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate('/doctor/dashboard')}>
                Dashboard
              </Button>
              <Button variant="ghost" size="sm">
                My Patients
              </Button>
              <Button variant="ghost" size="sm">
                Schedule
              </Button>
              <div className="flex items-center gap-2 pl-4 border-l border-gray-200">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => {
                  localStorage.clear();
                  navigate('/');
                }}>
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
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {userName ? (userName.startsWith('Dr.') ? userName : `Dr. ${userName}`) : 'Doctor'} 👋
            </h1>
            <p className="text-gray-600">Here's what's happening with your patients today</p>
          </div>

          {/* Availability Toggle */}
          <Card className="p-4 bg-white shadow-sm border-0">
            <div className="flex items-center gap-3">
              <Switch checked={isAvailable} onCheckedChange={handleAvailabilityToggle} />
              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {isAvailable ? 'Available' : 'Offline'}
                </p>
                <p className="text-xs text-gray-500">Toggle your availability</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 shadow-md border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-[#0066CC]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {pendingRequests.length}
            </div>
            <p className="text-sm text-gray-600">Pending Requests</p>
          </Card>

          <Card className="p-6 shadow-md border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#10B981]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {activeRequests.length}
            </div>
            <p className="text-sm text-gray-600">Active Patients</p>
          </Card>

          <Card className="p-6 shadow-md border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">8</div>
            <p className="text-sm text-gray-600">Today's Appointments</p>
          </Card>

          <Card className="p-6 shadow-md border-0">
            <div className="flex items-start justify-between mb-4">
              <div className="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">24h</div>
            <p className="text-sm text-gray-600">Response Time</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Incoming Consultation Requests */}
          <Card className="p-6 shadow-md border-0">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Consultation Requests</h2>
              <Badge className="bg-red-100 text-red-800">
                {pendingRequests.length} New
              </Badge>
            </div>

            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div
                  key={request.id}
                  className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{request.patient}</h3>
                      <p className="text-sm text-gray-600">{request.patient_email}</p>
                    </div>
                    <Badge className={getUrgencyColor(request.urgency)}>
                      {request.urgency}
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Symptoms:</p>
                    <div className="flex flex-wrap gap-2">
                      {request.prediction?.symptoms?.map((symptom: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {symptom}
                        </Badge>
                      )) || <span className="text-xs text-gray-400 italic">No symptoms recorded</span>}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600">
                      Predicted: <span className="font-semibold text-gray-900">{request.prediction?.disease || 'Unknown'}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Requested at {request.created_at}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-[#0066CC] hover:bg-[#0052A3]"
                      onClick={() => navigate('/doctor/chat')}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              ))}

              {pendingRequests.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No pending requests</p>
                </div>
              )}
            </div>
          </Card>

          {/* Active Patients */}
          <div className="space-y-6">
            <Card className="p-6 shadow-md border-0 bg-blue-50/30">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Active Patients</h2>
              </div>

              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-4 text-gray-500">Loading your patients...</div>
                ) : activeRequests.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">No active patients.</div>
                ) : activeRequests.map((patient) => (
                  <div
                    key={patient.id}
                    className="p-4 rounded-lg bg-white border border-blue-200 shadow-sm hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{patient.patient}</h3>
                        <p className="text-sm text-gray-600">Expires: {new Date(patient.expires_at).toLocaleDateString()}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full bg-blue-50 text-blue-700 hover:bg-blue-100 border-0"
                      onClick={() => navigate('/doctor/chat', { 
                        state: { 
                          consultationId: patient.id, 
                          chatPartnerName: patient.patient,
                          prediction: patient.prediction,
                          patientName: patient.patient
                        } 
                      })}
                    >
                      Continue Consultation
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Past Consultations */}
            <Card className="p-6 shadow-md border-0">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Past Consultations</h2>
              </div>

              <div className="space-y-4">
                {pastRequests.length === 0 ? (
                  <p className="text-gray-500 text-sm">No past consultations found.</p>
                ) : (
                  pastRequests.map((patient: any) => (
                    <div key={patient.id} className="p-4 border border-gray-100 rounded-lg bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-medium text-gray-800">{patient.patient}</h3>
                          <p className="text-xs text-gray-500">{new Date(patient.created_at).toLocaleDateString()}</p>
                        </div>
                        <Badge className="bg-gray-200 text-gray-600">
                          {patient.status}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full text-xs h-8"
                        onClick={() => navigate('/doctor/chat', { 
                          state: { 
                            consultationId: patient.id, 
                            chatPartnerName: patient.patient,
                            prediction: patient.prediction,
                            patientName: patient.patient
                          } 
                        })}
                      >
                        View History
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Schedule & Profile Section */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <Card className="p-6 shadow-md border-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Doctor Activity</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-600">Total Consultation Hours</p>
                <p className="font-bold text-[#0066CC]">24.5h</p>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
                <p className="text-sm text-gray-600">Average Rating</p>
                <p className="font-bold text-yellow-600">4.9/5.0</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 shadow-md border-0">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Manage Availability
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                View Statistics
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}