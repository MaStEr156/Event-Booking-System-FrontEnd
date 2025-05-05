import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, MapPinIcon, TagIcon } from 'lucide-react';
interface EventCardProps {
  id: string;
  name: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  imageUrl: string;
  isBooked: boolean;
  onBook: () => void;
}
const EventCard: React.FC<EventCardProps> = ({
  id,
  name,
  category,
  date,
  venue,
  price,
  imageUrl,
  isBooked,
  onBook
}) => {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price);
  return <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <TagIcon className="h-4 w-4 text-blue-500" />
          <span className="text-sm text-blue-600">{category}</span>
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-800">{name}</h3>
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <CalendarIcon className="h-4 w-4" />
          <span className="text-sm">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPinIcon className="h-4 w-4" />
          <span className="text-sm">{venue}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-lg">{formattedPrice}</span>
          {isBooked ? <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Booked
            </span> : <div className="flex gap-2">
              <Link to={`/event/${id}`} className="text-blue-600 hover:text-blue-800 text-sm">
                View Details
              </Link>
              <button onClick={onBook} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md text-sm transition-colors duration-200">
                Book Now
              </button>
            </div>}
        </div>
      </div>
    </div>;
};
export default EventCard;