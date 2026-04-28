import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/axios';
import { setTokens, clearTokens, getAccessToken } from '../utils/token';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    try {
      const token = getAccessToken();

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const response = await api.get('/auth/me/');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch current user:', error);
      clearTokens();
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const response = await api.post('/auth/login/', {
      email,
      password,
    });

    const { access, refresh, user } = response.data;

    setTokens(access, refresh);
    setUser(user);

    return user;
  };

  const register = async (formData) => {

    const response = await api.post('/auth/register/', formData);
    return response.data;
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        fetchCurrentUser,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);