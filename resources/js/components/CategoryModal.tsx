import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

interface Category {
  id?: number;
  name: string;
  description?: string;
}

interface CategoryModalProps {
  open: boolean;
  onClose: () => void;
  category?: Category;
  isEdit?: boolean;
}

export default function CategoryModal({ open, onClose, category, isEdit }: CategoryModalProps) {
  const { data, setData, post, put, processing, errors, reset } = useForm<Category>({
    name: category?.name || '',
    description: category?.description || '',
  });

  React.useEffect(() => {
    if (open) {
      setData({
        name: category?.name || '',
        description: category?.description || '',
      });
    }
  }, [open, category, setData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && category?.id) {
      put(`/categories/${category.id}`);
    } else {
      post('/categories');
    }
    onClose();
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Category' : 'Create Category'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={data.name}
            onChange={e => setData('name', e.target.value)}
            placeholder="Name"
            className="border p-2 w-full"
          />
          {errors.name && <div className="text-red-500">{errors.name}</div>}
          <textarea
            value={data.description}
            onChange={e => setData('description', e.target.value)}
            placeholder="Description"
            className="border p-2 w-full"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={processing}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
