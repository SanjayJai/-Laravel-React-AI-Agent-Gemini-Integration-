import React from 'react';
import { useForm } from '@inertiajs/react';

interface Product {
  id?: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product?: Product;
  isEdit?: boolean;
}

export default function ProductModal({ open, onClose, product, isEdit }: ProductModalProps) {
  const [categories, setCategories] = React.useState<Array<{id:number,name:string}>>([]);
  const { data, setData, post, put, processing, errors, reset } = useForm<Product>({
    category_id: product?.category_id || 0,
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    image: product?.image || '',
  });

  React.useEffect(() => {
    if (open) {
      setData({
        category_id: product?.category_id || 0,
        name: product?.name || '',
        description: product?.description || '',
        price: product?.price || 0,
        stock: product?.stock || 0,
        image: product?.image || '',
      });
      fetch('/api/categories')
        .then(res => res.json())
        .then(res => setCategories(Array.isArray(res) ? res : []));
    }
  }, [open, product, setData]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setData('image', e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && product?.id) {
      put(`/products/${product.id}`);
    } else {
      post('/products');
    }
    onClose();
    reset();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{isEdit ? 'Edit Product' : 'Create Product'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={data.category_id}
            onChange={e => setData('category_id', Number(e.target.value))}
            className="border p-2 w-full"
            disabled={categories.length === 0}
          >
            <option value="">{categories.length === 0 ? 'No categories found' : 'Select Category'}</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.category_id && <div className="text-red-500">{errors.category_id}</div>}
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
          {errors.description && <div className="text-red-500">{errors.description}</div>}
          <input
            type="number"
            value={data.price}
            onChange={e => setData('price', Number(e.target.value))}
            placeholder="Price"
            className="border p-2 w-full"
          />
          {errors.price && <div className="text-red-500">{errors.price}</div>}
          <input
            type="number"
            value={data.stock}
            onChange={e => setData('stock', Number(e.target.value))}
            placeholder="Stock"
            className="border p-2 w-full"
          />
          {errors.stock && <div className="text-red-500">{errors.stock}</div>}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="border p-2 w-full"
          />
          {errors.image && <div className="text-red-500">{errors.image}</div>}
          {data.image && typeof data.image === 'string' && (
            <img src={data.image} alt="Product" className="w-24 h-24 object-cover rounded" />
          )}
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
