import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NavbarPublic from '../components/Navbar';
import '../styles/LandingPage.css';

function LandingPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handlePrimaryAction = () => {
    if (!isAuthenticated || !user) {
      navigate('/register');
      return;
    }

    if (user.role === 'patient') {
      navigate('/patient/dashboard');
    } else if (user.role === 'doctor') {
      navigate('/doctor/dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const handleSecondaryAction = () => {
    if (isAuthenticated) {
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="landing-page">
      <NavbarPublic />

      <main className="landing-page__hero">
        <div className="landing-page__hero-content">
          <p className="landing-page__badge">AI-Powered Healthcare Support</p>

          <h1 className="landing-page__title">
            Smart Symptom Analysis for
            <br />
            <span>Better Health Decisions</span>
          </h1>

          <p className="landing-page__subtitle">
            Get instant disease prediction support, track your health history,
            and connect with verified doctors through one secure platform.
          </p>

          <div className="landing-page__buttons">
            <button
              className="landing-page__btn landing-page__btn--primary"
              onClick={handlePrimaryAction}
              disabled={loading}
            >
              {loading
                ? 'Loading...'
                : isAuthenticated
                ? 'Go to Dashboard'
                : 'Get Started Free'}
            </button>

            {!loading && !isAuthenticated && (
              <button
                className="landing-page__btn landing-page__btn--secondary"
                onClick={handleSecondaryAction}
              >
                Login
              </button>
            )}
          </div>
        </div>
      </main>

      <section className="landing-page__features-shell">
        <div className="landing-page__features">
          <div className="landing-page__feature-card">
            <div className="landing-page__feature-icon">🧠</div>
            <h3>AI Analysis</h3>
            <p>Advanced symptom analysis for quick and structured health guidance.</p>
          </div>

          <div className="landing-page__feature-card">
            <div className="landing-page__feature-icon">🩺</div>
            <h3>Expert Doctors</h3>
            <p>Consult verified healthcare professionals for trusted support.</p>
          </div>

          <div className="landing-page__feature-card">
            <div className="landing-page__feature-icon">🔒</div>
            <h3>Secure &amp; Private</h3>
            <p>Your health records and consultation data stay protected.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;