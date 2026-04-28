import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function ConsultationPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');

  const fetchConsultations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get('/consultations/my/');
      setConsultations(response.data);
    } catch (err) {
      console.error('Failed to fetch consultations:', err);
      setError('Failed to load consultations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleStatusUpdate = async (consultationId, status) => {
    try {
      setActionLoadingId(consultationId);

      await api.patch(`/consultations/${consultationId}/status/`, {
        status,
      });

      setConsultations((prev) =>
        prev.map((item) =>
          item.id === consultationId ? { ...item, status } : item
        )
      );
    } catch (err) {
      console.error('Failed to update consultation status:', err);
      alert('Failed to update consultation status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading consultations...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: '20px', color: 'crimson' }}>{error}</h2>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          {user?.role === 'doctor' ? 'Incoming Consultations' : 'My Consultations'}
        </h1>

        {consultations.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>No consultations found.</p>
          </div>
        ) : (
          <div style={styles.list}>
            {consultations.map((consultation) => (
              <div key={consultation.id} style={styles.card}>
                <div style={styles.infoBlock}>
                  {user?.role === 'doctor' ? (
                    <p><strong>Patient:</strong> {consultation.patient_name}</p>
                  ) : (
                    <p><strong>Doctor:</strong> {consultation.doctor_name}</p>
                  )}

                  <p><strong>Specialization:</strong> {consultation.doctor_specialization}</p>
                  <p>
                    <strong>Status:</strong>{' '}
                    <span style={getStatusStyle(consultation.status)}>
                      {consultation.status}
                    </span>
                  </p>
                  <p><strong>Notes:</strong> {consultation.notes || 'No notes provided'}</p>
                  <p style={styles.date}>
                    {new Date(consultation.created_at).toLocaleString()}
                  </p>
                </div>

                <div style={styles.buttonRow}>
                  {user?.role === 'doctor' && consultation.status === 'pending' && (
                    <>
                      <button
                        style={styles.acceptButton}
                        onClick={() => handleStatusUpdate(consultation.id, 'accepted')}
                        disabled={actionLoadingId === consultation.id}
                      >
                        {actionLoadingId === consultation.id ? 'Updating...' : 'Accept'}
                      </button>

                      <button
                        style={styles.rejectButton}
                        onClick={() => handleStatusUpdate(consultation.id, 'rejected')}
                        disabled={actionLoadingId === consultation.id}
                      >
                        {actionLoadingId === consultation.id ? 'Updating...' : 'Reject'}
                      </button>
                    </>
                  )}

                  {user?.role === 'doctor' && consultation.status === 'accepted' && (
                    <button
                      style={styles.completeButton}
                      onClick={() => handleStatusUpdate(consultation.id, 'completed')}
                      disabled={actionLoadingId === consultation.id}
                    >
                      {actionLoadingId === consultation.id ? 'Updating...' : 'Mark Completed'}
                    </button>
                  )}

                  {consultation.status === 'accepted' && (
                    <button
                      style={styles.chatButton}
                      onClick={() => navigate(`/chat/${consultation.id}`)}
                    >
                      Open Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const getStatusStyle = (status) => {
  switch (status) {
    case 'accepted':
      return { color: '#15803d', fontWeight: '700' };
    case 'rejected':
      return { color: '#dc2626', fontWeight: '700' };
    case 'completed':
      return { color: '#2563eb', fontWeight: '700' };
    default:
      return { color: '#b45309', fontWeight: '700' };
  }
};

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
    textAlign: 'center',
    marginBottom: '20px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.06)',
  },
  infoBlock: {
    lineHeight: 1.8,
    fontSize: '15px',
  },
  date: {
    color: '#666',
    fontSize: '13px',
    marginTop: '6px',
  },
  buttonRow: {
    marginTop: '16px',
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  acceptButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#16a34a',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  rejectButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#dc2626',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  completeButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  chatButton: {
    padding: '10px 14px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#7c3aed',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: '600',
  },
  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '30px',
    textAlign: 'center',
  },
};

export default ConsultationPage;