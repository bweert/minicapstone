import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RepairService, type PaginatedData } from '@/types/repair';
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
import { PageHeader, SearchFilter, Pagination, ConfirmDialog, EmptyState } from '@/components/repair';
import { Pencil, Trash2, MoreHorizontal, Settings2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Repair Services', href: '/repair-services' },
];

interface Props {
    services: PaginatedData<RepairService>;
}

export default function Index({ services }: Props) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState<RepairService | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Client-side filtering
    const filteredServices = useMemo(() => {
        if (!searchQuery) return services.data;
        const query = searchQuery.toLowerCase();
        return services.data.filter((service) =>
            service.name.toLowerCase().includes(query)
        );
    }, [services.data, searchQuery]);

    const handleDelete = (service: RepairService) => {
        setServiceToDelete(service);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!serviceToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/repair-services/${serviceToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setServiceToDelete(null);
                setIsDeleting(false);
                toast.success('Service deleted successfully');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete service');
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(`/repair-services?page=${page}`, {}, { preserveState: true });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Repair Services" />

            <div className="p-6 space-y-6">
                <PageHeader
                    title="Repair Services"
                    description="Manage the services you offer for repairs"
                    createRoute="/repair-services/create"
                    createLabel="Add Service"
                />

                <SearchFilter
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search services..."
                />

                {filteredServices.length > 0 ? (
                    <>
                        <div className="rounded-lg border bg-card shadow-sm overflow-hidden">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Service Name</TableHead>
                                        <TableHead className="font-semibold">Base Price</TableHead>
                                        <TableHead className="font-semibold">Created</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredServices.map((service) => (
                                        <TableRow
                                            key={service.id}
                                            className="hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                        <Settings2 className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <span className="font-medium">{service.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-semibold text-primary">
                                                {formatCurrency(service.base_price)}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(service.created_at).toLocaleDateString()}
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
                                                            <Link href={`/repair-services/${service.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(service)}
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
                            currentPage={services.current_page}
                            totalPages={services.last_page}
                            totalItems={services.total}
                            itemsPerPage={services.per_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={Settings2}
                        title="No services found"
                        description="Add repair services that you offer to customers."
                        createRoute="/repair-services/create"
                        createLabel="Add Service"
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Service"
                description={`Are you sure you want to delete "${serviceToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                variant="destructive"
                loading={isDeleting}
            />
        </AppLayout>
    );
}
