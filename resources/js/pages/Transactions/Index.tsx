import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Transaction, type PaginatedData, type TransactionStats } from '@/types/pos';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, SearchFilter, Pagination, EmptyState, StatsCard } from '@/components/repair';
import { 
    Eye, Receipt, DollarSign, CreditCard, Banknote, TrendingUp, 
    Calendar, ShoppingCart
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Transactions', href: '/transactions' },
];

interface Props {
    transactions: PaginatedData<Transaction>;
    stats: TransactionStats;
}

export default function Index({ transactions, stats }: Props) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Client-side filtering
    const filteredTransactions = useMemo(() => {
        let result = transactions.data;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (transaction) => transaction.reference_number.toLowerCase().includes(query)
            );
        }
        
        if (selectedMethod) {
            result = result.filter(
                (transaction) => transaction.payment_method === selectedMethod
            );
        }
        
        return result;
    }, [transactions.data, searchQuery, selectedMethod]);

    const handlePageChange = (page: number) => {
        router.get(`/transactions?page=${page}`, {}, { preserveState: true });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
            time: date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
        };
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Transactions" />

            <div className="p-6 space-y-6">
                <PageHeader
                    title="Transactions"
                    description="View all sales transactions"
                />

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatsCard
                        title="Total Transactions"
                        value={stats.total_transactions}
                        icon={Receipt}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={formatCurrency(stats.total_revenue)}
                        icon={DollarSign}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                    />
                    <StatsCard
                        title="Today's Sales"
                        value={formatCurrency(stats.today_revenue)}
                        subtitle={`${stats.today_transactions} transactions`}
                        icon={TrendingUp}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-100"
                    />
                    <StatsCard
                        title="Payment Methods"
                        value={`${stats.cash_transactions} / ${stats.gcash_transactions}`}
                        subtitle="Cash / GCash"
                        icon={CreditCard}
                        iconColor="text-orange-600"
                        iconBgColor="bg-orange-100"
                    />
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchFilter
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            searchPlaceholder="Search by reference number..."
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={selectedMethod === null ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedMethod(null)}
                        >
                            All
                        </Button>
                        <Button
                            variant={selectedMethod === 'cash' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedMethod('cash')}
                            className="gap-2"
                        >
                            <Banknote className="h-4 w-4" />
                            Cash
                        </Button>
                        <Button
                            variant={selectedMethod === 'gcash' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedMethod('gcash')}
                            className="gap-2"
                        >
                            <CreditCard className="h-4 w-4" />
                            GCash
                        </Button>
                    </div>
                </div>

                {filteredTransactions.length > 0 ? (
                    <>
                        <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Reference #</TableHead>
                                        <TableHead className="font-semibold">Date & Time</TableHead>
                                        <TableHead className="font-semibold">Items</TableHead>
                                        <TableHead className="font-semibold">Payment Method</TableHead>
                                        <TableHead className="font-semibold text-right">Subtotal</TableHead>
                                        <TableHead className="font-semibold text-right">Tax</TableHead>
                                        <TableHead className="font-semibold text-right">Total</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredTransactions.map((transaction) => {
                                        const { date, time } = formatDate(transaction.created_at);
                                        const itemCount = transaction.items?.length || 0;
                                        return (
                                            <TableRow
                                                key={transaction.id}
                                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => router.visit(`/transactions/${transaction.id}`)}
                                            >
                                                <TableCell className="font-mono font-bold text-primary">
                                                    {transaction.reference_number}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <div>
                                                            <p className="font-medium">{date}</p>
                                                            <p className="text-xs text-muted-foreground">{time}</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="gap-1">
                                                        <ShoppingCart className="h-3 w-3" />
                                                        {itemCount} items
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {transaction.payment_method === 'cash' ? (
                                                        <Badge className="bg-green-100 text-green-700 gap-1">
                                                            <Banknote className="h-3 w-3" />
                                                            Cash
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-blue-100 text-blue-700 gap-1">
                                                            <CreditCard className="h-3 w-3" />
                                                            GCash
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {formatCurrency(transaction.subtotal)}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {formatCurrency(transaction.tax)}
                                                </TableCell>
                                                <TableCell className="text-right font-bold text-green-600">
                                                    {formatCurrency(transaction.total)}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        asChild
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <Link href={`/transactions/${transaction.id}`}>
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination
                            currentPage={transactions.current_page}
                            totalPages={transactions.last_page}
                            totalItems={transactions.total}
                            itemsPerPage={transactions.per_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={Receipt}
                        title="No transactions found"
                        description="Transactions will appear here after sales are made in the POS."
                    />
                )}
            </div>
        </AppLayout>
    );
}
