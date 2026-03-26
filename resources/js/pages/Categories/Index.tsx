import React from 'react';
import { Link, router } from '@inertiajs/react';
import CategoryModal from '@/components/CategoryModal';
import AppLayout from '@/layouts/app-layout';

interface Category {
    id: number;
    name: string;
    description?: string;
}

export default function Index({ categories }: { categories: Category[] }) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const [editCategory, setEditCategory] = React.useState<Category | null>(null);

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure?')) {
            router.delete(`/categories/${id}`);
        }
    };

    const handleCreate = () => {
        setEditCategory(null);
        setModalOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Categories', href: '/categories' }]}> 
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Categories</h1>
                <button
                    onClick={handleCreate}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Create Category
                </button>
                <table className="w-full mt-6 border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 border">ID</th>
                            <th className="p-2 border">Name</th>
                            <th className="p-2 border">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id}>
                                <td className="p-2 border">{category.id}</td>
                                <td className="p-2 border">{category.name}</td>
                                <td className="p-2 border space-x-2">
                                    <button
                                        onClick={() => handleEdit(category)}
                                        className="text-blue-500"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => deleteCategory(category.id)}
                                        className="text-red-500"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <CategoryModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    category={editCategory || undefined}
                    isEdit={!!editCategory}
                />
            </div>
        </AppLayout>
    );
}