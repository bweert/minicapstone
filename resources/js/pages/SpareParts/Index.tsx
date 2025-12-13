import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SparePart, type PaginatedData } from '@/types/repair';
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
import { PageHeader, SearchFilter, Pagination, ConfirmDialog, EmptyState, StatusBadge, getStockLevel, StatsCard } from '@/components/repair';
import { Pencil, Trash2, MoreHorizontal, Package, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Spare Parts', href: '/spare-parts' },
];

interface Props {
    spareParts: PaginatedData<SparePart>;
}

export default function Index({ spareParts }: Props) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [stockFilter, setStockFilter] = useState('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [partToDelete, setPartToDelete] = useState<SparePart | null>(null);
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
        const data = spareParts.data;
        return {
            total: data.length,
            lowStock: data.filter((p) => p.stock_qty <= 5).length,
            mediumStock: data.filter((p) => p.stock_qty > 5 && p.stock_qty <= 20).length,
            inStock: data.filter((p) => p.stock_qty > 20).length,
            totalValue: data.reduce((sum, p) => sum + p.stock_qty * p.unit_price, 0),
        };
    }, [spareParts.data]);

    // Client-side filtering
    const filteredParts = useMemo(() => {
        let result = spareParts.data;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter((part) => part.name.toLowerCase().includes(query));
        }
        
        if (stockFilter !== 'all') {
            result = result.filter((part) => {
                const level = getStockLevel(part.stock_qty);
                return level === stockFilter;
            });
        }
        
        return result;
    }, [spareParts.data, searchQuery, stockFilter]);

    const handleDelete = (part: SparePart) => {
        setPartToDelete(part);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!partToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/spare-parts/${partToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setPartToDelete(null);
                setIsDeleting(false);
                toast.success('Spare part deleted successfully');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete spare part');
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(`/spare-parts?page=${page}`, {}, { preserveState: true });
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setStockFilter('all');
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const getStockColor = (qty: number) => {
        if (qty <= 5) return 'bg-red-500';
        if (qty <= 20) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getStockPercent = (qty: number) => {
        return Math.min((qty / 100) * 100, 100);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Spare Parts Inventory" />

            <div className="p-6 space-y-6">
                <PageHeader
                    title="Spare Parts Inventory"
                    description="Manage your spare parts and track stock levels"
                    createRoute="/spare-parts/create"
                    createLabel="Add Part"
                />

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatsCard
                        title="Total Parts"
                        value={stats.total}
                        description={`Value: ${formatCurrency(stats.totalValue)}`}
                        icon={Package}
                    />
                    <StatsCard
                        title="Low Stock"
                        value={stats.lowStock}
                        icon={XCircle}
                        className="border-l-4 border-l-red-500"
                    />
                    <StatsCard
                        title="Medium Stock"
                        value={stats.mediumStock}
                        icon={AlertTriangle}
                        className="border-l-4 border-l-yellow-500"
                    />
                    <StatsCard
                        title="In Stock"
                        value={stats.inStock}
                        icon={CheckCircle}
                        className="border-l-4 border-l-green-500"
                    />
                </div>

                <SearchFilter
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search by part name..."
                    filters={[
                        {
                            name: 'Stock Level',
                            value: stockFilter,
                            onChange: setStockFilter,
                            options: [
                                { value: 'low', label: 'Low Stock' },
                                { value: 'medium', label: 'Medium Stock' },
                                { value: 'high', label: 'In Stock' },
                            ],
                            placeholder: 'Filter by stock',
                        },
                    ]}
                    onClearFilters={handleClearFilters}
                    showClearButton
                />

                {filteredParts.length > 0 ? (
                    <>
                        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Part Name</TableHead>
                                        <TableHead className="font-semibold">Stock Qty</TableHead>
                                        <TableHead className="font-semibold">Stock Level</TableHead>
                                        <TableHead className="font-semibold">Unit Price</TableHead>
                                        <TableHead className="font-semibold">Total Value</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredParts.map((part) => (
                                        <TableRow
                                            key={part.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Package className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{part.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <span className={`font-semibold ${part.stock_qty <= 5 ? 'text-red-600' : ''}`}>
                                                    {part.stock_qty}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-3 min-w-[150px]">
                                                    <Progress
                                                        value={getStockPercent(part.stock_qty)}
                                                        className="h-2 flex-1"
                                                    />
                                                    <StatusBadge status={getStockLevel(part.stock_qty)} />
                                                </div>
                                            </TableCell>
                                            <TableCell>{formatCurrency(part.unit_price)}</TableCell>
                                            <TableCell className="font-medium">
                                                {formatCurrency(part.stock_qty * part.unit_price)}
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
                                                            <Link href={`/spare-parts/${part.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(part)}
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
                            currentPage={spareParts.current_page}
                            totalPages={spareParts.last_page}
                            totalItems={spareParts.total}
                            itemsPerPage={spareParts.per_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={Package}
                        title="No spare parts found"
                        description="Add spare parts to your inventory to get started."
                        createRoute="/spare-parts/create"
                        createLabel="Add Part"
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Spare Part"
                description={`Are you sure you want to delete "${partToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                variant="destructive"
                loading={isDeleting}
            />
        </AppLayout>
    );
}
