import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { CalendarIcon, MapPinIcon, TagIcon, DollarSignIcon, ArrowLeftIcon } from 'lucide-react';
const EventDetailsPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    getEvent,
    bookEvent,
    isEventBooked
  } = useEvents();
  const {
    user
  } = useAuth();
  const event = getEvent(id || '');
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
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(event.price);
  const handleBookEvent = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    bookEvent(event.id);
    navigate(`/congratulations/${event.id}`);
  };
  return <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-80 overflow-hidden">
        <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <Link to="/" className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-4">
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back to events</span>
        </Link>
        <div className="flex items-center gap-2 mb-3">
          <TagIcon className="h-5 w-5 text-blue-500" />
          <span className="text-blue-600 font-medium">{event.category}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{event.name}</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-medium">{formattedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <MapPinIcon className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Venue</p>
              <p className="font-medium">{event.venue}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <DollarSignIcon className="h-6 w-6 text-gray-600" />
            <div>
              <p className="text-sm text-gray-500">Price</p>
              <p className="font-medium">{formattedPrice}</p>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            About this event
          </h2>
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
        <div className="flex justify-between items-center">
          {isEventBooked(event.id) ? <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
              You've already booked this event
            </div> : <button onClick={handleBookEvent} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors duration-200">
              Book Now
            </button>}
          <p className="text-xl font-bold">{formattedPrice}</p>
        </div>
      </div>
    </div>;
};
export default EventDetailsPage;