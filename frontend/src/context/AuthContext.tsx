import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  login: (data: any) => void;
  logout: () => void;
  updateUser: (updates: any) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = (data: any) => {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    localStorage.setItem('user', JSON.stringify({ 
      name: data.name, 
      role: data.role,
      isPasswordChanged: data.isPasswordChanged 
    }));
    setUser({ 
      name: data.name, 
      role: data.role,
      isPasswordChanged: data.isPasswordChanged 
    });
  };

  const updateUser = (updates: any) => {
    setUser((prev: any) => {
      if (!prev) return prev;
      const updatedUser = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
