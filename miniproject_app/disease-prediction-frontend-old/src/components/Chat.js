import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const Chat = () => {
  const { roomId } = useParams(); // Get roomId from URL params
  const navigate = useNavigate(); // Navigation for switching rooms
  const [chatRooms, setChatRooms] = useState([]); // For doctor to list patients
  const [messages, setMessages] = useState([]); // Chat messages in the current room
  const [newMsg, setNewMsg] = useState(''); // New message input
  const token = localStorage.getItem('access_token');
  const userRole = localStorage.getItem('user_role'); // 'doctor' or 'patient'

  // Fetch chat rooms if user is a doctor
  const fetchChatRooms = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/predict/chat-rooms/', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setChatRooms(res.data);
    } catch (error) {
      console.error('Failed to load chat rooms:', error);
    }
  };

  // Fetch messages for the selected room
  const fetchMessages = async (id) => {
    if (!id) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/predict/messages/${id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  // Send a new message
  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      await axios.post(
        `http://127.0.0.1:8000/api/predict/send-message/`,
        {
          room_id: roomId,
          content: newMsg,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewMsg('');
      fetchMessages(roomId); // Refresh after sending
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Initial load & polling setup
  useEffect(() => {
    if (userRole === 'doctor') {
      fetchChatRooms();
    }

    if (roomId) {
      fetchMessages(roomId);
      const interval = setInterval(() => fetchMessages(roomId), 3000);
      return () => clearInterval(interval);
    }
  }, [roomId]);

  return (
    <div className="flex h-screen">
      {/* Doctor's Sidebar */}
      {userRole === 'doctor' && (
        <div className="w-1/4 bg-white border-r p-4 overflow-y-auto">
          <h2 className="text-lg font-bold mb-4">Patient Chats</h2>
          {chatRooms.length === 0 ? (
            <p>No chat rooms found.</p>
          ) : (
            chatRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => navigate(`/chat/${room.id}`)}
                className={`block w-full text-left p-2 mb-2 rounded ${roomId == room.id ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                {room.patient_name}
              </button>
            ))
          )}
        </div>
      )}

      {/* Chat Window */}
      <div className={`flex flex-col flex-1 p-4 ${userRole === 'doctor' ? '' : 'mx-auto w-full'}`}>
        {roomId ? (
          <>
            <div className="flex-1 overflow-y-auto mb-4 bg-gray-100 p-4 rounded shadow-inner">
              {messages.length === 0 ? (
                <p className="text-center text-gray-500">No messages yet.</p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-2 p-2 rounded max-w-xs ${msg.is_user_sender
                        ? 'bg-blue-500 text-white ml-auto'
                        : 'bg-gray-300 text-gray-900 mr-auto'
                      }`}
                  >
                    <strong>{msg.sender}</strong>: {msg.content}
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 border px-4 py-2 rounded-l focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={sendMessage}
                className="bg-purple-600 text-white px-6 py-2 rounded-r hover:bg-purple-700 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-500">
            {userRole === 'doctor' ? 'Select a patient to start chatting' : 'Chat not available'}
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
