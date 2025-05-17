import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import eventService, { Booking } from '@/services/eventService';
import { CalendarIcon, MapPinIcon, ArrowLeftIcon, TrashIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface UserBooking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  bookingDate: string;
}

const MyBookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('MyBookingsPage useEffect triggered');
    console.log('Current user:', user);

    const fetchBookings = async () => {
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Fetching user bookings...');
        setIsLoading(true);
        const userBookings = await eventService.getUserBookings();
        console.log('Fetched bookings:', userBookings);
        setBookings(userBookings);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load your bookings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user, navigate]);

  const handleCancelBooking = async (bookingId: string) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await eventService.softDeleteBooking(bookingId);
      setBookings(bookings.filter(booking => booking.id !== bookingId));
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Failed to cancel booking:', err);
      toast.error('Failed to cancel booking');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeftIcon className="h-5 w-5" />
        <span>Back</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-xl">You haven't booked any events yet.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Browse Events
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{booking.eventTitle}</h2>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{new Date(booking.eventDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPinIcon className="h-5 w-5" />
                    <span>{booking.eventVenue}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CalendarIcon className="h-5 w-5" />
                    <span>Booked on: {new Date(booking.bookingDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleCancelBooking(booking.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage; 