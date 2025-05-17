import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '@/context/EventContext';
import { useAdmin } from '@/context/AdminContext';
import eventService, { Event, Category } from '@/services/eventService';
import { PlusIcon, EditIcon, TrashIcon, ListIcon, GridIcon, TagIcon, PencilIcon, ArchiveIcon } from 'lucide-react';
import EventForm from '@/components/EventForm';
import CategoryForm from '@/components/CategoryForm';

const AdminDashboard = () => {
  const { events, deleteEvent, softDeleteEvent, refreshEvents } = useEvents();
  const { isAdmin, deleteCategory, softDeleteCategory } = useAdmin();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const navigate = useNavigate();

  const refreshCategories = async () => {
    try {
      const categoriesData = await eventService.getAllCategories();
      setCategories(categoriesData);
    } catch (err) {
      console.error('Failed to refresh categories:', err);
      setError('Failed to refresh categories');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData] = await Promise.all([
          eventService.getAllCategories()
        ]);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        await refreshEvents();
      } catch (error) {
        console.error('Failed to delete event:', error);
        setError('Failed to delete event');
      }
    }
  };

  const handleSoftDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to archive this event?')) {
      try {
        await softDeleteEvent(id);
        await refreshEvents();
      } catch (error) {
        console.error('Failed to archive event:', error);
        setError('Failed to archive event');
      }
    }
  };

  const handleEditEvent = async (event: Event) => {
    try {
      const fullEvent = await eventService.getEventById(event.id);
      setSelectedEvent(fullEvent);
      setShowEventForm(true);
    } catch (error) {
      console.error('Failed to fetch event details:', error);
      setError('Failed to fetch event details');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
        // Refresh categories list
        const updatedCategories = await eventService.getAllCategories();
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Failed to delete category:', error);
        setError('Failed to delete category');
      }
    }
  };

  const handleSoftDeleteCategory = async (id: string) => {
    if (window.confirm('Are you sure you want to archive this category?')) {
      try {
        await softDeleteCategory(id);
        // Refresh categories list
        const updatedCategories = await eventService.getAllCategories();
        setCategories(updatedCategories);
      } catch (error) {
        console.error('Failed to archive category:', error);
        setError('Failed to archive category');
      }
    }
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowCategoryForm(true);
  };

  if (!isAdmin) {
    return <div>Access Denied</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Events Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Events</h2>
          <button 
            onClick={() => {
              setSelectedEvent(null);
              setShowEventForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Event
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{event.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(event.eventDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{event.venue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleSoftDeleteEvent(event.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <ArchiveIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setShowCategoryForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            Add Category
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{category.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleSoftDeleteCategory(category.id)}
                        className="text-gray-600 hover:text-gray-800"
                      >
                        <ArchiveIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modals */}
      {showEventForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <EventForm 
              event={selectedEvent}
              onClose={async () => {
                setShowEventForm(false);
                setSelectedEvent(null);
                await refreshEvents();
              }}
            />
          </div>
        </div>
      )}

      {showCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <CategoryForm 
              category={selectedCategory}
              onClose={async () => {
                setShowCategoryForm(false);
                setSelectedCategory(null);
                await Promise.all([refreshEvents(), refreshCategories()]);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;