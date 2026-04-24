// Core product features explaining the main services
// offered by the SymptoScan healthcare platform.
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, Stethoscope, History, ShieldCheck, Users, TrendingUp } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Activity className="h-8 w-8 text-[#0066CC]" />
              <span className="text-2xl font-semibold text-gray-900">SymptoScan</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
              <Button
                className="bg-[#0066CC] hover:bg-[#0052A3]"
                onClick={() => navigate('/register')}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Smart Symptom Analysis for
            <br />
            <span className="text-[#0066CC]">Better Health Decisions</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get instant disease predictions powered by AI and connect with top healthcare professionals
            for expert consultations. Your health journey starts here.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#0066CC] hover:bg-[#0052A3] text-lg px-8 py-6"
              onClick={() => navigate('/register')}
            >
              Get Started Free
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl p-12 shadow-2xl">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 bg-white/80 backdrop-blur border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Activity className="h-6 w-6 text-[#0066CC]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">AI Analysis</h3>
                </div>
                <p className="text-sm text-gray-600">Advanced symptom analysis in seconds</p>
              </Card>
              <Card className="p-6 bg-white/80 backdrop-blur border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                    <Stethoscope className="h-6 w-6 text-[#10B981]" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Expert Doctors</h3>
                </div>
                <p className="text-sm text-gray-600">Connect with certified healthcare professionals</p>
              </Card>
              <Card className="p-6 bg-white/80 backdrop-blur border-0 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                </div>
                <p className="text-sm text-gray-600">Your health data is always protected</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Healthcare Solution</h2>
          <p className="text-xl text-gray-600">Everything you need for better health management</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <Card className="p-8 hover:shadow-xl transition-shadow border-0 shadow-md">
            <div className="h-16 w-16 rounded-2xl bg-blue-100 flex items-center justify-center mb-6">
              <Activity className="h-8 w-8 text-[#0066CC]" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Disease Prediction</h3>
            <p className="text-gray-600 mb-4">
              Enter your symptoms and get instant AI-powered disease predictions with confidence scores
              and recommended precautions.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0066CC]" />
                Accurate symptom analysis
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0066CC]" />
                Confidence scoring
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#0066CC]" />
                Health recommendations
              </li>
            </ul>
          </Card>

          {/* Feature 2 */}
          <Card className="p-8 hover:shadow-xl transition-shadow border-0 shadow-md">
            <div className="h-16 w-16 rounded-2xl bg-green-100 flex items-center justify-center mb-6">
              <Stethoscope className="h-8 w-8 text-[#10B981]" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">Doctor Consultation</h3>
            <p className="text-gray-600 mb-4">
              Connect with certified doctors for professional consultations. Get expert advice
              through real-time chat.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                Certified specialists
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                Real-time messaging
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                Flexible scheduling
              </li>
            </ul>
          </Card>

          {/* Feature 3 */}
          <Card className="p-8 hover:shadow-xl transition-shadow border-0 shadow-md">
            <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
              <History className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">History Tracking</h3>
            <p className="text-gray-600 mb-4">
              Keep track of all your predictions and consultations. Access your complete health
              history anytime, anywhere.
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Complete health records
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Consultation archive
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-purple-600" />
                Progress monitoring
              </li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[#0066CC] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <Users className="h-12 w-12 text-white mx-auto mb-3" />
              <div className="text-4xl font-bold text-white mb-2">10K+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div>
              <Activity className="h-12 w-12 text-white mx-auto mb-3" />
              <div className="text-4xl font-bold text-white mb-2">50K+</div>
              <div className="text-blue-100">Predictions Made</div>
            </div>
            <div>
              <Stethoscope className="h-12 w-12 text-white mx-auto mb-3" />
              <div className="text-4xl font-bold text-white mb-2">120+</div>
              <div className="text-blue-100">Expert Doctors</div>
            </div>
            <div>
              <TrendingUp className="h-12 w-12 text-white mx-auto mb-3" />
              <div className="text-4xl font-bold text-white mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="p-12 text-center bg-gradient-to-br from-blue-50 to-green-50 border-0 shadow-xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust SymptoScan for their health decisions
          </p>
          <Button
            size="lg"
            className="bg-[#0066CC] hover:bg-[#0052A3] text-lg px-12 py-6"
            onClick={() => navigate('/register')}
          >
            Create Free Account
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-[#0066CC]" />
                <span className="text-xl font-semibold">SymptoScan</span>
              </div>
              <p className="text-gray-400 text-sm">
                Smart healthcare solutions for everyone. Predict, consult, and track your health journey.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Features</li>
                <li>Pricing</li>
                <li>How It Works</li>
                <li>FAQs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Careers</li>
                <li>Contact</li>
                <li>Blog</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
                <li>Disclaimer</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 SymptoScan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
