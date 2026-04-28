import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import logo from "../assets/logo.png";

import "../styles/PatientDashboard.css";

function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPredictions = async () => {
    try {
      const res = await api.get("/predictions/history/");
      setPredictions(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching predictions", err);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getConfidence = (item) => {
    const raw =
      item?.confidence_score ??
      item?.confidence ??
      item?.probability ??
      item?.score;

    if (raw === undefined || raw === null || raw === "") return "N/A";

    const num = Number(raw);
    if (Number.isNaN(num)) return "N/A";

    if (num <= 1) return `${Math.round(num * 100)}%`;
    return `${Math.round(num)}%`;
  };

  const getDiseaseName = (item) => {
    return (
      item?.predicted_disease ||
      item?.disease ||
      item?.prediction ||
      item?.result ||
      "Unknown Prediction"
    );
  };

  const getPredictionDate = (item) => {
    const rawDate = item?.created_at || item?.date || item?.timestamp;
    if (!rawDate) return "No date available";

    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return rawDate;

    return date.toLocaleDateString("en-CA");
  };

  const getStatus = (index) => {
    if (index === 0) return "Consulted";
    return "Resolved";
  };

  return (
    <div className="patient-dashboard">
      <header className="patient-dashboard__topbar">
        <div className="patient-dashboard__brand" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="SymptoScan Logo"
            className="patient-dashboard__brand-logo"
          />
          <span className="patient-dashboard__brand-text">SymptoScan</span>
        </div>

        <nav className="patient-dashboard__nav">
          <button
            className="patient-dashboard__nav-link patient-dashboard__nav-link--active"
            onClick={() => navigate("/patient/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="patient-dashboard__nav-link patient-dashboard__nav-link--active"
            onClick={() => navigate("/symptoms")}
          >
            Check Symptoms
          </button>

          <button
            className="patient-dashboard__nav-link patient-dashboard__nav-link--active"
            onClick={() => navigate("/doctors")}
          >
            Find Doctors
          </button>
          <button
            className="patient-dashboard__icon-btn"
            onClick={() => navigate("/prediction-history")}
            title="History"
          >
            ⏱
          </button>

          <button
            className="patient-dashboard__icon-btn"
            onClick={handleLogout}
            title="Logout"
          >
            ↪
          </button>
        </nav>
      </header>

      <main className="patient-dashboard__content">
        <section className="patient-dashboard__hero">
          <h1>Hello, {user?.full_name || "John"} 👋</h1>
          <p>How are you feeling today?</p>
        </section>

        <section className="patient-dashboard__cards">
          <div
            className="patient-dashboard__card patient-dashboard__card--blue"
            onClick={() => navigate("/symptoms")}
          >
            <div className="patient-dashboard__card-top">
              <div className="patient-dashboard__card-icon">〰</div>
              <span className="patient-dashboard__card-tag">Start</span>
            </div>

            <div className="patient-dashboard__card-body">
              <h3>Check Symptoms</h3>
              <p>
                Enter your symptoms and get instant AI-powered disease
                prediction
              </p>
            </div>
          </div>

          <div
            className="patient-dashboard__card patient-dashboard__card--green"
            onClick={() => navigate("/doctors")}
          >
            <div className="patient-dashboard__card-top">
              <div className="patient-dashboard__card-icon">🩺</div>
              <span className="patient-dashboard__card-tag">Browse</span>
            </div>

            <div className="patient-dashboard__card-body">
              <h3>Find a Doctor</h3>
              <p>
                Connect with certified healthcare professionals for consultation
              </p>
            </div>
          </div>

          <div
            className="patient-dashboard__card patient-dashboard__card--light"
            onClick={() => navigate("/prediction-history")}
          >
            <div className="patient-dashboard__card-top">
              <div className="patient-dashboard__card-icon patient-dashboard__card-icon--purple">
                🕘
              </div>
            </div>

            <div className="patient-dashboard__card-body">
              <h3>Your Health History</h3>
              <p>{predictions.length} predictions recorded</p>
              <small>
                Last check:{" "}
                {predictions.length > 0
                  ? getPredictionDate(predictions[0])
                  : "No history yet"}
              </small>
            </div>
          </div>
        </section>

        <section className="patient-dashboard__recent">
          <div className="patient-dashboard__recent-header">
            <h2>Recent Predictions</h2>
            <span className="patient-dashboard__preview-pill">Preview</span>
            <button
              className="patient-dashboard__view-all"
              onClick={() => navigate("/prediction-history")}
            >
              View All
            </button>
          </div>

          {loading ? (
            <p className="patient-dashboard__empty">Loading...</p>
          ) : predictions.length === 0 ? (
            <p className="patient-dashboard__empty">No predictions yet</p>
          ) : (
            <div className="patient-dashboard__prediction-list">
              {predictions.slice(0, 5).map((item, index) => (
                <div className="patient-dashboard__prediction-item" key={item.id}>
                  <div className="patient-dashboard__prediction-left">
                    <div className="patient-dashboard__prediction-icon">〰</div>
                    <div>
                      <h4>{getDiseaseName(item)}</h4>
                      <p>{getPredictionDate(item)}</p>
                    </div>
                  </div>

                  <div className="patient-dashboard__prediction-right">
                    <span className="patient-dashboard__confidence-label">
                      Confidence
                    </span>
                    <div className="patient-dashboard__prediction-meta">
                      <strong>{getConfidence(item)}</strong>
                      <span
                        className={`patient-dashboard__status-pill ${
                          getStatus(index) === "Consulted"
                            ? "patient-dashboard__status-pill--blue"
                            : "patient-dashboard__status-pill--green"
                        }`}
                      >
                        {getStatus(index)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="patient-dashboard__tip">
          <span className="patient-dashboard__tip-icon">💡</span>
          <div>
            <h3>Health Tip of the Day</h3>
            <p>
              Stay hydrated, eat balanced meals, and do not ignore repeated
              symptoms.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

export default PatientDashboard;