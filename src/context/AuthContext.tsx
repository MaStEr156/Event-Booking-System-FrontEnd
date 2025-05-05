import React, { useEffect, useState, createContext, useContext } from 'react';
interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);
  // Mock login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    // Mock admin user
    if (email === 'admin@example.com' && password === 'admin') {
      const adminUser = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin' as const
      };
      setUser(adminUser);
      localStorage.setItem('user', JSON.stringify(adminUser));
      setIsLoading(false);
      return;
    }
    // Mock regular user login
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email);
    if (foundUser && foundUser.password === password) {
      const {
        password: _,
        ...userWithoutPassword
      } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    throw new Error('Invalid email or password');
  };
  // Mock register function
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    // Check if user already exists
    if (users.some((u: any) => u.email === email)) {
      setIsLoading(false);
      throw new Error('User already exists');
    }
    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email,
      password,
      role: 'user' as const
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    // Log user in after registration
    const {
      password: _,
      ...userWithoutPassword
    } = newUser;
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
    setIsLoading(false);
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  return <AuthContext.Provider value={{
    user,
    login,
    register,
    logout,
    isLoading
  }}>
      {children}
    </AuthContext.Provider>;
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};