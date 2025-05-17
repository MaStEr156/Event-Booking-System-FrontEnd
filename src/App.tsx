import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { AdminProvider } from '@/context/AdminContext';
import { EventProvider } from '@/context/EventContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import EventDetailsPage from '@/pages/EventDetailsPage';
import AdminDashboard from '@/pages/AdminDashboard';
import CongratulationsPage from '@/pages/CongratulationsPage';
import MyBookingsPage from '@/pages/MyBookingsPage';
import PrivateRoute from '@/components/PrivateRoute';
import AdminRoute from '@/components/AdminRoute';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <AdminProvider>
          <EventProvider>
            <div className="min-h-screen bg-gray-50">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/event/:id" element={<EventDetailsPage />} />
                  <Route
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminDashboard />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/my-bookings"
                    element={
                      <ProtectedRoute>
                        <MyBookingsPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/congratulations/:eventId"
                    element={
                      <ProtectedRoute>
                        <CongratulationsPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
            </div>
          </EventProvider>
        </AdminProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;