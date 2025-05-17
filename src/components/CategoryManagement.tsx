import React, { useState } from 'react';
import { useEvents } from '@/context/EventContext';
import { PlusIcon, PencilIcon, TrashIcon, XIcon } from 'lucide-react';

const CategoryManagement = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useEvents();
  const [categoryName, setCategoryName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, categoryName);
        setEditingId(null);
      } else {
        await addCategory(categoryName);
      }
      setCategoryName('');
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (id: string, name: string) => {
    setEditingId(id);
    setCategoryName(name);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Categories</h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Category</span>
          </button>
        )}
      </div>

      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Category name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {editingId ? 'Update' : 'Add'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setEditingId(null);
                setCategoryName('');
              }}
              className="p-2 text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-lg shadow-sm">
        <ul className="divide-y divide-gray-200">
          {categories.map((category) => (
            <li key={category.id} className="p-4 flex items-center justify-between">
              <span className="text-gray-900">{category.name}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(category.id, category.name)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManagement; 