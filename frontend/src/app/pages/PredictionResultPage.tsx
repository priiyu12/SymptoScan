import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, AlertCircle, CheckCircle, Stethoscope, ArrowLeft, User, LogOut, Download, Share2 } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { symptoms as mockSymptoms } from '../data/mockData';
import { API_BASE_URL } from '../utils/api';


export default function PredictionResultPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const symptoms = location.state?.symptoms || [];

  const [prediction, setPrediction] = useState<any>(null);
  const [showAnimation, setShowAnimation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPrediction = async () => {
      if (symptoms.length === 0) {
        setError("No symptoms provided.");
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('access_token');

        // Convert array of symptom strings to the dictionary format expected by backend
        const symptomDict: Record<string, number> = {};
        symptoms.forEach((s: string) => {
          const matchedSymptom = mockSymptoms.find(ms => ms.name === s);
          if (matchedSymptom) {
            symptomDict[matchedSymptom.value] = 1;
          } else {
            // fallback just in case
            symptomDict[s.toLowerCase().replace(/ /g, '_')] = 1;
          }
        });

        const res = await axios.post(`${API_BASE_URL}/api/prediction/predict/`, symptomDict, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setPrediction({
          name: res.data.prediction,
          severity: 'medium', // Defaulting as backend doesn't provide severity yet
          confidence: parseFloat(res.data.confidence), 
          description: `Based on your symptoms, we predict you might have ${res.data.prediction}.`,
          precautions: res.data.precautions || [
            "Rest well",
            "Stay hydrated",
            "Consult a doctor if symptoms persist"
          ]
        });

        setTimeout(() => setShowAnimation(true), 100);
      } catch (err: any) {
        console.error("Prediction error:", err);
        if (err.response?.status === 401) {
          setError("Your session has expired. Please log out and log back in.");
        } else if (err.response?.status === 400) {
          setError(err.response.data.error || "Invalid symptoms provided. Please go back and select symptoms.");
        } else {
          setError("Failed to get prediction from the server.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [symptoms]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return { bg: 'bg-red-100', text: 'text-red-800', icon: 'text-red-500' };
      case 'medium':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: 'text-yellow-500' };
      case 'low':
        return { bg: 'bg-green-100', text: 'text-green-800', icon: 'text-green-500' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800', icon: 'text-gray-500' };
    }
  };

  const severityColors = prediction ? getSeverityColor(prediction.severity) : getSeverityColor('low');

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
                onClick={() => navigate('/patient/symptoms')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Activity className="h-7 w-7 text-[#0066CC]" />
                <span className="text-xl font-semibold text-gray-900">SymptoScan</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Prediction Results
          </h1>
          <p className="text-gray-600">
            Based on your symptoms, here's our analysis
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center p-12">
            <Activity className="h-12 w-12 text-[#0066CC] animate-pulse mb-4" />
            <h2 className="text-xl font-semibold text-gray-700">Analyzing your symptoms...</h2>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 border border-red-200 rounded-lg text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
            <p className="text-red-600">{error}</p>
            <Button className="mt-4" onClick={() => navigate('/patient/dashboard')}>Return to Dashboard</Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Predicted Disease Card */}
              <Card className={`p-8 shadow-lg border-0 transition-all duration-500 ${showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={`h-16 w-16 rounded-2xl ${severityColors.bg} flex items-center justify-center`}>
                      <AlertCircle className={`h-8 w-8 ${severityColors.icon}`} />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {prediction.name}
                      </h2>
                      <Badge className={`${severityColors.bg} ${severityColors.text}`}>
                        {prediction.severity.toUpperCase()} SEVERITY
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{prediction.description}</p>

                {/* Confidence Score */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Prediction Confidence</span>
                    <span className="font-semibold text-gray-900">{prediction.confidence}%</span>
                  </div>
                  <Progress value={prediction.confidence} className="h-3" />
                  <p className="text-xs text-gray-500">
                    {prediction.confidence >= 90 && 'Very high confidence in this prediction'}
                    {prediction.confidence >= 75 && prediction.confidence < 90 && 'High confidence in this prediction'}
                    {prediction.confidence < 75 && 'Moderate confidence - consider consulting a doctor'}
                  </p>
                </div>
              </Card>

              {/* Precautions Card */}
              <Card className="p-6 shadow-md border-0">
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-[#10B981]" />
                  Recommended Precautions
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {prediction.precautions.map((precaution: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                      <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-green-700">{index + 1}</span>
                      </div>
                      <span className="text-gray-700">{precaution}</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Warning Card */}
              <Card className="p-6 bg-orange-50 border border-orange-200 shadow-sm">
                <div className="flex gap-3">
                  <AlertCircle className="h-6 w-6 text-orange-600 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-900 mb-2">Important Notice</h4>
                    <p className="text-sm text-orange-800">
                      This prediction is based on AI analysis and should not replace professional
                      medical advice. If symptoms persist or worsen, please consult a healthcare
                      professional immediately.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 bg-[#0066CC] hover:bg-[#0052A3] h-12"
                  onClick={() => navigate('/patient/doctors')}
                >
                  <Stethoscope className="h-5 w-5 mr-2" />
                  Consult a Doctor
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/patient/symptoms')}
                >
                  Check Again
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Your Symptoms */}
              <Card className="p-6 shadow-md border-0 sticky top-24">
                <h3 className="font-semibold text-gray-900 mb-4">Your Symptoms</h3>
                <div className="space-y-2 mb-6">
                  {symptoms.map((symptom: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-lg bg-blue-50"
                    >
                      <div className="h-2 w-2 rounded-full bg-[#0066CC]" />
                      <span className="text-sm text-gray-900">{symptom}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="w-full" size="sm">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </Button>
                </div>
              </Card>

              {/* Quick Stats */}
              <Card className="p-6 shadow-md border-0 bg-gradient-to-br from-blue-50 to-green-50">
                <h3 className="font-semibold text-gray-900 mb-4">Did you know?</h3>
                <div className="space-y-4 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Early detection can improve treatment outcomes significantly</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Regular health check-ups help prevent serious conditions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span>Our doctors are available 24/7 for consultations</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}