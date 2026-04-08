import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Activity, Search, Star, Users, Award, Clock, ArrowLeft, User, LogOut } from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function DoctorListingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>('all');

  const [doctors, setDoctors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get(' + API_BASE_URL + "/api/users/doctors/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Map backend response (which now includes only active/available docs)
        const formattedDoctors = res.data.map((doc: any) => ({
          id: doc.id,
          name: doc.full_name || 'Dr. Unknown',
          specialization: doc.doctor_profile?.specialization || 'General',
          availability: doc.doctor_profile?.is_available ? 'Available' : 'Offline',
          rating: 4.8, 
          reviews: 120,
          patients: 500,
          experience: doc.doctor_profile?.years_of_experience ? `${doc.doctor_profile.years_of_experience} years` : '10+ years',
          education: 'Certified Medical Professional',
          consultationFee: doc.doctor_profile?.consultation_fee || 500,
        }));
        setDoctors(formattedDoctors);
      } catch (err) {
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const specializations = ['all', ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleConsultation = async (doctor: any) => {
    try {
      const token = localStorage.getItem('access_token');
      
      const res = await axios.post(' + API_BASE_URL + "/api/consultation/request/', {
        doctor_id: doctor.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { consultation_id, razorpay_order_id, amount, currency, key_id, is_simulated } = res.data;

      const completePayment = async (razorpay_payment_id: string, razorpay_signature: string) => {
        try {
          const verifyRes = await axios.post(' + API_BASE_URL + "/api/consultation/verify/', {
            consultation_id,
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (verifyRes.data.status === 'ACTIVE') {
            navigate('/patient/chat', { state: { consultationId: consultation_id, doctor, paymentCompleted: true } });
          }
        } catch (err) {
          console.error("Payment verification failed", err);
          alert("Payment verification failed.");
        }
      };

      if (is_simulated) {
        alert("SymptoScan Demo: Processing Simulated Payment (₹" + amount + ")...");
        setTimeout(() => {
          completePayment("pay_mock_" + Math.random().toString(36).substring(7), "sig_mock_" + Math.random().toString(36).substring(7));
        }, 1500);
      } else {
        const options = {
          key: key_id,
          amount: amount * 100,
          currency: currency,
          name: "SymptoScan",
          description: `Consultation with ${doctor.name}`,
          order_id: razorpay_order_id,
          handler: (response: any) => {
            completePayment(response.razorpay_payment_id, response.razorpay_signature);
          },
          prefill: {
            name: localStorage.getItem('user_full_name') || "",
            email: localStorage.getItem('user_email') || "",
          },
          theme: { color: "#0066CC" },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }

    } catch (error) {
      console.error("Failed to connect with doctor", error);
      alert("Could not start consultation.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/patient/dashboard')}>
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find a Doctor</h1>
          <p className="text-gray-600">Connect with active healthcare professionals</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 shadow-md border-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {specializations.map((spec) => (
                <Button
                  key={spec}
                  variant={selectedSpecialization === spec ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialization(spec)}
                  className={selectedSpecialization === spec ? 'bg-[#0066CC]' : ''}
                >
                  {spec === 'all' ? 'All' : spec}
                </Button>
              ))}
            </div>
          </div>
        </Card>

        {/* Doctors Grid */}
        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading available doctors...</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDoctors.map((doctor) => (
              <Card key={doctor.id} className="overflow-hidden shadow-md border-0 hover:shadow-xl transition-shadow">
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white text-center">
                  <Avatar className="h-20 w-20 mx-auto border-4 border-white shadow-lg mb-4">
                    <AvatarFallback className="bg-white text-blue-600 text-xl font-bold">
                      {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                  <p className="text-blue-100 text-sm">{doctor.specialization}</p>
                </div>

                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-y border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Consultation Fee</span>
                      <span className="text-xl font-bold text-[#0066CC]">₹{doctor.consultationFee}</span>
                    </div>
                  </div>

                  <Button
                    className="w-full bg-[#0066CC]"
                    onClick={() => handleConsultation(doctor)}
                    disabled={doctor.availability === 'Offline'}
                  >
                    {doctor.availability === 'Offline' ? 'Currently Offline' : 'Consult Now'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
