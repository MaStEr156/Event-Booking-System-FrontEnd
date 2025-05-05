import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import EventCard from '../components/EventCard';
import { SearchIcon, FilterIcon } from 'lucide-react';
const HomePage = () => {
  const {
    events,
    bookEvent,
    isEventBooked
  } = useEvents();
  const {
    user
  } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  // Extract unique categories from events
  const categories = Array.from(new Set(events.map(event => event.category)));
  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) || event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === '' || event.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });
  const handleBookEvent = (eventId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    bookEvent(eventId);
    navigate(`/congratulations/${eventId}`);
  };
  return <div className="max-w-7xl mx-auto">
      <section className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Discover Amazing Events
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Browse through our collection of exciting events and book your tickets
          today.
        </p>
      </section>
      <section className="mb-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input type="text" placeholder="Search events..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <FilterIcon className="text-gray-500 h-5 w-5" />
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none">
              <option value="">All Categories</option>
              {categories.map(category => <option key={category} value={category}>
                  {category}
                </option>)}
            </select>
          </div>
        </div>
      </section>
      {filteredEvents.length === 0 ? <div className="text-center py-20">
          <p className="text-gray-500 text-xl">
            No events found matching your criteria.
          </p>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map(event => <EventCard key={event.id} id={event.id} name={event.name} category={event.category} date={event.date} venue={event.venue} price={event.price} imageUrl={event.imageUrl} isBooked={isEventBooked(event.id)} onBook={() => handleBookEvent(event.id)} />)}
        </div>}
    </div>;
};
export default HomePage;