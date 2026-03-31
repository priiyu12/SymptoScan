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
        const res = await axios.get('http://127.0.0.1:8000/api/users/doctors/', {
          headers: { Authorization: `Bearer ${token}` }
        });

        // Map backend response to UI expected fields
        const formattedDoctors = res.data.map((doc: any) => ({
          id: doc.id,
          name: doc.full_name || 'Dr. Unknown',
          specialization: doc.doctor_profile?.specialization || 'General',
          availability: doc.doctor_profile?.is_available ? 'Available' : 'Offline',
          rating: 4.8, // Mock rating
          reviews: 120,
          patients: 500,
          experience: doc.doctor_profile?.years_of_experience ? `${doc.doctor_profile.years_of_experience} years` : '10+ years',
          education: 'MD, Medical University',
          consultationFee: doc.doctor_profile?.consultation_fee || 150,
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
      // Create or get existing chatroom with this doctor
      const res = await axios.post('http://127.0.0.1:8000/api/predict/chatroom/', {
        doctor_id: doctor.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/patient/chat', { state: { roomId: res.data.id, doctor } });
    } catch (error) {
      console.error("Failed to connect with doctor", error);
      alert("Could not start consultation. Please try again later.");
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'Offline':
        return 'bg-gray-100 text-gray-800';
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
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/patient/dashboard')}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Find a Doctor
          </h1>
          <p className="text-gray-600">
            Connect with certified healthcare professionals for consultation
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 shadow-md border-0">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search doctors by name or specialization..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12 bg-white"
                />
              </div>
            </div>

            {/* Specialization Filter */}
            <div className="flex gap-2 flex-wrap">
              {specializations.map((spec) => (
                <Button
                  key={spec}
                  variant={selectedSpecialization === spec ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedSpecialization(spec)}
                  className={selectedSpecialization === spec ? 'bg-[#0066CC] hover:bg-[#0052A3]' : ''}
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
                {/* Doctor Header */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
                  <div className="flex items-start justify-between mb-4">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback className="bg-white text-blue-600 text-xl">
                        {doctor.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <Badge className={getAvailabilityColor(doctor.availability)}>
                      {doctor.availability}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
                  <p className="text-blue-100 text-sm">{doctor.specialization}</p>
                </div>

                {/* Doctor Details */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="h-4 w-4 text-gray-400" />
                      <span>{doctor.education}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{doctor.patients.toLocaleString()} patients</span>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < Math.floor(doctor.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                            }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                    <span className="text-sm text-gray-500">(120+ reviews)</span>
                  </div>

                  {/* Consultation Fee */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-600">Consultation Fee</span>
                    <span className="text-xl font-bold text-gray-900">${doctor.consultationFee}</span>
                  </div>

                  {/* Action Button */}
                  <Button
                    className="w-full bg-[#0066CC] hover:bg-[#0052A3]"
                    onClick={() => handleConsultation(doctor)}
                    disabled={doctor.availability === 'Offline'}
                  >
                    {doctor.availability === 'Offline' ? 'Currently Offline' : 'Request Consultation'}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {filteredDoctors.length === 0 && (
          <Card className="p-12 text-center shadow-md border-0">
            <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </Card>
        )}
      </div>
    </div>
  );
}
