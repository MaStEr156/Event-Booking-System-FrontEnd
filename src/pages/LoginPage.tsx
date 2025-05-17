import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogInIcon } from 'lucide-react';
interface LocationState {
  from?: {
    pathname: string;
  };
}
const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const {
    login,
    isLoading
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  const from = locationState?.from?.pathname || '/';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      console.log('LoginPage: Starting login process');
      await login({ email, password });
      console.log('LoginPage: Login successful, navigating to:', from);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('LoginPage: Login failed:', err);
      setError((err as Error).message);
    }
  };
  return <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
      <div className="text-center mb-8">
        <LogInIcon className="h-10 w-10 text-blue-600 mx-auto mb-2" />
        <h1 className="text-2xl font-bold text-gray-800">
          Log in to your account
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Please enter your details.
        </p>
      </div>
      {error && <div className="bg-red-50 text-red-700 p-3 rounded-md mb-6">
          {error}
        </div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        </div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-medium transition-colors duration-200 disabled:bg-blue-400">
          {isLoading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 hover:text-blue-800 font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>;
};
export default LoginPage;