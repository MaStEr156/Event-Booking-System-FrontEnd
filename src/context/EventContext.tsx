import React, { useEffect, useState, createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
interface Event {
  id: string;
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: number;
  imageUrl: string;
}
interface Booking {
  id: string;
  userId: string;
  eventId: string;
  bookedAt: string;
}
interface EventContextType {
  events: Event[];
  bookings: Booking[];
  addEvent: (event: Omit<Event, 'id'>) => void;
  updateEvent: (id: string, event: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  bookEvent: (eventId: string) => void;
  isEventBooked: (eventId: string) => boolean;
  getEvent: (id: string) => Event | undefined;
}
const EventContext = createContext<EventContextType | undefined>(undefined);
export const EventProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const {
    user
  } = useAuth();
  // Initialize with sample data if empty
  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (!storedEvents) {
      const sampleEvents: Event[] = [{
        id: '1',
        name: 'Summer Music Festival',
        description: 'A three-day music festival featuring top artists from around the world.',
        category: 'Music',
        date: '2023-07-15',
        venue: 'Central Park',
        price: 149.99,
        imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }, {
        id: '2',
        name: 'Tech Conference 2023',
        description: 'Join industry leaders and innovators for a day of tech talks and networking.',
        category: 'Technology',
        date: '2023-08-22',
        venue: 'Convention Center',
        price: 299.99,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }, {
        id: '3',
        name: 'Food & Wine Expo',
        description: 'Sample delicious food and wine from top chefs and wineries.',
        category: 'Food',
        date: '2023-09-10',
        venue: 'Grand Hotel',
        price: 75.0,
        imageUrl: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }, {
        id: '4',
        name: 'Marathon 2023',
        description: 'Annual city marathon with routes for all skill levels.',
        category: 'Sports',
        date: '2023-10-05',
        venue: 'Downtown',
        price: 50.0,
        imageUrl: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
      }];
      setEvents(sampleEvents);
      localStorage.setItem('events', JSON.stringify(sampleEvents));
    } else {
      setEvents(JSON.parse(storedEvents));
    }
    const storedBookings = localStorage.getItem('bookings');
    if (storedBookings) {
      setBookings(JSON.parse(storedBookings));
    }
  }, []);
  // Save events and bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings));
  }, [bookings]);
  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = {
      ...event,
      id: `event-${Date.now()}`
    };
    setEvents([...events, newEvent]);
  };
  const updateEvent = (id: string, updatedEventData: Partial<Event>) => {
    setEvents(events.map(event => event.id === id ? {
      ...event,
      ...updatedEventData
    } : event));
  };
  const deleteEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id));
    // Also delete related bookings
    setBookings(bookings.filter(booking => booking.eventId !== id));
  };
  const bookEvent = (eventId: string) => {
    if (!user) return;
    const newBooking = {
      id: `booking-${Date.now()}`,
      userId: user.id,
      eventId,
      bookedAt: new Date().toISOString()
    };
    setBookings([...bookings, newBooking]);
  };
  const isEventBooked = (eventId: string) => {
    if (!user) return false;
    return bookings.some(booking => booking.eventId === eventId && booking.userId === user.id);
  };
  const getEvent = (id: string) => {
    return events.find(event => event.id === id);
  };
  return <EventContext.Provider value={{
    events,
    bookings,
    addEvent,
    updateEvent,
    deleteEvent,
    bookEvent,
    isEventBooked,
    getEvent
  }}>
      {children}
    </EventContext.Provider>;
};
export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};