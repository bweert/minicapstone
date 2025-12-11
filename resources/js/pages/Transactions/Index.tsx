import { useState, useMemo, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Transactions',
        href: '/transactions',
    },
];

interface Transaction {
    id: number;
    reference_number: string;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    payment_method: 'cash' | 'gcash';
    created_at: string;
}

interface Props {
    transactions: {
        data: Transaction[];
    };
}

const ITEMS_PER_PAGE = 10;

export default function Index({ transactions: initialTransactions }: Props) {
    const transactionsData = initialTransactions?.data || [];
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter transactions based on search and payment method
    const filteredTransactions = useMemo(() => {
        return transactionsData.filter(transaction => {
            const matchesSearch = transaction.reference_number.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesMethod = selectedMethod === null || transaction.payment_method === selectedMethod;
            return matchesSearch && matchesMethod;
        });
    }, [transactionsData, searchQuery, selectedMethod]);

    // Pagination logic
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedMethod(null);
        setCurrentPage(1);
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedMethod]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Transactions</h1>
                </div>

                {/* Search Bar */}
                <div className="flex gap-4">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search by reference number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 w-full"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Payment Method Filter */}
                <div className="space-y-2">
                    <div className="text-sm font-semibold text-gray-700">Filter by Payment Method:</div>
                    <div className="flex flex-wrap gap-2">
                        <Badge
                            variant={selectedMethod === null ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-2"
                            onClick={() => setSelectedMethod(null)}
                        >
                            All Methods
                        </Badge>
                        <Badge
                            variant={selectedMethod === 'cash' ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-200 transition"
                            onClick={() => setSelectedMethod('cash')}
                        >
                            💵 Cash
                        </Badge>
                        <Badge
                            variant={selectedMethod === 'gcash' ? 'default' : 'outline'}
                            className="cursor-pointer px-3 py-2 hover:bg-gray-200 transition"
                            onClick={() => setSelectedMethod('gcash')}
                        >
                            📱 GCash
                        </Badge>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(searchQuery || selectedMethod !== null) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                        <div className="text-sm text-blue-800">
                            Showing <span className="font-semibold">{filteredTransactions.length}</span> of <span className="font-semibold">{transactionsData.length}</span> transactions
                            {searchQuery && ` matching "${searchQuery}"`}
                            {selectedMethod && ` with ${selectedMethod === 'cash' ? '💵 Cash' : '📱 GCash'}`}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilters}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}

                {/* Transactions Table */}
                {paginatedTransactions.length > 0 ? (
                    <>
                        <div className="rounded-lg border overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="font-semibold">Reference #</TableHead>
                                        <TableHead className="font-semibold">Date & Time</TableHead>
                                        <TableHead className="font-semibold">Payment Method</TableHead>
                                        <TableHead className="font-semibold text-right">Subtotal</TableHead>
                                        <TableHead className="font-semibold text-right">Tax</TableHead>
                                        <TableHead className="font-semibold text-right">Discount</TableHead>
                                        <TableHead className="font-semibold text-right">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedTransactions.map((transaction, idx) => (
                                        <TableRow key={transaction.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <TableCell className="font-mono font-bold text-blue-600">
                                                {transaction.reference_number}
                                            </TableCell>
                                            <TableCell className="text-sm">
                                                {new Date(transaction.created_at).toLocaleDateString('en-PH')}
                                                <br />
                                                <span className="text-xs text-gray-500">
                                                    {new Date(transaction.created_at).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                                    {transaction.payment_method === 'cash' ? '💵 Cash' : '📱 GCash'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                ₱{(Number(transaction.subtotal) || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                ₱{(Number(transaction.tax) || 0).toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right text-green-600 font-medium">
                                                {Number(transaction.discount) > 0 ? `-₱${(Number(transaction.discount) || 0).toFixed(2)}` : '-'}
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-lg">
                                                ₱{(Number(transaction.total) || 0).toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg border">
                            <div className="text-sm text-gray-600">
                                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                                {' | '}
                                Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, filteredTransactions.length)}</span> of <span className="font-semibold">{filteredTransactions.length}</span> transactions
                            </div>

                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handlePrevPage}
                                    disabled={currentPage === 1}
                                    className="gap-2"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>

                                {/* Page Numbers */}
                                <div className="flex gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <Button
                                            key={page}
                                            variant={currentPage === page ? 'default' : 'outline'}
                                            size="sm"
                                            onClick={() => setCurrentPage(page)}
                                            className="w-10 h-10 p-0"
                                        >
                                            {page}
                                        </Button>
                                    ))}
                                </div>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleNextPage}
                                    disabled={currentPage === totalPages}
                                    className="gap-2"
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">
                            No transactions found matching your criteria.
                        </p>
                        <Button
                            variant="ghost"
                            onClick={handleClearFilters}
                            className="mt-4 text-blue-600"
                        >
                            Clear Filters and Try Again
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
