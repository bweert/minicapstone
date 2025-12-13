import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Product, type Category, type PaginatedData, type ProductStats } from '@/types/pos';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { PageHeader, SearchFilter, Pagination, ConfirmDialog, EmptyState, StatsCard } from '@/components/repair';
import { 
    Eye, Pencil, Trash2, MoreHorizontal, Package, DollarSign, 
    AlertTriangle, XCircle, ImageIcon 
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/products' },
];

interface Props {
    products: PaginatedData<Product>;
    categories: Category[];
    stats: ProductStats;
}

export default function Index({ products, categories, stats }: Props) {
    const { props } = usePage();
    const flash = props.flash as { success?: string; error?: string } | undefined;
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<Product | null>(null);
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
    const filteredProducts = useMemo(() => {
        let result = products.data;
        
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(
                (product) => 
                    product.name.toLowerCase().includes(query) ||
                    product.SKU.toLowerCase().includes(query)
            );
        }
        
        if (selectedCategory !== 'all') {
            result = result.filter(
                (product) => product.category_id === parseInt(selectedCategory)
            );
        }
        
        return result;
    }, [products.data, searchQuery, selectedCategory]);

    const handleDelete = (product: Product) => {
        setProductToDelete(product);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (!productToDelete) return;
        
        setIsDeleting(true);
        router.delete(`/products/${productToDelete.id}`, {
            onSuccess: () => {
                setDeleteDialogOpen(false);
                setProductToDelete(null);
                setIsDeleting(false);
                toast.success('Product deleted successfully');
            },
            onError: () => {
                setIsDeleting(false);
                toast.error('Failed to delete product');
            },
        });
    };

    const handlePageChange = (page: number) => {
        router.get(`/products?page=${page}`, {}, { preserveState: true });
    };

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', progress: 0 };
        if (quantity <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', progress: 25 };
        if (quantity <= 50) return { label: 'In Stock', color: 'bg-blue-100 text-blue-700', progress: 60 };
        return { label: 'Well Stocked', color: 'bg-green-100 text-green-700', progress: 100 };
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const filterOptions = [
        { value: 'all', label: 'All Categories' },
        ...categories.map((category) => ({
            value: category.id.toString(),
            label: category.categorie_name,
        })),
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="p-6 space-y-6">
                <PageHeader
                    title="Products"
                    description="Manage your product inventory"
                    createRoute="/products/create"
                    createLabel="Add Product"
                />

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <StatsCard
                        title="Total Products"
                        value={stats.total}
                        icon={Package}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-100"
                    />
                    <StatsCard
                        title="Inventory Value"
                        value={formatCurrency(stats.total_value)}
                        icon={DollarSign}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-100"
                    />
                    <StatsCard
                        title="Low Stock Items"
                        value={stats.low_stock}
                        icon={AlertTriangle}
                        iconColor="text-yellow-600"
                        iconBgColor="bg-yellow-100"
                    />
                    <StatsCard
                        title="Out of Stock"
                        value={stats.out_of_stock}
                        icon={XCircle}
                        iconColor="text-red-600"
                        iconBgColor="bg-red-100"
                    />
                </div>

                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchFilter
                            searchValue={searchQuery}
                            onSearchChange={setSearchQuery}
                            searchPlaceholder="Search products by name or SKU..."
                        />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="w-full sm:w-[200px]">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            {filterOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {filteredProducts.length > 0 ? (
                    <>
                        <div className="rounded-lg border bg-card shadow-sm overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Product</TableHead>
                                        <TableHead className="font-semibold">SKU</TableHead>
                                        <TableHead className="font-semibold">Category</TableHead>
                                        <TableHead className="font-semibold text-right">Price</TableHead>
                                        <TableHead className="font-semibold text-right">Cost</TableHead>
                                        <TableHead className="font-semibold">Stock</TableHead>
                                        <TableHead className="w-[70px]"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProducts.map((product) => {
                                        const stockStatus = getStockStatus(product.stock_quantity);
                                        return (
                                            <TableRow
                                                key={product.id}
                                                className="cursor-pointer hover:bg-muted/50 transition-colors"
                                            >
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-3">
                                                        {product.image ? (
                                                            <img
                                                                src={`/storage/${product.image}`}
                                                                alt={product.name}
                                                                className="h-10 w-10 rounded-lg object-cover border"
                                                            />
                                                        ) : (
                                                            <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                                <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <span className="text-base">{product.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-sm bg-muted px-2 py-1 rounded">
                                                        {product.SKU}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary">
                                                        {product.category?.categorie_name || '—'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-green-600">
                                                    {formatCurrency(product.price)}
                                                </TableCell>
                                                <TableCell className="text-right text-muted-foreground">
                                                    {formatCurrency(product.cost)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1 min-w-[120px]">
                                                        <div className="flex justify-between items-center">
                                                            <span className={`text-xs px-2 py-0.5 rounded-full ${stockStatus.color}`}>
                                                                {stockStatus.label}
                                                            </span>
                                                            <span className="text-sm font-medium">{product.stock_quantity}</span>
                                                        </div>
                                                        <Progress value={stockStatus.progress} className="h-1.5" />
                                                    </div>
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
                                                                <Link href={`/products/${product.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/products/${product.id}/edit`}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(product)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>

                        <Pagination
                            currentPage={products.current_page}
                            totalPages={products.last_page}
                            totalItems={products.total}
                            itemsPerPage={products.per_page}
                            onPageChange={handlePageChange}
                        />
                    </>
                ) : (
                    <EmptyState
                        icon={Package}
                        title="No products found"
                        description="Get started by adding your first product to the inventory."
                        createRoute="/products/create"
                        createLabel="Add Product"
                    />
                )}
            </div>

            <ConfirmDialog
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                title="Delete Product"
                description={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={confirmDelete}
                variant="destructive"
                loading={isDeleting}
            />
        </AppLayout>
    );
}
