import React from 'react';
import AppLayout from '@/layouts/app-layout';
import ProductModal from '@/components/ProductModal';

interface Product {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: string;
}

export default function Index({ products }: { products: Product[] }) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editProduct, setEditProduct] = React.useState<Product | null>(null);

  const handleCreate = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product);
    setModalOpen(true);
  };

  return (
    <AppLayout breadcrumbs={[{ title: 'Products', href: '/products' }]}> 
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Product
        </button>
        <table className="w-full mt-6 border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Stock</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td className="p-2 border">{product.id}</td>
                <td className="p-2 border">{product.name}</td>
                <td className="p-2 border">{product.price}</td>
                <td className="p-2 border">{product.stock}</td>
                <td className="p-2 border space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-blue-500"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ProductModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          product={editProduct || undefined}
          isEdit={!!editProduct}
        />
      </div>
    </AppLayout>
  );
}
