import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DoctorChatRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await axios.get('http://127.0.0.1:8000/api/predict/doctor-chatrooms/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRooms(res.data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };

    fetchRooms();
  }, []);

  const openChat = (roomId) => {
    navigate(`/chat/${roomId}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4 text-white">Consult Patients</h2>
      <ul className="space-y-4">
        {rooms.length === 0 ? (
          <p className="text-white">No patients available for consultation.</p>
        ) : (
          rooms.map((room) => (
            <li key={room.id} className="flex justify-between items-center bg-white p-4 rounded-lg shadow">
              <span className="text-gray-700 font-medium">Patient: {room.patient}</span>
              <button
                onClick={() => openChat(room.id)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
              >
                Open Chat
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default DoctorChatRooms;
