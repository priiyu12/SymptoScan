import { useLocation, useNavigate } from 'react-router-dom';

function PredictionResultPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const prediction = location.state?.prediction;

  if (!prediction) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <h2>No prediction data found.</h2>
          <button onClick={() => navigate('/symptoms')} style={styles.button}>
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Prediction Result</h1>

        <div style={styles.section}>
          <p><strong>Symptoms:</strong> {prediction.symptoms}</p>
          <p><strong>Predicted Disease:</strong> {prediction.predicted_disease}</p>
          <p><strong>Confidence Score:</strong> {prediction.confidence_score}</p>
          <p><strong>Precautions:</strong> {prediction.precautions}</p>
          <p><strong>Date:</strong> {new Date(prediction.created_at).toLocaleString()}</p>
        </div>

        <div style={styles.buttonRow}>
          <button onClick={() => navigate('/symptoms')} style={styles.secondaryButton}>
            Check Again
          </button>
          <button onClick={() => navigate('/prediction-history')} style={styles.primaryButton}>
            View History
          </button>
          <button onClick={() => navigate('/doctors')} style={styles.primaryButton}>
            Find Doctors
          </button>
        </div>
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
    marginBottom: '20px',
  },
  section: {
    lineHeight: 1.8,
    fontSize: '15px',
    marginBottom: '24px',
  },
  buttonRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
  },
  primaryButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  secondaryButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#6b7280',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  button: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default PredictionResultPage;