import React, { useState } from 'react';
import axios from 'axios';

const PredictDisease = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [predictionResult, setPredictionResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const symptomsList = [
    'fever',
    'cough',
    'headache',
    'fatigue',
    'sore_throat',
    'nausea',
    'vomiting',
    'shortness_of_breath',
    'muscle_pain',
    'diarrhea',
    'loss_of_taste',
    'loss_of_smell',
    'rash',
    'joint_pain',
    'chest_pain',
    'abdominal_pain',
    'weight_loss'
  ];

  const handleSymptomToggle = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter((s) => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handlePredict = async () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom.');
      return;
    }

    setLoading(true);
    setPredictionResult('');

    try {
      const accessToken = localStorage.getItem('access_token');

      if (!accessToken) {
        alert('You are not logged in. Please login first.');
        setLoading(false);
        return;
      }

      const symptomData = {};
      symptomsList.forEach((symptom) => {
        symptomData[symptom] = selectedSymptoms.includes(symptom) ? 1 : 0;
      });

      const response = await axios.post(
        'http://127.0.0.1:8000/api/predict/',
        symptomData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setPredictionResult(response.data.prediction);
    } catch (error) {
      console.error('Prediction error:', error.response || error.message);
      alert('An error occurred while predicting.');
    } finally {
      setLoading(false);
    }
  };

  const filteredSymptoms = symptomsList.filter((symptom) =>
    symptom.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-200 via-purple-300 to-indigo-400">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4 text-center">Predict Disease</h2>

        <input
          type="text"
          placeholder="Search symptoms..."
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="max-h-48 overflow-y-auto mb-4">
          {filteredSymptoms.map((symptom) => (
            <div key={symptom} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={symptom}
                className="mr-2"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => handleSymptomToggle(symptom)}
              />
              <label htmlFor={symptom}>{symptom.replace(/_/g, ' ')}</label>
            </div>
          ))}
        </div>

        <button
          onClick={handlePredict}
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg text-white ${
            loading ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {loading ? 'Predicting...' : 'Predict'}
        </button>

        {predictionResult && (
          <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-lg text-center">
            <strong>Prediction:</strong> {predictionResult}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictDisease;
