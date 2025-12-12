import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';
import { DataTable } from '@/components/DataTable';
import { ProductFormModal, type Product, type Category } from './ProductFormModal';
import { getColumns } from './columns';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { Search, X, ChevronLeft, ChevronRight } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Products',
        href: '/products',
    },
];

interface Props {
    products: Product[];
    categories: Category[];
}

const ITEMS_PER_PAGE = 10; // Change this to adjust items per page

export default function Index({ products: initialProducts, categories }: Props) {
    const { props } = usePage();
    const flash = props.flash as any;
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
    const [products, setProducts] = useState(initialProducts);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash]);

    // Filter products based on search and category
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === null || product.category_id === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const handleEdit = (product: Product) => {
        console.log('Editing product:', product);
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const handleCreate = () => {
        console.log('Creating new product');
        setSelectedProduct(undefined);
        setModalOpen(true);
    };

    const handleModalClose = (open: boolean) => {
        setModalOpen(open);
        if (!open) {
            setSelectedProduct(undefined);
        }
    };

    const handleClearFilters = () => {
        setSearchQuery('');
        setSelectedCategory(null);
        setCurrentPage(1); // Reset to first page
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
    }, [searchQuery, selectedCategory]);

    const columns = getColumns(handleEdit);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button onClick={handleCreate}>+ Add Product</Button>
                </div>

                {/* Search Bar */}
                <div className="flex gap-4">
                    <div className="relative w-96">
                        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                        <Input
                            type="text"
                            placeholder="Search products by name..."
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

                {/* Category Filter */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Filter by Category:</label>
                    <NativeSelect value={selectedCategory?.toString() || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value ? parseInt(e.target.value) : null)}>
                        <NativeSelectOption value="">All Categories</NativeSelectOption>
                        {categories.map((category) => (
                            <NativeSelectOption key={category.id} value={category.id.toString()}>
                                {category.categorie_name}
                            </NativeSelectOption>
                        ))}
                    </NativeSelect>
                </div>

                {/* Active Filters Display */}
                {(searchQuery || selectedCategory !== null) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
                        <div className="text-sm text-blue-800">
                            Showing <span className="font-semibold">{filteredProducts.length}</span> of <span className="font-semibold">{products.length}</span> products
                            {searchQuery && ` matching "${searchQuery}"`}
                            {selectedCategory && categories.find(c => c.id === selectedCategory) && (
                                ` in ${categories.find(c => c.id === selectedCategory)?.categorie_name}`
                            )}
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

                {/* Products Table */}
                {paginatedProducts.length > 0 ? (
                    <>
                        <DataTable columns={columns} data={paginatedProducts} />

                        {/* Pagination Controls */}
                        <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-lg border">
                            <div className="text-sm text-gray-600">
                                Page <span className="font-semibold">{currentPage}</span> of <span className="font-semibold">{totalPages}</span>
                                {' | '}
                                Showing <span className="font-semibold">{startIndex + 1}</span> to <span className="font-semibold">{Math.min(endIndex, filteredProducts.length)}</span> of <span className="font-semibold">{filteredProducts.length}</span> products
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
                            No products found matching your criteria.
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

                {/* Modal */}
                <ProductFormModal
                    open={modalOpen}
                    onOpenChange={handleModalClose}
                    product={selectedProduct}
                    categories={categories}
                />
            </div>
        </AppLayout>
    );
}