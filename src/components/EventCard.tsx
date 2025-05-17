import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, TagIcon, DollarSignIcon } from 'lucide-react';
import { Event } from '../services/eventService';

interface EventCardProps {
  event: Event;
  isBooked: boolean;
  onBook: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, isBooked, onBook }) => {
  const formattedDate = new Date(event.eventDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(event.price);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img src={event.fullImageUrl} alt={event.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <TagIcon className="h-4 w-4 text-blue-500" />
          <span className="text-blue-600 text-sm font-medium">{event.categoryName || 'Uncategorized'}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 text-sm">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 text-sm">{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSignIcon className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600 text-sm">{formattedPrice}</span>
          </div>
        </div>
        <Link
          to={`/event/${event.id}`}
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 rounded-md transition-colors duration-200"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;