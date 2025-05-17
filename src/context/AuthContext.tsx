import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User, LoginRequest, RegisterRequest } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async () => {
    console.log('AuthProvider useEffect running');
    console.log('Checking authentication...');
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.log('No token found');
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      console.log('Token found, fetching user data...');
      const userData = await authService.getCurrentUser();
      console.log('User data fetched:', userData);
      setUser(userData);
    } catch (error) {
      console.error('Auth check failed:', error);
      // If the token is invalid or expired, clear it
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (data: LoginRequest) => {
    try {
      console.log('AuthContext: Starting login process');
      const response = await authService.login(data.email, data.password);
      console.log('AuthContext: Login successful, setting token and user');
      localStorage.setItem('token', response.token);
      
      // Create user object from response including roles
      const user: User = {
        id: response.userId,
        userName: response.userName,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        profilePictureUrl: null,
        createdAt: new Date().toISOString(),
        isDeleted: false,
        roles: response.roles || [] // Add roles to user object
      };
      
      setUser(user);
      console.log('AuthContext: Login process completed, user set:', user);
    } catch (error) {
      console.error('AuthContext: Login failed:', error);
      throw error;
    }
  };

  const register = async (data: RegisterRequest) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('token', response.token);
      
      // Create user object from response including roles
      const user: User = {
        id: response.userId,
        userName: response.userName,
        email: response.email,
        firstName: response.firstName,
        lastName: response.lastName,
        profilePictureUrl: null,
        createdAt: new Date().toISOString(),
        isDeleted: false,
        roles: response.roles || [] // Add roles to user object
      };
      
      setUser(user);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('userData');
      setUser(null);
    }
  };

  console.log('AuthProvider rendering with state:', { user, isLoading });

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
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