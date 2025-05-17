import api from './api';
import axios from 'axios';

const API_URL = 'https://localhost:7054';

export interface IEvent {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  eventDate: string;
  createdAt: string;
  venue: string;
  price: number;
  imageUrl: string;
  isDeleted: boolean;
}

export class Event implements IEvent {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  categoryName: string;
  eventDate: string;
  createdAt: string;
  venue: string;
  price: number;
  imageUrl: string;
  isDeleted: boolean;

  constructor(data: IEvent) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.categoryId = data.categoryId;
    this.categoryName = data.categoryName;
    this.eventDate = data.eventDate;
    this.createdAt = data.createdAt;
    this.venue = data.venue;
    this.price = data.price;
    this.imageUrl = data.imageUrl;
    this.isDeleted = data.isDeleted;
  }

  get fullImageUrl(): string {
    if (this.imageUrl.startsWith('http')) {
      return this.imageUrl;
    }
    const cleanPath = this.imageUrl.replace(/^\/+/, '');
    return `${API_URL}/${cleanPath}`;
  }
}

export interface EventRequest {
  Title: string;
  Description: string;
  CategoryId: string;
  EventDate: string;
  Venue: string;
  Price: number;
  Image: File;
}

export interface Category {
  id: string;
  name: string;
  isDeleted: boolean;
  events?: Event[];
}

export interface CategoryRequest {
  name: string;
}

export interface BookingRequest {
  EventId: string;
  BookingDate: string;
}

export interface Booking {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  bookingDate: string;
}

export interface AppUser {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  createdAt: string;
  isDeleted: boolean;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;
  lockoutEnabled: boolean;
  accessFailedCount: number;
  bookings?: Booking[];
  refreshTokens?: RefreshToken[];
}

export interface RefreshToken {
  id?: string;
  token?: string;
  expiresOn: string;
  isExpired: boolean;
  createdOn: string;
  revokedOn?: string;
  isActive: boolean;
  isDeleted: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiration: string;
  userId: string;
  userName: string;
  email: string;
  roles: string[];
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse {
  userId?: string;
  userName?: string;
  email?: string;
  message?: string;
}

export interface UpdateProfileModel {
  firstName?: string;
  lastName?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

export interface RoleModel {
  userId: string;
  roleName: string;
}

export interface LogoutRequest {
  refreshToken?: string;
}

const eventService = {
  getAllEvents: async (pageNumber: number = 1, pageSize: number = 10): Promise<Event[]> => {
    const response = await api.get<IEvent[]>('/Event/GetAllEvents', {
      params: { pageNumber, pageSize }
    });
    return response.data.map(event => new Event(event));
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await api.get<IEvent>(`/Event/GetEventById/${id}`);
    return new Event(response.data);
  },

  getEventsByCategory: async (categoryId: string, pageNumber: number = 1, pageSize: number = 10): Promise<Event[]> => {
    const response = await api.get<IEvent[]>(`/Event/GetEventsByCategory/${categoryId}`, {
      params: { pageNumber, pageSize }
    });
    return response.data.map(event => new Event(event));
  },

  addEvent: async (data: EventRequest): Promise<Event> => {
    const formData = new FormData();
    formData.append('Title', data.Title);
    formData.append('Description', data.Description);
    formData.append('CategoryId', data.CategoryId);
    formData.append('EventDate', data.EventDate);
    formData.append('Venue', data.Venue);
    formData.append('Price', data.Price.toString());
    formData.append('Image', data.Image);
    
    const response = await api.post<IEvent>('/Event/AddEvent', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return new Event(response.data);
  },

  updateEvent: async (id: string, data: EventRequest): Promise<void> => {
    const formData = new FormData();
    formData.append('Title', data.Title);
    formData.append('Description', data.Description);
    formData.append('CategoryId', data.CategoryId);
    formData.append('EventDate', data.EventDate);
    formData.append('Venue', data.Venue);
    formData.append('Price', data.Price.toString());
    if (data.Image) {
      formData.append('Image', data.Image);
    }
    
    await api.put(`/Event/UpdateEvent/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  deleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/Event/DeleteEvent/${id}`);
  },

  softDeleteEvent: async (id: string): Promise<void> => {
    await api.delete(`/Event/SoftDeleteEvent/${id}`);
  },

  // Category endpoints
  getAllCategories: async (pageNumber: number = 1, pageSize: number = 10): Promise<Category[]> => {
    const response = await api.get<Category[]>('/Category/GetAllCategories', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  },

  getCategoryById: async (id: string): Promise<Category> => {
    const response = await api.get<Category>(`/Category/GetCategoryById/${id}`);
    return response.data;
  },

  addCategory: async (data: CategoryRequest): Promise<Category> => {
    const response = await api.post<Category>('/Category/AddCategory', data);
    return response.data;
  },

  updateCategory: async (id: string, data: CategoryRequest): Promise<void> => {
    await api.put(`/Category/UpdateCategory/${id}`, data);
  },

  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/Category/DeleteCategory/${id}`);
  },

  softDeleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/Category/SoftDeleteCategory/${id}`);
  },

  // Booking endpoints
  getAllBookings: async (pageNumber: number = 1, pageSize: number = 10): Promise<Booking[]> => {
    const response = await api.get<Booking[]>('/Booking/GetAllBookings', {
      params: { pageNumber, pageSize }
    });
    return response.data;
  },

  getBookingById: async (id: string): Promise<Booking> => {
    const response = await api.get<Booking>(`/Booking/GetBookingById/${id}`);
    return response.data;
  },

  addBooking: async (data: BookingRequest): Promise<Booking> => {
    const response = await api.post<Booking>('/Booking/AddBooking', data);
    return response.data;
  },

  deleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/Booking/DeleteBooking/${id}`);
  },

  softDeleteBooking: async (id: string): Promise<void> => {
    await api.delete(`/Booking/SoftDeleteBooking/${id}`);
  },

  async getUserBookings(): Promise<Booking[]> {
    const response = await api.get<Booking[]>('/Booking/GetUserBookings');
    return response.data;
  },

  async bookEvent(eventId: string): Promise<void> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    try {
      await axios.post(
        `${API_URL}/api/Booking/AddBooking`,
        { 
          EventId: eventId,
          BookingDate: new Date().toISOString()
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error('You have already booked this event');
      }
      throw error;
    }
  },
};

export default eventService; 