import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Activity, X, Search, LogOut, User, ArrowLeft } from 'lucide-react';
import { symptoms } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export default function SymptomInputPage() {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSymptoms = symptoms.filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSymptomToggle = (symptomName: string) => {
    if (selectedSymptoms.includes(symptomName)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptomName));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptomName]);
    }
  };

  const handlePrediction = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }

    // Navigate to prediction result with selected symptoms
    navigate('/patient/prediction', { state: { symptoms: selectedSymptoms } });
  };

  // Group symptoms by category
  const symptomsByCategory = symptoms.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category].push(symptom);
    return acc;
  }, {} as Record<string, typeof symptoms>);

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
            Check Your Symptoms
          </h1>
          <p className="text-gray-600">
            Select all symptoms you're experiencing to get an accurate prediction
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Symptom Selection */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-md border-0">
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search symptoms..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 h-12 bg-gray-50"
                  />
                </div>
              </div>

              {/* Symptoms by Category */}
              <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
                {searchQuery === '' ? (
                  // Show by category when not searching
                  Object.entries(symptomsByCategory).map(([category, categorySymptoms]) => (
                    <div key={category}>
                      <h3 className="text-sm font-semibold text-gray-700 mb-3">{category}</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {categorySymptoms.map((symptom) => (
                          <button
                            key={symptom.id}
                            onClick={() => handleSymptomToggle(symptom.name)}
                            className={`p-3 rounded-lg border-2 text-left transition-all ${selectedSymptoms.includes(symptom.name)
                                ? 'border-[#0066CC] bg-blue-50 text-[#0066CC]'
                                : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                          >
                            <div className="text-sm font-medium">{symptom.name}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  // Show filtered results when searching
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {filteredSymptoms.map((symptom) => (
                      <button
                        key={symptom.id}
                        onClick={() => handleSymptomToggle(symptom.name)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${selectedSymptoms.includes(symptom.name)
                            ? 'border-[#0066CC] bg-blue-50 text-[#0066CC]'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                      >
                        <div className="text-sm font-medium">{symptom.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{symptom.category}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Selected Symptoms Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 shadow-md border-0 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                Selected Symptoms ({selectedSymptoms.length})
              </h3>

              {selectedSymptoms.length > 0 ? (
                <>
                  <div className="space-y-2 mb-6 max-h-[300px] overflow-y-auto">
                    {selectedSymptoms.map((symptom, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded-lg bg-blue-50"
                      >
                        <span className="text-sm text-gray-900">{symptom}</span>
                        <button
                          onClick={() => handleSymptomToggle(symptom)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button
                      className="w-full bg-[#0066CC] hover:bg-[#0052A3] h-12"
                      onClick={handlePrediction}
                    >
                      Run Prediction
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedSymptoms([])}
                    >
                      Clear All
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm text-gray-500">No symptoms selected</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Select symptoms from the list
                  </p>
                </div>
              )}

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> This is an AI-powered prediction tool.
                  Always consult with a healthcare professional for accurate diagnosis.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
