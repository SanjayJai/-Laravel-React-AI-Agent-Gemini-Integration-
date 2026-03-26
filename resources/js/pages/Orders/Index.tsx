import React from 'react';
import { router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import OrderModal from '@/components/OrderModal';

interface Order {
  id: number;
  user: { name: string };
  total_amount: number;
  status: string;
}

interface User { id: number; name: string; }

interface Props {
  orders: Order[];
  users: User[];
}

export default function Index({ orders, users }: Props) {
  const [open, setOpen] = React.useState(false);
  const [editOrder, setEditOrder] = React.useState<Order | null>(null);

  return (
    <AppLayout breadcrumbs={[{ title: 'Orders', href: '/orders' }]}>
      <div className="p-6 max-w-6xl">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orders</h1>
          <button
            onClick={() => { setEditOrder(null); setOpen(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
          >
            + Create Order
          </button>
        </div>

        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">#</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{order.id}</td>
                  <td className="p-3">{order.user?.name}</td>
                  <td className="p-3 font-semibold">₹ {order.total_amount}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium 
                      ${order.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-3 text-right space-x-3">
                    <button
                      onClick={() => { setEditOrder(order); setOpen(true); }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => router.delete(`/orders/${order.id}`)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <OrderModal
          open={open}
          onClose={() => setOpen(false)}
          order={editOrder || undefined}
          users={users}
          isEdit={!!editOrder}
        />
      </div>
    </AppLayout>
  );
}