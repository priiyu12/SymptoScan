import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PatientFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      const token = localStorage.getItem('access_token');
      try {
        const res = await axios.get('http://127.0.0.1:8000/api/feedback/patient-feedback/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFeedbacks(res.data);
      } catch (error) {
        console.error('Failed to fetch feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Patient Feedback</h2>
      <ul className="space-y-4">
        {feedbacks.map((fb) => (
          <li key={fb.id} className="border p-4 rounded bg-white shadow">
            <p className="font-semibold">From: {fb.user_email}</p>
            <p>{fb.feedback_text}</p>
            <p className="text-xs text-gray-500">{new Date(fb.created_at).toLocaleString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PatientFeedback;
