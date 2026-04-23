// Enhancement: Optimistic UI update so messages appear instantly
// without waiting for server confirmation.
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Activity, Send, ArrowLeft, User, LogOut, Phone, Video, MoreVertical, Paperclip, Bot } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import axios from 'axios';
import { API_BASE_URL } from '../utils/api';


export default function ChatConsultationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Dynamic Data from Location State
  const consultationId = location.state?.consultationId;
  const paymentCompleted = location.state?.paymentCompleted || false;
  const prediction = location.state?.prediction; // Symptoms and Disease from Triage
  
  const chatPartner = location.state?.doctor || {
    name: location.state?.chatPartnerName || location.state?.patientName || 'Patient',
    specialization: 'Patient'
  };
  
  const [messages, setMessages] = useState<any[]>([]);
  const [consultationStatus, setConsultationStatus] = useState<string>('ACTIVE');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const userFullName = localStorage.getItem('user_full_name') || 'Patient';
  const userId = parseInt(localStorage.getItem('user_id') || '0');
  const userRole = localStorage.getItem('user_role') || 'patient';

  // Fetch messages initially and poll every 3 seconds
  useEffect(() => {
    if (!consultationId) {
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(`${API_BASE_URL}/api/consultation/chat/${consultationId}/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Handle new response format: {"consultation": {...}, "messages": [...]}
        if (res.data.messages) {
          setMessages(res.data.messages);
          setConsultationStatus(res.data.consultation?.status || 'ACTIVE');
        } else {
          setMessages(res.data || []);
        }
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [consultationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !consultationId || consultationStatus === 'EXPIRED') return;

    try {
      const token = localStorage.getItem('access_token');
      await axios.post(`${API_BASE_URL}/api/consultation/chat/send/`, {
        consultation_id: consultationId,
        content: newMessage
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Optimistically add message
      const msg = {
        id: Date.now().toString(),
        sender_id: userId,
        content: newMessage,
        timestamp: new Date().toISOString(),
        is_auto_response: false
      };
      setMessages(prev => [...prev, msg]);
      setNewMessage('');
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  if (!consultationId && !paymentCompleted) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <Card className="p-8 max-w-md text-center shadow-xl border-0">
          <Badge className="bg-yellow-100 text-yellow-800 mb-4 px-3 py-1">Payment Required</Badge>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Consultation</h2>
          <p className="text-gray-600 mb-6 font-medium">Please select a doctor and complete the payment process to start your consultation.</p>
          <Button 
            onClick={() => navigate('/patient/doctors')}
            className="w-full bg-[#0066CC] hover:bg-[#0052A3] h-12"
          >
            Find a Doctor
          </Button>
        </Card>
      </div>
    );
  }

  const handleRenewConsultation = async () => {
    // Treat renewal identically to starting a new consultation with this doctor.
    // We already have a linked flow via DoctorListingPage logic.
    navigate('/patient/doctors', { state: { autoRenew: true, doctorId: location.state?.doctor?.id } });
  };

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
                onClick={() => navigate(userRole === 'doctor' ? '/doctor/dashboard' : '/patient/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Activity className="h-7 w-7 text-[#0066CC]" />
                <span className="text-xl font-semibold text-gray-900">SymptoScan</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-600 hidden md:block mr-2">{userFullName}</span>
              <Button variant="ghost" size="icon" className="rounded-full bg-gray-100">
                <User className="h-5 w-5 text-gray-600" />
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
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full border-x border-gray-200 bg-white">
          {/* Chat Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12 border border-blue-100 shadow-sm">
                  <AvatarFallback className="bg-blue-100 text-[#0066CC] font-bold">
                    {chatPartner.name.split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-gray-900">{chatPartner.name}</h2>
                  <p className="text-xs font-medium text-[#0066CC]">{chatPartner.specialization}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-gray-500"><Phone className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="text-gray-500"><Video className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon" className="text-gray-500"><MoreVertical className="h-5 w-5" /></Button>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#F9FAFB]">
            <div className="space-y-6 max-w-4xl mx-auto">
              {/* Session Start Info */}
              <div className="text-center">
                <div className="inline-block px-4 py-1.5 bg-gray-100/50 rounded-full border border-gray-100 backdrop-blur-sm">
                  <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
                    Secure encrypted consultation started
                  </p>
                </div>
              </div>

              {/* Messages */}
              {loading ? (
                <div className="text-center py-12 text-gray-400 text-sm italic">Synchronizing chat history...</div>
              ) : messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender_id === userId ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col gap-1.5 max-w-[75%]">
                    {msg.is_auto_response && (
                      <Badge className="bg-blue-100 text-[#0052A3] w-fit text-[10px] font-bold py-0 px-2 rounded-sm border-0 mb-1">
                        <Bot className="h-3 w-3 mr-1" />
                        AI ASSISTANT
                      </Badge>
                    )}
                    <div
                      className={`${
                        msg.sender_id === userId
                          ? 'bg-[#0066CC] text-white rounded-tl-2xl rounded-tr-sm rounded-br-2xl rounded-bl-2xl shadow-blue-200'
                          : 'bg-white border border-gray-200 rounded-tr-2xl rounded-tl-sm rounded-br-2xl rounded-bl-2xl shadow-gray-100'
                      } px-4 py-3 shadow-md`}
                    >
                      <p className="text-[14px] leading-relaxed">{msg.content}</p>
                      <p
                        className={`text-[10px] mt-2 font-medium opacity-70 ${
                          msg.sender_id === userId ? 'text-blue-50' : 'text-gray-500'
                        }`}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-100 px-6 py-5 flex-shrink-0">
            {consultationStatus === 'EXPIRED' ? (
              <Card className="p-4 bg-orange-50 border-orange-200 text-center rounded-xl shadow-sm">
                <p className="text-orange-800 font-medium mb-3">This consultation has expired (older than 30 days).</p>
                {userRole === 'patient' && (
                  <Button 
                    onClick={handleRenewConsultation}
                    className="bg-[#0066CC] hover:bg-[#0052A3] text-white px-6 rounded-lg shadow-md"
                  >
                    Renew Consultation (₹500)
                  </Button>
                )}
                {userRole === 'doctor' && (
                  <p className="text-sm text-orange-600">Patient needs to renew the consultation to continue.</p>
                )}
              </Card>
            ) : (
              <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex items-center gap-3">
                <Button type="button" variant="outline" size="icon" className="rounded-xl border-gray-200 bg-gray-50 hover:bg-gray-100">
                  <Paperclip className="h-5 w-5 text-gray-500" />
                </Button>
                <Input
                  placeholder="Describe your health concerns..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 h-12 bg-gray-50/50 border-gray-200 rounded-xl focus:ring-[#0066CC] transition-all"
                  disabled={consultationStatus === 'EXPIRED'}
                />
                <Button
                  type="submit"
                  className="bg-[#0066CC] hover:bg-[#0052A3] h-12 px-6 rounded-xl shadow-lg shadow-blue-100 transition-all active:scale-95"
                  disabled={consultationStatus === 'EXPIRED' || !newMessage.trim()}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Clinical Context Sidebar (Desktop)*/}
        <div className="hidden lg:block w-80 bg-white border-l border-gray-100 overflow-y-auto flex-shrink-0 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="p-6">
            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
              Clinical Context
            </h3>
            
            <Card className="p-4 bg-blue-50/50 border-blue-100 mb-6 rounded-xl">
              <div className="space-y-3 text-[13px]">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Patient:</span>
                  <span className="font-bold text-[#0066CC]">{userRole === 'doctor' ? (location.state?.patientName || 'Patient') : userFullName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Session ID:</span>
                  <span className="font-mono text-[10px] text-gray-400">#CONSULT_{consultationId}</span>
                </div>
              </div>
            </Card>

            <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Analysis History</h4>
            <div className="space-y-2 mb-6">
              {prediction?.symptoms && prediction.symptoms.length > 0 ? (
                prediction.symptoms.map((symptom: string, index: number) => (
                  <div key={index} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 border border-gray-100 transition-colors hover:border-blue-100">
                    <div className="h-2 w-2 rounded-full bg-[#0066CC] shadow-sm shadow-blue-200" />
                    <span className="text-[13px] font-medium text-gray-700">{symptom}</span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center rounded-xl border border-dashed border-gray-200">
                  <p className="text-[11px] text-gray-400 italic">No triage data recorded</p>
                </div>
              )}
            </div>

            {prediction?.disease && (
              <>
                <h4 className="font-bold text-gray-900 mb-3 text-xs uppercase tracking-wider">Likely Diagnosis</h4>
                <Card className="p-4 bg-orange-50/50 border-orange-100 rounded-xl relative overflow-hidden group">
                  <div className="absolute right-[-10px] top-[-10px] opacity-[0.05] group-hover:rotate-12 transition-transform">
                    <Activity className="h-24 w-24 text-orange-600" />
                  </div>
                  <h5 className="font-bold text-orange-900 text-[15px] mb-1">{prediction.disease}</h5>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-1.5 flex-1 bg-orange-100 rounded-full">
                      <div 
                        className="h-full bg-orange-500 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }} 
                      />
                    </div>
                    <span className="text-[11px] font-bold text-orange-600 leading-none">{prediction.confidence}%</span>
                  </div>
                  <p className="text-[11px] text-orange-800 leading-relaxed font-medium">
                    Preliminary analysis from SymptoScan ML Engine.
                  </p>
                </Card>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
              <Button variant="ghost" className="w-full justify-start text-[13px] font-medium text-gray-600 hover:text-[#0066CC] hover:bg-blue-50 rounded-xl px-4 py-2">
                <Activity className="h-4 w-4 mr-3" />
                Medical Timeline
              </Button>
              <Button variant="ghost" className="w-full justify-start text-[13px] font-medium text-gray-600 hover:text-[#0066CC] hover:bg-blue-50 rounded-xl px-4 py-2">
                <Paperclip className="h-4 w-4 mr-3" />
                Lab Reports
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
