import axios from 'axios';
import { API_URL } from '../config';

export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string | null;
  createdAt: string;
  isDeleted: boolean;
  roles: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
}

export interface RegisterResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  userId: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    console.log('Attempting login with:', { email });
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    console.log('Login response:', response.data);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('refreshToken', response.data.refreshToken);
    localStorage.setItem('userData', JSON.stringify({
      id: response.data.userId,
      userName: response.data.userName,
      email: response.data.email,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
      profilePictureUrl: null,
      createdAt: new Date().toISOString(),
      isDeleted: false,
      roles: response.data.roles
    }));
    return response.data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await axios.post(`${API_URL}/api/auth/register`, data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    
    if (!token || !userData) {
      throw new Error('No token or user data found');
    }

    try {
      const response = await axios.get(`${API_URL}/api/auth/get-user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return {
        ...response.data,
        roles: response.data.roles || []
      };
    } catch (error) {
      console.error('Failed to get current user from server:', error);
      const storedUser = JSON.parse(userData);
      return {
        ...storedUser,
        roles: storedUser.roles || []
      };
    }
  },

  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return;

      await axios.post(
        `${API_URL}/api/auth/logout`,
        { refreshToken },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  },
};

export default authService; 