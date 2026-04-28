import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

function SymptomFormPage() {
  const navigate = useNavigate();

  const [symptomInput, setSymptomInput] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddSymptom = () => {
    const trimmed = symptomInput.trim();

    if (!trimmed) return;

    if (symptoms.includes(trimmed.toLowerCase())) {
      setError('Symptom already added');
      return;
    }

    setSymptoms((prev) => [...prev, trimmed.toLowerCase()]);
    setSymptomInput('');
    setError('');
  };

  const handleRemoveSymptom = (indexToRemove) => {
    setSymptoms((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (symptoms.length === 0) {
      setError('Please add at least one symptom');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/predictions/predict/', {
        symptoms: symptoms,
      });

      navigate('/prediction-result', {
        state: {
          prediction: response.data,
        },
      });
    } catch (err) {
      console.error('Prediction failed:', err);
      setError('Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Symptom Checker</h1>
        <p style={styles.subtitle}>Enter your symptoms to get a prediction</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputRow}>
            <input
              type="text"
              value={symptomInput}
              onChange={(e) => setSymptomInput(e.target.value)}
              placeholder="Enter symptom (e.g. fever)"
              style={styles.input}
            />
            <button type="button" onClick={handleAddSymptom} style={styles.addButton}>
              Add
            </button>
          </div>

          {symptoms.length > 0 && (
            <div style={styles.symptomList}>
              {symptoms.map((symptom, index) => (
                <div key={index} style={styles.symptomTag}>
                  <span>{symptom}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSymptom(index)}
                    style={styles.removeButton}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton} disabled={loading}>
            {loading ? 'Predicting...' : 'Get Prediction'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f4f7fb',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '700px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '14px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '8px',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputRow: {
    display: 'flex',
    gap: '10px',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },
  addButton: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  symptomList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
  },
  symptomTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#e8f0fe',
    color: '#1d4ed8',
    padding: '8px 12px',
    borderRadius: '999px',
    fontSize: '14px',
  },
  removeButton: {
    border: 'none',
    background: 'transparent',
    color: '#1d4ed8',
    fontSize: '18px',
    cursor: 'pointer',
    lineHeight: 1,
  },
  submitButton: {
    padding: '13px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#16a34a',
    color: '#fff',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  error: {
    color: 'crimson',
    margin: 0,
  },
};

export default SymptomFormPage;