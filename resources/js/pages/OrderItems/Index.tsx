import React from 'react';
import AppLayout from '@/layouts/app-layout';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export default function Index({ orderItems }: { orderItems: OrderItem[] }) {
  return (
    <AppLayout breadcrumbs={[{ title: 'Order Items', href: '/order-items' }]}> 
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Order Items</h1>
        <table className="w-full mt-6 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Order ID</th>
              <th className="p-2 border">Product ID</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Price</th>
            </tr>
          </thead>
          <tbody>
            {orderItems.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.id}</td>
                <td className="p-2 border">{item.order_id}</td>
                <td className="p-2 border">{item.product_id}</td>
                <td className="p-2 border">{item.quantity}</td>
                <td className="p-2 border">{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}
