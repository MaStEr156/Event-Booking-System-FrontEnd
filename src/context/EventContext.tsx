import React, { createContext, useContext, useState, useEffect } from 'react';
import eventService, { Event, Category } from '../services/eventService';

interface EventContextType {
  events: Event[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  refreshEvents: () => Promise<void>;
  bookEvent: (eventId: string) => Promise<void>;
  isEventBooked: (eventId: string) => boolean;
  deleteEvent: (eventId: string) => Promise<void>;
  softDeleteEvent: (eventId: string) => Promise<void>;
  getEventById: (id: string) => Promise<Event>;
  addCategory: (name: string) => Promise<void>;
  updateCategory: (id: string, name: string) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshEvents = async () => {
    try {
      setLoading(true);
      const [eventsData, categoriesData] = await Promise.all([
        eventService.getAllEvents(),
        eventService.getAllCategories()
      ]);
      setEvents(eventsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      setError('Failed to load events');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const bookEvent = async (eventId: string) => {
    try {
      await eventService.bookEvent(eventId);
      await refreshEvents();
    } catch (err) {
      console.error('Failed to book event:', err);
      throw err;
    }
  };

  const isEventBooked = (eventId: string) => {
    // This is a placeholder - implement actual booking check logic
    return false;
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await eventService.deleteEvent(eventId);
      await refreshEvents();
    } catch (err) {
      console.error('Failed to delete event:', err);
      throw err;
    }
  };

  const softDeleteEvent = async (eventId: string) => {
    try {
      await eventService.softDeleteEvent(eventId);
      await refreshEvents();
    } catch (err) {
      console.error('Failed to archive event:', err);
      throw err;
    }
  };

  const getEventById = async (id: string) => {
    try {
      const event = await eventService.getEventById(id);
      return event;
    } catch (err) {
      console.error('Failed to get event by ID:', err);
      throw err;
    }
  };

  const addCategory = async (name: string) => {
    try {
      const newCategory = await eventService.addCategory({ name });
      setCategories(prevCategories => [...prevCategories, newCategory]);
    } catch (err) {
      console.error('Failed to add category:', err);
      throw err;
    }
  };

  const updateCategory = async (id: string, name: string) => {
    try {
      await eventService.updateCategory(id, { name });
      setCategories(prevCategories =>
        prevCategories.map(category =>
          category.id === id ? { ...category, name } : category
        )
      );
    } catch (err) {
      console.error('Failed to update category:', err);
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await eventService.deleteCategory(id);
      setCategories(prevCategories =>
        prevCategories.filter(category => category.id !== id)
      );
    } catch (err) {
      console.error('Failed to delete category:', err);
      throw err;
    }
  };

  useEffect(() => {
    refreshEvents();
  }, []);

  const value: EventContextType = {
    events,
    categories,
    loading,
    error,
    refreshEvents,
    bookEvent,
    isEventBooked,
    deleteEvent,
    softDeleteEvent,
    getEventById,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return <EventContext.Provider value={value}>{children}</EventContext.Provider>;
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};