import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';

interface Sale {
    id: number;
    total_amount: number;
    payment_method: string;
    status: string;
    created_at: string;
}

interface Props {
    sales: Sale[];
}

export default function Index({ sales }: Props) {
    return (
        <AppLayout>
            <Head title="Sales" />

            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Sales</h1>

                <div className="bg-white rounded shadow">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Total</th>
                                <th className="p-3 text-left">Payment</th>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-gray-500">
                                        No sales found
                                    </td>
                                </tr>
                            )}

                            {sales.map(sale => (
                                <tr key={sale.id} className="border-b">
                                    <td className="p-3">{sale.id}</td>
                                    <td className="p-3">₱{sale.total_amount}</td>
                                    <td className="p-3">{sale.payment_method}</td>
                                    <td className="p-3">{sale.status}</td>
                                    <td className="p-3">
                                        {new Date(sale.created_at).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}
