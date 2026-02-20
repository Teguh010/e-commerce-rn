import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const authDataSerialized = await AsyncStorage.getItem('@AuthData');
      if (authDataSerialized) {
        const authData = JSON.parse(authDataSerialized);
        setUser(authData.user);
        setToken(authData.access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${authData.access_token}`;
      }
    } catch (error) {
      console.error('Error loading auth data', error);
    } finally {
      setLoading(false);
    }
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { access_token, user } = response.data;

      setUser(user);
      setToken(access_token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

      await AsyncStorage.setItem('@AuthData', JSON.stringify({ access_token, user }));
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    await AsyncStorage.removeItem('@AuthData');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
