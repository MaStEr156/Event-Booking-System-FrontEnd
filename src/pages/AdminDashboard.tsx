import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { PlusIcon, EditIcon, TrashIcon, ListIcon, GridIcon } from 'lucide-react';
import EventForm from '../components/EventForm';
const AdminDashboard = () => {
  const {
    events,
    deleteEvent
  } = useEvents();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const navigate = useNavigate();
  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(id);
    }
  };
  return <div className="max-w-7xl mx-auto">
      <Routes>
        <Route path="/" element={<>
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <Link to="/admin/create" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium flex items-center gap-1 transition-colors duration-200">
                  <PlusIcon className="h-5 w-5" />
                  <span>Create Event</span>
                </Link>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Manage Events
                  </h2>
                  <div className="flex gap-2">
                    <button onClick={() => setViewMode('grid')} className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                      <GridIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                      <ListIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {events.length === 0 ? <div className="text-center py-20">
                    <p className="text-gray-500 text-xl">
                      No events found. Create your first event!
                    </p>
                  </div> : viewMode === 'grid' ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => <div key={event.id} className="bg-gray-50 rounded-lg overflow-hidden shadow">
                        <div className="h-40 overflow-hidden">
                          <img src={event.imageUrl} alt={event.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-bold text-lg mb-2">
                            {event.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {new Date(event.date).toLocaleDateString()} •{' '}
                            {event.venue}
                          </p>
                          <div className="flex justify-end gap-2">
                            <button onClick={() => navigate(`/admin/edit/${event.id}`)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                              <EditIcon className="h-5 w-5" />
                            </button>
                            <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                              <TrashIcon className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>)}
                  </div> : <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Event
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Venue
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {events.map(event => <tr key={event.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0">
                                  <img src={event.imageUrl} alt={event.name} className="h-10 w-10 rounded-full object-cover" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {event.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {event.category}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(event.date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.venue}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              ${event.price.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => navigate(`/admin/edit/${event.id}`)} className="text-blue-600 hover:text-blue-900">
                                  Edit
                                </button>
                                <button onClick={() => handleDeleteEvent(event.id)} className="text-red-600 hover:text-red-900">
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>)}
                      </tbody>
                    </table>
                  </div>}
              </div>
            </>} />
        <Route path="/create" element={<EventForm />} />
        <Route path="/edit/:id" element={<EventForm />} />
      </Routes>
    </div>;
};
export default AdminDashboard;