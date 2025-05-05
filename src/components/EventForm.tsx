import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { ArrowLeftIcon, SaveIcon } from 'lucide-react';
interface EventFormData {
  name: string;
  description: string;
  category: string;
  date: string;
  venue: string;
  price: string;
  imageUrl: string;
}
const EventForm = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    getEvent,
    addEvent,
    updateEvent
  } = useEvents();
  const isEditMode = Boolean(id);
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    description: '',
    category: '',
    date: '',
    venue: '',
    price: '',
    imageUrl: ''
  });
  const [errors, setErrors] = useState<Partial<EventFormData>>({});
  // If editing, load event data
  useEffect(() => {
    if (isEditMode && id) {
      const event = getEvent(id);
      if (event) {
        setFormData({
          name: event.name,
          description: event.description,
          category: event.category,
          date: event.date,
          venue: event.venue,
          price: event.price.toString(),
          imageUrl: event.imageUrl
        });
      } else {
        navigate('/admin');
      }
    }
  }, [id, isEditMode, getEvent, navigate]);
  const validateForm = (): boolean => {
    const newErrors: Partial<EventFormData> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.venue.trim()) {
      newErrors.venue = 'Venue is required';
    }
    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'Price must be a valid positive number';
    }
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!formData.imageUrl.match(/^https?:\/\/.+/i)) {
      newErrors.imageUrl = 'Please enter a valid URL starting with http:// or https://';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name as keyof EventFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const eventData = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      date: formData.date,
      venue: formData.venue,
      price: parseFloat(formData.price),
      imageUrl: formData.imageUrl
    };
    if (isEditMode && id) {
      updateEvent(id, eventData);
    } else {
      addEvent(eventData);
    }
    navigate('/admin');
  };
  return <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-1 text-gray-600 hover:text-gray-800">
          <ArrowLeftIcon className="h-5 w-5" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditMode ? 'Edit Event' : 'Create New Event'}
        </h1>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="col-span-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Event Name*
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description*
              </label>
              <textarea id="description" name="description" rows={4} value={formData.description} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.description && <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>}
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category*
              </label>
              <select id="category" name="category" value={formData.category} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select a category</option>
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
                <option value="Art">Art</option>
                <option value="Business">Business</option>
                <option value="Education">Education</option>
                <option value="Entertainment">Entertainment</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                Date*
              </label>
              <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
            <div>
              <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">
                Venue*
              </label>
              <input type="text" id="venue" name="venue" value={formData.venue} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.venue ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.venue && <p className="mt-1 text-sm text-red-600">{errors.venue}</p>}
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price* ($)
              </label>
              <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.price ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
            <div className="col-span-2">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                Image URL*
              </label>
              <input type="text" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.imageUrl ? 'border-red-500' : 'border-gray-300'}`} />
              {errors.imageUrl && <p className="mt-1 text-sm text-red-600">{errors.imageUrl}</p>}
              {formData.imageUrl && <div className="mt-2">
                  <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
                  <img src={formData.imageUrl} alt="Event preview" className="h-40 w-full object-cover rounded-md" onError={e => {
                ;
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
              }} />
                </div>}
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center gap-2 transition-colors duration-200">
              <SaveIcon className="h-5 w-5" />
              <span>{isEditMode ? 'Update Event' : 'Create Event'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default EventForm;