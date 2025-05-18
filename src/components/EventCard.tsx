import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, TagIcon, DollarSignIcon } from 'lucide-react';
import { Event } from '../services/eventService';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        src={event.fullImageUrl}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
        <div className="space-y-2">
          <div className="flex items-center text-gray-600">
            <CalendarIcon className="h-5 w-5 mr-2" />
            <span>{new Date(event.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <TagIcon className="h-5 w-5 mr-2" />
            <span>{event.categoryName}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <DollarSignIcon className="h-5 w-5 mr-2" />
            <span>${event.price}</span>
          </div>
        </div>
        <Link
          to={`/event/${event.id}`}
          className="mt-4 block w-full text-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default EventCard;