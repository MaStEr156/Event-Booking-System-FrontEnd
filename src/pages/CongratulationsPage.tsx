import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { CheckCircleIcon, CalendarIcon, MapPinIcon } from 'lucide-react';
const CongratulationsPage = () => {
  const {
    eventId
  } = useParams<{
    eventId: string;
  }>();
  const {
    getEvent
  } = useEvents();
  const event = getEvent(eventId || '');
  if (!event) {
    return <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Event not found
        </h2>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to home page
        </Link>
      </div>;
  }
  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
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
        Your ticket has been successfully booked.
      </p>
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Event Details</h2>
        <div className="text-left">
          <h3 className="text-lg font-medium mb-4">{event.name}</h3>
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