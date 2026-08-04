import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface Business {
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  business: Business | null;
  token: string | null;
  login: (token: string, user: User, business?: Business) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedBusiness = localStorage.getItem('business');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedBusiness) {
        setBusiness(JSON.parse(storedBusiness));
      }
    }
  }, []);

  const login = (newToken: string, newUser: User, newBusiness?: Business) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    if (newBusiness) {
      setBusiness(newBusiness);
      localStorage.setItem('business', JSON.stringify(newBusiness));
    } else {
      setBusiness(null);
      localStorage.removeItem('business');
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setBusiness(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('business');
  };

  return (
    <AuthContext.Provider value={{ user, business, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
