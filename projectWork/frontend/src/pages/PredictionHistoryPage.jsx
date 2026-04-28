import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function PredictionHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const response = await api.get('/predictions/history/');
      setHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load prediction history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading history...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: '20px', color: 'crimson' }}>{error}</h2>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Prediction History</h1>

        {history.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>No prediction history found.</p>
            <button onClick={() => navigate('/symptoms')} style={styles.primaryButton}>
              Start Prediction
            </button>
          </div>
        ) : (
          <div style={styles.list}>
            {history.map((item) => (
              <div key={item.id} style={styles.card}>
                <div style={styles.section}>
                  <p><strong>Symptoms:</strong> {item.symptoms}</p>
                  <p><strong>Disease:</strong> {item.predicted_disease}</p>
                  <p><strong>Confidence:</strong> {item.confidence_score}</p>
                  <p><strong>Precautions:</strong> {item.precautions}</p>
                  <p style={styles.date}>
                    {new Date(item.created_at).toLocaleString()}
                  </p>
                </div>

                <div style={styles.buttonRow}>
                  <button
                    onClick={() =>
                      navigate('/prediction-result', {
                        state: { prediction: item },
                      })
                    }
                    style={styles.secondaryButton}
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => navigate('/doctors')}
                    style={styles.primaryButton}
                  >
                    Find Doctor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f4f7fb',
    padding: '20px',
  },
  container: {
    maxWidth: '900px',
    margin: '0 auto',
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.06)',
  },
  section: {
    lineHeight: 1.8,
    fontSize: '14px',
  },
  date: {
    color: '#777',
    fontSize: '13px',
    marginTop: '6px',
  },
  buttonRow: {
    marginTop: '14px',
    display: 'flex',
    gap: '10px',
  },
  primaryButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6b7280',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
  },
};

export default PredictionHistoryPage;