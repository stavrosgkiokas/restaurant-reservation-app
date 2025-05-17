import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Initial loading state

  useEffect(() => {
    const checkToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('token');

        if (savedToken) {
          const decoded = jwtDecode(savedToken);


          const currentTime = Date.now() / 1000; // Convert ms to seconds
          if (decoded.exp < currentTime) {
            console.warn('🔐 Token expired, logging out...');
            await logout();
          } else {
            setToken(savedToken);
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.error('Error checking token:', err);
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, []);

  const login = async (newToken) => {
    setToken(newToken);
    setIsAuthenticated(true);
    await AsyncStorage.setItem('token', newToken);
  };

  const logout = async () => {
    setToken(null);
    setIsAuthenticated(false);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};