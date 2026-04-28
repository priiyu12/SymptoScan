import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function DoctorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDoctorDetail = async () => {
    try {
      const response = await api.get(`/doctors/${id}/`);
      setDoctor(response.data);
    } catch (err) {
      console.error('Failed to fetch doctor detail:', err);
      setError('Failed to load doctor details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctorDetail();
  }, [id]);

  const handleConsultationRequest = async () => {
    setError('');
    setSuccess('');
    setSubmitting(true);

    try {
      await api.post('/consultations/request/', {
        doctor_id: Number(id),
        notes: note,
      });

      setSuccess('Consultation request sent successfully.');
      setTimeout(() => {
        navigate('/consultations');
      }, 1200);
    } catch (err) {
      console.error('Failed to request consultation:', err);
      setError('Failed to send consultation request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading doctor details...</h2>;
  }

  if (error && !doctor) {
    return <h2 style={{ padding: '20px', color: 'crimson' }}>{error}</h2>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>{doctor.full_name}</h1>
        <p style={styles.subtitle}>{doctor.specialization}</p>

        <div style={styles.infoSection}>
          <p><strong>Email:</strong> {doctor.email}</p>
          <p><strong>Qualification:</strong> {doctor.qualification || 'Not provided'}</p>
          <p><strong>Experience:</strong> {doctor.experience_years} years</p>
          <p><strong>Consultation Fee:</strong> ₹{doctor.consultation_fee}</p>
          <p><strong>Available:</strong> {doctor.available_status ? 'Yes' : 'No'}</p>
          <p><strong>Verified:</strong> {doctor.verified ? 'Yes' : 'No'}</p>
          <p><strong>Bio:</strong> {doctor.bio || 'No bio available.'}</p>
        </div>

        <div style={styles.formSection}>
          <label style={styles.label}>Add a note for consultation (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write about your concern..."
            rows="4"
            style={styles.textarea}
          />
        </div>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <div style={styles.buttonRow}>
          <button onClick={() => navigate('/doctors')} style={styles.secondaryButton}>
            Back to Doctors
          </button>

          <button
            onClick={handleConsultationRequest}
            style={styles.primaryButton}
            disabled={submitting || !doctor.available_status}
          >
            {submitting ? 'Sending...' : 'Request Consultation'}
          </button>
        </div>

        {!doctor.available_status && (
          <p style={styles.warning}>
            This doctor is currently not available for consultation.
          </p>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '760px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '14px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
  },
  title: {
    marginBottom: '8px',
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 0,
    marginBottom: '24px',
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '600',
  },
  infoSection: {
    lineHeight: 1.9,
    fontSize: '15px',
    marginBottom: '24px',
  },
  formSection: {
    marginBottom: '18px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  buttonRow: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '10px',
  },
  primaryButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#16a34a',
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
  error: {
    color: 'crimson',
    marginTop: '10px',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
  warning: {
    marginTop: '14px',
    color: '#b45309',
    fontWeight: '600',
  },
};

export default DoctorDetailPage;