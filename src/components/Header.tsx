import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, LogInIcon, LogOutIcon, UserPlusIcon, LayoutDashboardIcon } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-blue-600">
          <CalendarIcon className="h-6 w-6" />
          <span>EventBooker</span>
        </Link>
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <span className="text-gray-700">
                Hello, {user.firstName} {user.lastName}
              </span>
              {user.roles?.includes('Admin') && (
                <Link to="/admin" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                  <LayoutDashboardIcon className="h-5 w-5" />
                  <span>Admin</span>
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                <LogOutIcon className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
                <LogInIcon className="h-5 w-5" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                <UserPlusIcon className="h-5 w-5" />
                <span>Register</span>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;