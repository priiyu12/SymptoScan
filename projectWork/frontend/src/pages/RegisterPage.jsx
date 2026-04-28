import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function RegisterPage() {
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'patient',
    specialization: '',
    qualification: '',
    experience_years: 0,
    consultation_fee: 0,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const isDoctor = formData.role === 'doctor';

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: name === 'experience_years' || name === 'consultation_fee' ? value : value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const payload = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      if (formData.role === 'doctor') {
        payload.specialization = formData.specialization;
        payload.qualification = formData.qualification;
        payload.experience_years = Number(formData.experience_years);
        payload.consultation_fee = Number(formData.consultation_fee);
      }

      await register(payload);
      setSuccess('Registration successful!');

      try {
        const user = await login(payload.email, payload.password);

        if (user.role === 'doctor') {
          navigate('/doctor/dashboard');
        } else if (user.role === 'patient') {
          navigate('/patient/dashboard');
        } else {
          navigate('/');
        }
      } catch (loginErr) {
        console.error('Login failed after register:', loginErr);
        navigate('/login');
      }
    } catch (err) {
      console.error('Registration failed:', err);

      const responseData = err?.response?.data;

      if (typeof responseData === 'object' && responseData !== null) {
        const firstError = Object.values(responseData)[0];
        if (Array.isArray(firstError)) {
          setError(firstError[0]);
        } else if (typeof firstError === 'string') {
          setError(firstError);
        } else {
          setError('Registration failed. Please check your details.');
        }
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Register</h1>
        <p style={styles.subtitle}>Create your SymptoScan account</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="Enter full name"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Role</label>
            <select name="role" value={formData.role} onChange={handleChange} style={styles.input}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>

          {isDoctor && (
            <>
              <div style={styles.formGroup}>
                <label style={styles.label}>Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  placeholder="Enter specialization"
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Qualification</label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  placeholder="Enter qualification"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Experience (Years)</label>
                <input
                  type="number"
                  name="experience_years"
                  value={formData.experience_years}
                  onChange={handleChange}
                  min="0"
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Consultation Fee</label>
                <input
                  type="number"
                  name="consultation_fee"
                  value={formData.consultation_fee}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  style={styles.input}
                />
              </div>
            </>
          )}

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7fb',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
  },
  title: {
    margin: '0 0 8px 0',
    textAlign: 'center',
  },
  subtitle: {
    margin: '0 0 24px 0',
    textAlign: 'center',
    color: '#666',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: '600',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    outline: 'none',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: '15px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  error: {
    color: 'crimson',
    margin: 0,
    fontSize: '14px',
  },
  success: {
    color: 'green',
    margin: 0,
    fontSize: '14px',
  },
  footerText: {
    marginTop: '18px',
    textAlign: 'center',
    fontSize: '14px',
  },
};

export default RegisterPage;
