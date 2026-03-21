import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      const token = localStorage.getItem('access_token');
      const res = await axios.get('http://127.0.0.1:8000/api/users/doctors/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    };

    fetchDoctors();
  }, []);

  const startChat = async (doctorId) => {
    const token = localStorage.getItem('access_token');
    const res = await axios.post('http://127.0.0.1:8000/api/predict/chatroom/', { doctor_id: doctorId }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const roomId = res.data.id;
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Select a Doctor to Chat</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor.id} className="mb-2 flex justify-between items-center">
            <span>{doctor.email}</span>
            <button
              onClick={() => startChat(doctor.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              Start Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorList;
