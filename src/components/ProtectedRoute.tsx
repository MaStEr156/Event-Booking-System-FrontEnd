import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const {
    user,
    isLoading
  } = useAuth();
  const location = useLocation();
  if (isLoading) {
    return <div className="flex justify-center items-center h-60">Loading...</div>;
  }
  if (!user) {
    return <Navigate to="/login" state={{
      from: location
    }} replace />;
  }
  return <>{children}</>;
};
export default ProtectedRoute;