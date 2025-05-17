import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useAuth } from '@/context/AuthContext';
import { Event } from '@/services/eventService';
import { ArrowLeftIcon, CalendarIcon, MapPinIcon, TagIcon, CheckCircleIcon } from 'lucide-react';
import eventService from '@/services/eventService';
import { toast } from 'react-hot-toast';

const EventDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getEventById, bookEvent } = useEvents();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [isBooked, setIsBooked] = useState(false);
  const [isCheckingBooking, setIsCheckingBooking] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        const eventData = await getEventById(id);
        setEvent(eventData);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const checkBookingStatus = async () => {
      if (!user || !id) {
        setIsCheckingBooking(false);
        return;
      }

      try {
        console.log('Checking booking status for event:', id);
        const bookings = await eventService.getUserBookings();
        console.log('User bookings:', bookings);
        const hasBooked = bookings.some(booking => booking.eventId === id);
        console.log('Has booked:', hasBooked);
        setIsBooked(hasBooked);
      } catch (err) {
        console.error('Failed to check booking status:', err);
        setIsBooked(false);
      } finally {
        setIsCheckingBooking(false);
      }
    };

    fetchEvent();
    if (user) {
      checkBookingStatus();
    } else {
      setIsCheckingBooking(false);
    }
  }, [id, getEventById, user]);

  const handleBookEvent = async () => {
    if (!event || !user) return;
    try {
      setIsBooking(true);
      await bookEvent(event.id);
      setIsBooked(true);
      toast.success('Event booked successfully!');
      navigate(`/congratulations/${event.id}`);
    } catch (err: any) {
      console.error('Failed to book event:', err);
      toast.error(err.message || 'Failed to book event');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading || isCheckingBooking) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !event) {
    return <div className="text-red-600">{error || 'Event not found'}</div>;
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

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={event.fullImageUrl}
          alt={event.title}
          className="w-full h-96 object-cover"
        />
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
          
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarIcon className="h-5 w-5" />
              <span>{new Date(event.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="h-5 w-5" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TagIcon className="h-5 w-5" />
              <span>{event.categoryName}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">
              About this event
            </h2>
            <p className="text-gray-700">{event.description}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold text-blue-600">
              ${event.price.toFixed(2)}
            </div>
            {user ? (
              isBooked ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircleIcon className="h-6 w-6" />
                  <span className="font-medium">You have booked this event</span>
                </div>
              ) : (
                <button
                  onClick={handleBookEvent}
                  disabled={isBooking}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isBooking ? 'Booking...' : 'Book Now'}
                </button>
              )
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
              >
                Login to Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;