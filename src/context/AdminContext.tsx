import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';
import eventService, { Event, Category, EventRequest, CategoryRequest } from '../services/eventService';

interface AdminContextType {
  isAdmin: boolean;
  addEvent: (data: EventRequest) => Promise<Event>;
  updateEvent: (id: string, data: EventRequest) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  softDeleteEvent: (id: string) => Promise<void>;
  addCategory: (data: CategoryRequest) => Promise<Category>;
  updateCategory: (id: string, data: CategoryRequest) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  softDeleteCategory: (id: string) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user?.roles?.includes('Admin') ?? false;

  const addEvent = async (data: EventRequest) => {
    if (!isAdmin) throw new Error('Unauthorized');
    return await eventService.addEvent(data);
  };

  const updateEvent = async (id: string, data: EventRequest) => {
    if (!isAdmin) throw new Error('Unauthorized');
    await eventService.updateEvent(id, data);
  };

  const deleteEvent = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    await eventService.deleteEvent(id);
  };

  const softDeleteEvent = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    await eventService.softDeleteEvent(id);
  };

  const addCategory = async (data: CategoryRequest) => {
    if (!isAdmin) throw new Error('Unauthorized');
    return await eventService.addCategory(data);
  };

  const updateCategory = async (id: string, data: CategoryRequest) => {
    if (!isAdmin) throw new Error('Unauthorized');
    await eventService.updateCategory(id, data);
  };

  const deleteCategory = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    await eventService.deleteCategory(id);
  };

  const softDeleteCategory = async (id: string) => {
    if (!isAdmin) throw new Error('Unauthorized');
    await eventService.softDeleteCategory(id);
  };

  const value = {
    isAdmin,
    addEvent,
    updateEvent,
    deleteEvent,
    softDeleteEvent,
    addCategory,
    updateCategory,
    deleteCategory,
    softDeleteCategory,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}; 