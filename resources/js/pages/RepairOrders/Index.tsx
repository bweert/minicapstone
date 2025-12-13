import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RepairOrder, type PaginatedData } from '@/types/repair';
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
import { Eye, Pencil, Trash2, MoreHorizontal, ClipboardList, Clock, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Repair Orders', href: '/repair-orders' },
];

interface Props {
    orders: PaginatedData<RepairOrder>;
}

export default function Index({ orders }: Props) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState<RepairOrder | null>(null);
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
        const data = orders.data;
        return {
            total: data.length,
            pending: data.filter((o) => o.status === 'pending').length,
            inProgress: data.filter((o) => o.status === 'in_progress').length,
            completed: data.filter((o) => o.status === 'completed').length,
        };
    }, [orders.data]);

    // Client-side filtering
    const filteredOrders = useMemo(() => {
        let result = orders.data;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (order) =>
                    order.id.toString().includes(query) ||
                    order.customer?.name.toLowerCase().includes(query)
            );
        }
        
        if (statusFilter !== 'all') {
            result = result.filter((order) => order.status === statusFilter);
        }
        
        return result;
    }, [orders.data, searchQuery, statusFilter]);

    const handleDelete = (order: RepairOrder) => {
        setOrderToDelete(order);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!orderToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/repair-orders/${orderToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setOrderToDelete(null);
                setIsDeleting(false);
                toast.success('Repair order deleted successfully');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete repair order');
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(`/repair-orders?page=${page}`, {}, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Repair Orders" />

            <div className="p-6 space-y-6">
                <PageHeader
                    title="Repair Orders"
                    description="Manage all repair orders and track their progress"
                    createRoute="/repair-orders/create"
                    createLabel="New Order"
                />

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatsCard
                        title="Total Orders"
                        value={stats.total}
                        icon={ClipboardList}
                    />
                    <StatsCard
                        title="Pending"
                        value={stats.pending}
                        icon={Clock}
                        className="border-l-4 border-l-yellow-500"
                    />
                    <StatsCard
                        title="In Progress"
                        value={stats.inProgress}
                        icon={Loader2}
                        className="border-l-4 border-l-blue-500"
                    />
                    <StatsCard
                        title="Completed"
                        value={stats.completed}
                        icon={CheckCircle}
                        className="border-l-4 border-l-green-500"
                    />
                </div>

                <SearchFilter
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search by order ID or customer name..."
                    filters={[
                        {
                            name: 'Status',
                            value: statusFilter,
                            onChange: setStatusFilter,
                            options: [
                                { value: 'pending', label: 'Pending' },
                                { value: 'in_progress', label: 'In Progress' },
                                { value: 'completed', label: 'Completed' },
                            ],
                            placeholder: 'Filter by status',
                        },
                    ]}
                    onClearFilters={handleClearFilters}
                    showClearButton
                />

                {filteredOrders.length > 0 ? (
                    <>
                        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Order ID</TableHead>
                                        <TableHead className="font-semibold">Customer</TableHead>
                                        <TableHead className="font-semibold">Services</TableHead>
                                        <TableHead className="font-semibold">Status</TableHead>
                                        <TableHead className="font-semibold">Total</TableHead>
                                        <TableHead className="font-semibold">Date</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredOrders.map((order) => (
                                        <TableRow
                                            key={order.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                #{order.id.toString().padStart(5, '0')}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {order.customer?.name.charAt(0).toUpperCase() || '?'}
                                                        </span>
                                                    </div>
                                                    <span>{order.customer?.name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-muted-foreground">
                                                    {order.services?.length || 0} service(s)
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <StatusBadge status={order.status} />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(order.total_price)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(order.created_at).toLocaleDateString()}
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
                                                            <Link href={`/repair-orders/${order.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/repair-orders/${order.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(order)}
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
                            currentPage={orders.current_page}
                            totalPages={orders.last_page}
                            totalItems={orders.total}
                            itemsPerPage={orders.per_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={ClipboardList}
                        title="No repair orders found"
                        description="Get started by creating your first repair order."
                        createRoute="/repair-orders/create"
                        createLabel="Create Order"
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Repair Order"
                description={`Are you sure you want to delete order #${orderToDelete?.id.toString().padStart(5, '0')}? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                variant="destructive"
                loading={isDeleting}
            />
        </AppLayout>
    );
}
