import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Customer, type PaginatedData } from '@/types/repair';
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
import { Eye, Pencil, Trash2, MoreHorizontal, Users, Phone, Mail } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Customers', href: '/customers' },
];

interface Props {
    customers: PaginatedData<Customer>;
}

export default function Index({ customers }: Props) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
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
    const filteredCustomers = useMemo(() => {
        if (!searchQuery) return customers.data;
        const query = searchQuery.toLowerCase();
        return customers.data.filter(
            (customer) =>
                customer.name.toLowerCase().includes(query) ||
                customer.email?.toLowerCase().includes(query) ||
                customer.phone?.toLowerCase().includes(query)
        );
    }, [customers.data, searchQuery]);

    const handleDelete = (customer: Customer) => {
        setCustomerToDelete(customer);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!customerToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/customers/${customerToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setCustomerToDelete(null);
                setIsDeleting(false);
                toast.success('Customer deleted successfully');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete customer');
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(`/customers?page=${page}`, {}, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Customers" />

            <div className="p-6 space-y-6">
                <PageHeader
                    title="Customers"
                    description="Manage your customer database"
                    createRoute="/customers/create"
                    createLabel="Add Customer"
                />

                <SearchFilter
                    searchValue={searchQuery}
                    onSearchChange={setSearchQuery}
                    searchPlaceholder="Search customers by name, email, or phone..."
                />

                {filteredCustomers.length > 0 ? (
                    <>
                        <div className="rounded-lg border bg-card shadow-sm">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Name</TableHead>
                                        <TableHead className="font-semibold">Phone</TableHead>
                                        <TableHead className="font-semibold">Email</TableHead>
                                        <TableHead className="font-semibold">Created</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredCustomers.map((customer) => (
                                        <TableRow
                                            key={customer.id}
                                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                                        >
                                            <TableCell className="font-medium">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                                        <span className="text-sm font-semibold text-primary">
                                                            {customer.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    {customer.name}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {customer.phone ? (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Phone className="h-4 w-4" />
                                                        {customer.phone}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {customer.email ? (
                                                    <div className="flex items-center gap-2 text-muted-foreground">
                                                        <Mail className="h-4 w-4" />
                                                        {customer.email}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-muted-foreground">
                                                {new Date(customer.created_at).toLocaleDateString()}
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
                                                            <Link href={`/customers/${customer.id}`}>
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={`/customers/${customer.id}/edit`}>
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleDelete(customer)}
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
                            currentPage={customers.current_page}
                            totalPages={customers.last_page}
                            totalItems={customers.total}
                            itemsPerPage={customers.per_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={Users}
                        title="No customers found"
                        description="Get started by adding your first customer to the system."
                        createRoute="/customers/create"
                        createLabel="Add Customer"
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Customer"
                description={`Are you sure you want to delete "${customerToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                variant="destructive"
                loading={isDeleting}
            />
        </AppLayout>
    );
}
