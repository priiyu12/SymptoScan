import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function ChatPage() {
  const { consultationId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [socketConnected, setSocketConnected] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await api.get(`/chat/messages/${consultationId}/`);
      setMessages(response.data);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      setError('Failed to load messages.');
    } finally {
      setLoading(false);
    }
  };

  const connectWebSocket = () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      setError('No authentication token found.');
      return;
    }

    const socketUrl = `ws://127.0.0.1:8000/ws/chat/${consultationId}/?token=${token}`;
    const socket = new WebSocket(socketUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
      setSocketConnected(true);
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      const newMessage = {
        id: data.id || Date.now(),
        sender: data.sender,
        sender_name: data.sender_name,
        sender_role: data.sender_role,
        content: data.message,
        timestamp: data.timestamp,
      };

      setMessages((prev) => [...prev, newMessage]);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
      setSocketConnected(false);
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('Live chat connection failed.');
    };

    socketRef.current = socket;
  };

  useEffect(() => {
    fetchMessages();
  }, [consultationId]);

  useEffect(() => {
    if (!loading && !error) {
      connectWebSocket();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [loading, error, consultationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    const trimmed = messageInput.trim();
    if (!trimmed) return;

    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError('Chat connection is not active.');
      return;
    }

    socketRef.current.send(
      JSON.stringify({
        message: trimmed,
      })
    );

    setMessageInput('');
  };

  if (loading) {
    return <h2 style={{ padding: '20px' }}>Loading chat...</h2>;
  }

  if (error && messages.length === 0) {
    return <h2 style={{ padding: '20px', color: 'crimson' }}>{error}</h2>;
  }

  return (
    <div style={styles.page}>
      <div style={styles.chatWrapper}>
        <div style={styles.header}>
          <button onClick={() => navigate('/consultations')} style={styles.backButton}>
            ← Back
          </button>

          <div>
            <h2 style={styles.headerTitle}>Consultation Chat</h2>
            <p style={styles.headerSubtext}>Consultation ID: {consultationId}</p>
            <p style={styles.connectionStatus}>
              Status: {socketConnected ? 'Connected' : 'Disconnected'}
            </p>
          </div>
        </div>

        <div style={styles.chatBody}>
          {messages.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No messages yet. Start the conversation.</p>
            </div>
          ) : (
            messages.map((msg) => {
              const isOwnMessage = msg.sender === user?.id;

              return (
                <div
                  key={msg.id}
                  style={{
                    ...styles.messageRow,
                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      ...(isOwnMessage ? styles.ownMessage : styles.otherMessage),
                    }}
                  >
                    <p style={styles.senderName}>
                      {msg.sender_name} ({msg.sender_role})
                    </p>
                    <p style={styles.messageText}>{msg.content}</p>
                    <p style={styles.timestamp}>
                      {new Date(msg.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {error && <p style={styles.errorText}>{error}</p>}

        <form onSubmit={handleSendMessage} style={styles.inputArea}>
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type your message..."
            style={styles.input}
          />
          <button
            type="submit"
            style={styles.sendButton}
            disabled={!socketConnected}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#eef3f8',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  chatWrapper: {
    width: '100%',
    maxWidth: '900px',
    height: '85vh',
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '18px 20px',
    borderBottom: '1px solid #e5e7eb',
    backgroundColor: '#f8fafc',
  },
  backButton: {
    border: 'none',
    backgroundColor: '#2563eb',
    color: '#fff',
    padding: '10px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  headerTitle: {
    margin: 0,
  },
  headerSubtext: {
    margin: '4px 0 0 0',
    color: '#666',
    fontSize: '14px',
  },
  connectionStatus: {
    margin: '4px 0 0 0',
    fontSize: '13px',
    color: '#374151',
  },
  chatBody: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f9fbfd',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  emptyState: {
    margin: 'auto',
    color: '#666',
    fontSize: '15px',
  },
  messageRow: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 14px',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  ownMessage: {
    backgroundColor: '#dbeafe',
    color: '#1e3a8a',
    borderBottomRightRadius: '4px',
  },
  otherMessage: {
    backgroundColor: '#f3f4f6',
    color: '#111827',
    borderBottomLeftRadius: '4px',
  },
  senderName: {
    fontSize: '12px',
    fontWeight: '700',
    margin: '0 0 6px 0',
  },
  messageText: {
    margin: '0 0 8px 0',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  timestamp: {
    margin: 0,
    fontSize: '11px',
    color: '#6b7280',
    textAlign: 'right',
  },
  errorText: {
    margin: 0,
    padding: '8px 16px',
    color: 'crimson',
    fontSize: '14px',
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
    padding: '16px',
    borderTop: '1px solid #e5e7eb',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
  },
  sendButton: {
    padding: '12px 18px',
    border: 'none',
    borderRadius: '10px',
    backgroundColor: '#16a34a',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default ChatPage;