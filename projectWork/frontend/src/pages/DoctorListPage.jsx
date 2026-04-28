import { useEffect, useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');

  const navigate = useNavigate();

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');

    try {
      let query = `/doctors/?`;

      if (search) query += `search=${search}&`;
      if (specialization) query += `specialization=${specialization}&`;

      const response = await api.get(query);
      setDoctors(response.data);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
      setError('Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchDoctors();
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading doctors...</h2>;
  }

  if (error) {
    return <h2 style={{ padding: '20px', color: 'crimson' }}>{error}</h2>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>Find Doctors</h1>

        {/* Search & Filter */}
        <form onSubmit={handleSearch} style={styles.filterRow}>
          <input
            type="text"
            placeholder="Search doctor name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={styles.input}
          />

          <input
            type="text"
            placeholder="Specialization..."
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Search
          </button>
        </form>

        {doctors.length === 0 ? (
          <div style={styles.emptyCard}>
            <p>No doctors found.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {doctors.map((doctor) => (
              <div key={doctor.id} style={styles.card}>
                <h3>{doctor.full_name}</h3>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Experience:</strong> {doctor.experience_years} years</p>
                <p><strong>Fee:</strong> ₹{doctor.consultation_fee}</p>
                <p>
                  <strong>Status:</strong>{' '}
                  {doctor.available_status ? 'Available' : 'Not Available'}
                </p>

                <button
                  onClick={() => navigate(`/doctors/${doctor.id}`)}
                  style={styles.viewButton}
                >
                  View Profile
                </button>
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
    maxWidth: '1000px',
    margin: '0 auto',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  filterRow: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '200px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '16px',
  },
  card: {
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '12px',
    boxShadow: '0 6px 15px rgba(0,0,0,0.06)',
  },
  viewButton: {
    marginTop: '10px',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#16a34a',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
  },
  emptyCard: {
    textAlign: 'center',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
  },
};

export default DoctorListPage;