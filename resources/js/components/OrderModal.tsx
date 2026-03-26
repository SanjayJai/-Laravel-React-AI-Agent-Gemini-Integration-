import React from 'react';
import { useForm } from '@inertiajs/react';

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface User { id: number; name: string; }

interface Props {
  open: boolean;
  onClose: () => void;
  order?: any;
  users: User[];
  isEdit?: boolean;
}

export default function OrderModal({ open, onClose, order, users, isEdit }: Props) {

  const [products, setProducts] = React.useState<any[]>([]);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    user_id: order?.user_id ?? users[0]?.id ?? '',
    total_amount: order?.total_amount ?? 0,
    status: order?.status ?? 'active',
    items: order?.items ?? [],
  });

  React.useEffect(() => {
    if (open) {
      setData({
        user_id: order?.user_id ?? users[0]?.id ?? '',
        total_amount: order?.total_amount ?? 0,
        status: order?.status ?? 'active',
        items: order?.items ?? [],
      });

      fetch('/api/products')
        .then(res => res.json())
        .then(res => setProducts(res));
    }
  }, [open, order]);

  React.useEffect(() => {
    const total = data.items.reduce((sum: number, item: any) => {
      return sum + (item.price * item.quantity);
    }, 0);

    setData('total_amount', total);
  }, [data.items]);

  const addItem = () => {
    setData('items', [
      ...data.items,
      {
        product_id: products[0]?.id ?? 0,
        quantity: 1,
        price: products[0]?.price ?? 0
      }
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...data.items];
    updated[index][field] = value;

    if (field === 'product_id') {
      const product = products.find(p => p.id == value);
      updated[index].price = product?.price ?? 0;
    }

    setData('items', updated);
  };

  const removeItem = (index: number) => {
    setData('items', data.items.filter((_: any, i: number) => i !== index));
  };

  const submit = (e: any) => {
    e.preventDefault();

    if (isEdit) {
      put(`/orders/${order.id}`, { onSuccess: () => { reset(); onClose(); } });
    } else {
      post('/orders', { onSuccess: () => { reset(); onClose(); } });
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          {isEdit ? 'Edit Order' : 'Create Order'}
        </h2>

        <form onSubmit={submit} className="space-y-4">

          <select
            value={data.user_id}
            onChange={e => setData('user_id', Number(e.target.value))}
            className="border p-2 w-full rounded"
          >
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.name}</option>
            ))}
          </select>

          <select
            value={data.status}
            onChange={e => setData('status', e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="bg-gray-50 p-4 rounded">
            <div className="flex justify-between mb-3">
              <span className="font-semibold">Items</span>
              <button type="button" onClick={addItem} className="bg-green-500 text-white px-3 py-1 rounded text-sm">
                + Add
              </button>
            </div>

            {data.items.map((item: any, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <select
                  value={item.product_id}
                  onChange={e => updateItem(index, 'product_id', Number(e.target.value))}
                  className="border p-2 rounded w-1/3"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>

                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={e => updateItem(index, 'quantity', Number(e.target.value))}
                  className="border p-2 rounded w-1/4"
                />

                <input
                  type="number"
                  value={item.price}
                  readOnly
                  className="border p-2 rounded w-1/4 bg-gray-100"
                />

                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-2 rounded"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="font-semibold text-right text-lg">
            Total: ₹ {data.total_amount}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { reset(); onClose(); }}
              className="bg-gray-300 px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              disabled={processing}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              {isEdit ? 'Update' : 'Save'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}