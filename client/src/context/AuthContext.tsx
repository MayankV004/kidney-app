import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Mock implementation - would connect to a real backend
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setAuthState({
        user: JSON.parse(storedUser),
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState({
        ...authState,
        isLoading: false,
      });
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login - in a real app, you would validate with a backend
    const mockUser: User = {
      id: '1',
      email,
      name: 'Test User',
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    // Mock signup - in a real app, you would create a user in the backend
    const mockUser: User = {
      id: Date.now().toString(),
      email,
      name,
    };
    
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    setAuthState({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('user');
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...userData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setAuthState({
        ...authState,
        user: updatedUser,
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
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