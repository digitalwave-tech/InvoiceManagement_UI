import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

  const AuthProvider = ({ children }) => {
  //const [user, setUser] = useState(null);
  const storedToken = localStorage.getItem('user');
  const [user, setUser] = useState(storedToken ? { token: storedToken } : null);

  useEffect(() => {
    // Check if user is already logged in (e.g., check local storage or session)
    try{
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        setUser(storedUser);
      }
    }
    catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      // Handle the error as needed (e.g., clear localStorage, set default user state)
    }
  }, []);

  const login = async (token) => {
    
    localStorage.setItem('user', JSON.stringify({ token }));
    setUser({ token });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };




