import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Payment, type PaginatedData } from '@/types/repair';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { PageHeader, SearchFilter, Pagination, ConfirmDialog, EmptyState, StatusBadge, StatsCard } from '@/components/repair';
import { Eye, Pencil, Trash2, MoreHorizontal, CreditCard, Banknote, CheckCircle, Clock, Smartphone, Globe } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payments', href: '/payments' },
];

interface Props {
    payments: PaginatedData<Payment>;
}

export default function Index({ payments }: Props) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Calculate stats
    const stats = useMemo(() => {
        const data = payments.data;
        const totalPaid = data.filter((p) => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
        const totalPending = data.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
        return {
            total: data.length,
            paid: data.filter((p) => p.status === 'paid').length,
            pending: data.filter((p) => p.status === 'pending').length,
            totalPaid,
            totalPending,
        };
    }, [payments.data]);

    // Client-side filtering
    const filteredPayments = useMemo(() => {
        let result = payments.data;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (payment) =>
                    payment.id.toString().includes(query) ||
                    payment.repair_order?.customer?.name.toLowerCase().includes(query)
            );
        }
        
        if (statusFilter !== 'all') {
            result = result.filter((payment) => payment.status === statusFilter);
        }
        
        if (methodFilter !== 'all') {
            result = result.filter((payment) => payment.payment_method === methodFilter);
        }
        
        return result;
    }, [payments.data, searchQuery, statusFilter, methodFilter]);

    const handleDelete = (payment: Payment) => {
        setPaymentToDelete(payment);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!paymentToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/payments/${paymentToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setPaymentToDelete(null);
                setIsDeleting(false);
                toast.success('Payment deleted successfully');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete payment');
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(`/payments?page=${page}`, {}, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setMethodFilter('all');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash':
                return <Banknote className="h-4 w-4" />;
            case 'card':
                return <CreditCard className="h-4 w-4" />;
            case 'online':
                return <Globe className="h-4 w-4" />;
            default:
                return <CreditCard className="h-4 w-4" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Payments" />

            <div className="p-6 space-y-6">
                <PageHeader
                    title="Payments"
                    description="Track and manage all payment transactions"
                    createRoute="/payments/create"
                    createLabel="Record Payment"
                />

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatsCard
                        title="Total Payments"
                        value={stats.total}
                        icon={CreditCard}
                    />
                    <StatsCard
                        title="Paid"
                        value={formatCurrency(stats.totalPaid)}
                        description={`${stats.paid} transaction(s)`}
                        icon={CheckCircle}
                        className="border-l-4 border-l-green-500"
                    />
                    <StatsCard
                        title="Pending"
                        value={formatCurrency(stats.totalPending)}
                        description={`${stats.pending} transaction(s)`}
                        icon={Clock}
                        className="border-l-4 border-l-yellow-500"
                    />
                    <StatsCard
                        title="Total Revenue"
                        value={formatCurrency(stats.totalPaid)}
                        icon={Banknote}
                        className="border-l-4 border-l-primary"
                    />
                </div>

                <SearchFilter
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search by payment ID or customer name..."
                    filters={[
                        {
                            name: 'Status',
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { value: 'paid', label: 'Paid' },
                                { value: 'pending', label: 'Pending' },
                            ],
                            placeholder: 'Filter by status',
                        },
                        {
                            name: 'Method',
                            value: methodFilter,
                            onChange: setMethodFilter,
                            options: [
                                { value: 'cash', label: 'Cash' },
                                { value: 'card', label: 'Card' },
                                { value: 'online', label: 'Online' },
                            ],
                            placeholder: 'Payment method',
                        },
                    ]}
                    onClearFilters={handleClearFilters}
                    showClearButton
                />

                {filteredPayments.length > 0 ? (
                    <>
                        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Payment ID</TableHead>
                                        <TableHead className="font-semibold">Order</TableHead>
                                        <TableHead className="font-semibold">Customer</TableHead>
                                        <TableHead className="font-semibold">Amount</TableHead>
                                        <TableHead className="font-semibold">Method</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredPayments.map((payment) => (
                                        <TableRow
                                            key={payment.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                #P{payment.id.toString().padStart(5, '0')}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/repair-orders/${payment.repair_order_id}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    #{payment.repair_order_id.toString().padStart(5, '0')}
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                {payment.repair_order?.customer?.name || 'Unknown'}
                                            </TableCell>
                                            <TableCell className="font-semibold">
                                                {formatCurrency(payment.amount)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 capitalize">
                                                    {getPaymentMethodIcon(payment.payment_method)}
                                                    {payment.payment_method}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={payment.status} />
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(payment.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/payments/${payment.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/payments/${payment.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(payment)}
                                                            className="text-red-600 focus:text-red-600"
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            Delete
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination
                            currentPage={payments.current_page}
                            totalPages={payments.last_page}
                            totalItems={payments.total}
                            itemsPerPage={payments.per_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={CreditCard}
                        title="No payments found"
                        description="Start recording payments for repair orders."
                        createRoute="/payments/create"
                        createLabel="Record Payment"
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Payment"
                description={`Are you sure you want to delete payment #P${paymentToDelete?.id.toString().padStart(5, '0')}? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                variant="destructive"
                loading={isDeleting}
            />
        </AppLayout>
    );
}
