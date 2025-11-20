import AppLayout from '@/layouts/app-layout';
import { index as productsIndex } from '@/routes/products';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: productsIndex().url,
    },
];

export default function Index({ products }: { products: any[] }) {
    const { data, setData, post, put, delete: destroy } = useForm({
        name: '',
        price: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/products');
    };

    const update = (product: any) => {
        const newName = prompt('New name:', product.name);
        const newPrice = prompt('New price:', product.price);

        if (newName && newPrice) {
            put(`/products/${product.id}`, {
                data: {
                    name: newName,
                    price: newPrice,
                },
            });
        }
    };

    const remove = (id: number) => {
        if (confirm('Delete this product?')) {
            destroy(`/products/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="p-4">
                <h1 className="text-xl font-bold mb-4">Products CRUD</h1>

                {/* CREATE */}
                <form onSubmit={submit} className="mb-4">
                    <input
                        type="text"
                        placeholder="Product name"
                        className="border p-2 mr-2"
                        onChange={(e) => setData('name', e.target.value)}
                    />

                    <input
                        type="number"
                        placeholder="Price"
                        className="border p-2 mr-2"
                        onChange={(e) => setData('price', e.target.value)}
                    />

                    <button className="bg-blue-500 text-white px-4 py-2 rounded">
                        Add
                    </button>
                </form>

                {/* LIST */}
                <table className="w-full border">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border p-2">ID</th>
                            <th className="border p-2">Name</th>
                            <th className="border p-2">Price</th>
                            <th className="border p-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p) => (
                            <tr key={p.id}>
                                <td className="border p-2">{p.id}</td>
                                <td className="border p-2">{p.name}</td>
                                <td className="border p-2">{p.price}</td>
                                <td className="border p-2">

                                    <button
                                        onClick={() => update(p)}
                                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => remove(p.id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Delete
                                    </button>

                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
}
