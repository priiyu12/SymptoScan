import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Activity, Send, ArrowLeft, User, LogOut, Phone, Video, MoreVertical, Paperclip } from 'lucide-react';
import { doctors } from '../data/mockData';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../api';

export default function ChatConsultationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const doctor = location.state?.doctor || doctors[0];
  const roomId = location.state?.roomId;
  const chatPartnerName = location.state?.chatPartnerName;
  const isDoctor = location.state?.isDoctor;

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [patientRole, setPatientRole] = useState(localStorage.getItem('user_role') || 'patient');

  // Fetch messages initially and poll every 3 seconds
  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`${API_BASE_URL}/api/predict/messages/${roomId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data || []);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [roomId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !roomId) return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_BASE_URL}/api/predict/send-message/`, {
        room_id: roomId,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Optimistically add message
      const msg = {
        id: Date.now().toString(),
        sender_role: patientRole,
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      setMessages([...messages, msg]);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Failed to send message.");
    }
  };

  if (!roomId || !doctor) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No active consultation.</h2>
          <Button onClick={() => navigate('/patient/dashboard')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 z-50 shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/patient/doctors')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Activity className="h-7 w-7 text-[#0066CC]" />
                <span className="text-xl font-semibold text-gray-900">SymptoScan</span>
              </div>
            </div>

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
        </div>
      </nav>

      {/* Main Chat Area */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={doctor.avatar} alt={chatPartnerName || doctor.name} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {(chatPartnerName || doctor.name).split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">{chatPartnerName || doctor.name}</h2>
                  <p className="text-sm text-gray-600">{isDoctor ? 'Patient' : doctor.specialization}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-xs text-gray-500">Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Phone className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <Video className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-gray-50">
            <div className="space-y-4 max-w-4xl mx-auto">
              {/* Session Info */}
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-2 bg-white rounded-full shadow-sm border border-gray-200">
                  <p className="text-xs text-gray-600">
                    Consultation started • Today at {messages[0]?.timestamp}
                  </p>
                </div>
              </div>

              {/* Messages */}
              {messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_role === patientRole ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] ${msg.sender_role === patientRole
                      ? 'bg-[#0066CC] text-white'
                      : 'bg-white border border-gray-200'
                      } rounded-2xl px-4 py-3 shadow-sm`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${msg.sender_role === patientRole ? 'text-blue-100' : 'text-gray-500'
                        }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 h-12 bg-gray-50"
                />
                <Button
                  type="submit"
                  className="bg-[#0066CC] hover:bg-[#0052A3] flex-shrink-0 h-12 px-6"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Patient Info Sidebar (Desktop) */}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0">
          <div className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>

            <Card className="p-4 bg-blue-50 border-blue-200 mb-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium text-gray-900">John Smith</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Age:</span>
                  <span className="font-medium text-gray-900">35 years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium text-gray-900">Male</span>
                </div>
              </div>
            </Card>

            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Reported Symptoms</h4>
            <div className="space-y-2 mb-6">
              {['Fever', 'Cough', 'Fatigue'].map((symptom, index) => (
                <div key={index} className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                  <div className="h-2 w-2 rounded-full bg-[#0066CC]" />
                  <span className="text-sm text-gray-900">{symptom}</span>
                </div>
              ))}
            </div>

            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Predicted Condition</h4>
            <Card className="p-4 bg-yellow-50 border-yellow-200">
              <h5 className="font-semibold text-gray-900 mb-1">Common Flu</h5>
              <p className="text-sm text-gray-600 mb-2">Confidence: 87%</p>
              <p className="text-xs text-gray-600">
                Influenza (flu) is a contagious respiratory illness caused by influenza viruses.
              </p>
            </Card>

            <div className="mt-6 space-y-2">
              <Button variant="outline" className="w-full" size="sm">
                View Full Medical History
              </Button>
              <Button variant="outline" className="w-full" size="sm">
                Download Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
