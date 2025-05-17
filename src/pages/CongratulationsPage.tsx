import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircleIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
import eventService, { Event } from '../services/eventService';

const CongratulationsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const eventData = await eventService.getEventById(eventId);
        setEvent(eventData);
      } catch (err) {
        setError('Failed to load event details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          {error || 'Event not found'}
        </h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to home page
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
      <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Booking Confirmed!
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Thank you for booking {event.title}. We look forward to seeing you there!
      </p>
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Event Details</h2>
        <div className="text-left">
          <h3 className="text-lg font-medium mb-4">{event.title}</h3>
          <div className="flex items-center gap-3 mb-3">
            <CalendarIcon className="h-5 w-5 text-gray-600" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-600" />
            <span>{event.venue}</span>
          </div>
        </div>
      </div>
      <div className="space-x-4">
        <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors duration-200">
          Browse More Events
        </Link>
      </div>
    </div>;
};

export default CongratulationsPage;