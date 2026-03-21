import React, { useState } from 'react';
import axios from 'axios';

function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('Unauthorized. Please login again.');
      return;
    }

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/feedback/submit/',
        { feedback_text: feedback },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFeedback('');
      setSuccess('Feedback submitted successfully!');
      setError('');
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError('Feedback submission failed.');
      setSuccess('');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-[#cccfff] to-[#42006c]">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Submit Your Feedback</h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}

        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Write your feedback here..."
          className="w-full h-40 p-3 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-500 resize-none"
          required
        />

        <button
          type="submit"
          className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}

export default Feedback;
