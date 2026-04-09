import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card } from '../components/ui/card';
import { Activity } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { API_BASE_URL } from '../utils/api';


export default function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: 'patient',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: 'General Physician',
    consultation_fee: '500'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setLoading(true);
    try {
      const payload: any = {
        email: formData.email,
        full_name: formData.name,
        password: formData.password,
        re_password: formData.confirmPassword,
        role: formData.role
      };

      if (formData.role === 'doctor') {
        payload.specialization = formData.specialization;
        payload.consultation_fee = parseFloat(formData.consultation_fee);
      }

      await axios.post(`${API_BASE_URL}/api/auth/users/`, payload);
      alert('Account created successfully! Please sign in.');
      navigate('/login');
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.response?.data?.email?.[0] || err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Activity className="h-10 w-10 text-[#0066CC]" />
            <span className="text-3xl font-bold text-gray-900">SymptoScan</span>
          </div>
          <p className="text-gray-600">Create your account</p>
        </div>

        <Card className="p-8 shadow-2xl border-0">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="role">I am a</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger className="h-12 bg-white">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-12 bg-white border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="h-12 bg-white border-gray-300"
                required
              />
            </div>

            {formData.role === 'doctor' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    type="text"
                    placeholder="General Physician"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="h-12 bg-white border-gray-300"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fee">Consultation Fee (INR)</Label>
                  <Input
                    id="fee"
                    type="number"
                    placeholder="500"
                    value={formData.consultation_fee}
                    onChange={(e) => setFormData({ ...formData, consultation_fee: e.target.value })}
                    className="h-12 bg-white border-gray-300"
                    required
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="h-12 bg-white border-gray-300"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="h-12 bg-white border-gray-300"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-[#0066CC] hover:bg-[#0052A3] text-base"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-[#0066CC] hover:underline font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </Card>

        {/* Back to home */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to home
          </button>
        </div>
      </div>
    </div>
  );
}
