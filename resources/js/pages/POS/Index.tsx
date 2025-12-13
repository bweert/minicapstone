import AppLayout from '@/layouts/app-layout';
import { useState, useMemo } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { useCart } from '@/hooks/useCart';
import { ProductGrid } from '@/components/POS/ProductGrid';
import { ProductQuickView } from '@/components/POS/ProductQuickView';
import { CartSidebar } from '@/components/POS/CartSidebar';
import { MobileCartDrawer } from '@/components/POS/MobileCartDrawer';
import { CheckoutModal, CheckoutData } from '@/components/POS/CheckoutModal';
import { ReceiptPreview } from '@/components/POS/ReceiptPreview';
import { CustomerFormModal } from '@/components/Repairs/CustomerFormModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
    ShoppingBag,
    Package,
    TrendingUp,
    Receipt,
    Star,
    Search,
    Filter,
    Plus,
    Wrench,
    Grid3X3,
    List
} from 'lucide-react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    description?: string;
    category?: string;
    sku?: string;
}

interface Category {
    id: number;
    name: string;
}

interface POSStats {
    totalProducts: number;
    activeCategories: number;
    todaysSales: number;
    todaysTransactions: number;
    avgTransaction: number;
    bestSeller: string;
}

interface PageProps {
    products: Product[];
    categories: Category[];
    csrf_token: string;
    stats: POSStats;
}

export default function POSIndex() {
    const { props } = usePage();
    const { products, categories, csrf_token: csrfToken, stats } = props as unknown as PageProps;

    const { items, addToCart, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [quickViewOpen, setQuickViewOpen] = useState(false);
    const [checkoutOpen, setCheckoutOpen] = useState(false);
    const [receiptOpen, setReceiptOpen] = useState(false);
    const [customerModalOpen, setCustomerModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [transactionData, setTransactionData] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    // Filter products by search and category
    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            // Filter by category
            if (selectedCategory !== 'all' && product.category !== selectedCategory) {
                return false;
            }

            // Filter by search query (name or SKU)
            if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase();
                return (
                    product.name.toLowerCase().includes(query) ||
                    (product.sku && product.sku.toLowerCase().includes(query))
                );
            }

            return true;
        });
    }, [products, searchQuery, selectedCategory]);

    // Calculations
    const subtotal = getSubtotal();
    const tax = subtotal * 0.12; // 12% tax
    const discount = 0; // Can be dynamic
    const total = subtotal + tax - discount;

    // Handle customer creation success
    const handleCustomerCreated = (customerId: number) => {
        window.location.href = `/services?customer_id=${customerId}`;
    };

    // Handle product quick view
    const handleQuickView = (product: Product) => {
        setSelectedProduct(product);
        setQuickViewOpen(true);
    };

    // Handle add to cart
    const handleAddToCart = (product: Product, quantity: number) => {
        addToCart(product, quantity);
        toast.success(`${product.name} added to cart!`);
    };

    // Handle checkout
    const handleCheckout = () => {
        if (items.length === 0) {
            toast.error('Cart is empty');
            return;
        }
        setCheckoutOpen(true);
    };

    // Handle payment confirmation
    const handleConfirmPayment = async (data: CheckoutData) => {
        setIsLoading(true);

        try {
            const payloadData = {
                items: items.map((item) => ({
                    id: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                subtotal,
                tax,
                discount,
                total,
                payment_method: data.paymentMethod,
                ...(data.paymentMethod === 'cash' && {
                    amount_received: data.amountReceived,
                }),
                ...(data.paymentMethod === 'gcash' && {
                    gcash_reference: data.gcashReference,
                }),
            };

            const response = await fetch('/pos/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify(payloadData),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                console.error('Server returned non-JSON response:', text.substring(0, 500));
                toast.error('Server error: Invalid response format.');
                setIsLoading(false);
                return;
            }

            const result = await response.json();

            if (!response.ok || !result.success) {
                toast.error(result.message || 'Transaction failed');
                setIsLoading(false);
                return;
            }

            // Set receipt data
            setTransactionData({
                reference_number: result.transaction.reference_number,
                items,
                subtotal,
                tax,
                discount,
                total,
                paymentMethod: data.paymentMethod,
                amountReceived: data.amountReceived,
                change: data.paymentMethod === 'cash'
                    ? data.amountReceived! - total
                    : undefined,
                gcashReference: data.gcashReference,
                timestamp: new Date().toLocaleString(),
            });

            clearCart();
            setCheckoutOpen(false);
            setReceiptOpen(true);
            toast.success('Payment successful!');
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('An error occurred during checkout');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseReceipt = () => {
        setReceiptOpen(false);
        setTransactionData(null);
    };

    const statsCards = [
        {
            title: 'Available Products',
            value: stats.totalProducts.toString(),
            icon: Package,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: "Today's Sales",
            value: `₱${stats.todaysSales.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`,
            icon: TrendingUp,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: 'Transactions Today',
            value: stats.todaysTransactions.toString(),
            icon: Receipt,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: 'Best Seller',
            value: stats.bestSeller,
            icon: Star,
            color: 'text-amber-600',
            bgColor: 'bg-amber-50',
            isText: true,
        },
    ];

    return (
        <AppLayout>
            <Head title="Point of Sale" />
            <div className="flex h-[calc(100vh-4rem)]">
                {/* Main Content */}
                <div className="flex-1 overflow-hidden flex flex-col bg-gray-50">
                    {/* Header Section */}
                    <div className="bg-white border-b px-6 py-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                                        <ShoppingBag className="h-6 w-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">Point of Sale</h1>
                                        <p className="text-sm text-gray-500">Process sales and manage transactions</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                
                                {/* Mobile Cart Button */}
                                <div className="lg:hidden">
                                    <MobileCartDrawer
                                        items={items}
                                        subtotal={subtotal}
                                        tax={tax}
                                        total={total}
                                        onUpdateQuantity={updateQuantity}
                                        onRemoveItem={removeItem}
                                        onCheckout={handleCheckout}
                                        isLoading={isLoading}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                            {statsCards.map((stat, index) => (
                                <Card key={index} className="border-0 shadow-sm">
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-gray-500 truncate">{stat.title}</p>
                                                <p className={`font-bold ${stat.isText ? 'text-sm truncate' : 'text-lg'} text-gray-900`}>
                                                    {stat.value}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Search and Filter Bar */}
                    <div className="bg-white border-b px-6 py-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search products by name or SKU..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-gray-50 border-gray-200"
                                />
                            </div>
                            <div className="flex gap-2">
                                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                    <SelectTrigger className="w-[180px] bg-gray-50">
                                        <Filter className="h-4 w-4 mr-2 text-gray-400" />
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.name}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex border rounded-lg overflow-hidden">
                                    <Button
                                        variant={viewMode === 'grid' ? 'default' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('grid')}
                                        className="rounded-none"
                                    >
                                        <Grid3X3 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={viewMode === 'list' ? 'default' : 'ghost'}
                                        size="icon"
                                        onClick={() => setViewMode('list')}
                                        className="rounded-none"
                                    >
                                        <List className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Results count and active filters */}
                        <div className="flex items-center gap-2 mt-3">
                            <Badge variant="secondary" className="font-normal">
                                {filteredProducts.length} products
                            </Badge>
                            {selectedCategory !== 'all' && (
                                <Badge variant="outline" className="gap-1">
                                    {selectedCategory}
                                    <button
                                        onClick={() => setSelectedCategory('all')}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                            {searchQuery && (
                                <Badge variant="outline" className="gap-1">
                                    "{searchQuery}"
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="ml-1 hover:text-red-500"
                                    >
                                        ×
                                    </button>
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {filteredProducts.length > 0 ? (
                            <ProductGrid
                                products={filteredProducts}
                                onQuickView={handleQuickView}
                                viewMode={viewMode}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-center">
                                <div className="p-4 bg-gray-100 rounded-full mb-4">
                                    <Package className="h-12 w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">No products found</h3>
                                <p className="text-gray-500 max-w-sm">
                                    {searchQuery || selectedCategory !== 'all'
                                        ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                        : 'No products are currently available for sale.'}
                                </p>
                                {(searchQuery || selectedCategory !== 'all') && (
                                    <Button
                                        variant="outline"
                                        className="mt-4"
                                        onClick={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('all');
                                        }}
                                    >
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Cart Sidebar */}
                <div className="hidden lg:block">
                    <CartSidebar
                        items={items}
                        subtotal={subtotal}
                        tax={tax}
                        total={total}
                        onUpdateQuantity={updateQuantity}
                        onRemoveItem={removeItem}
                        onCheckout={handleCheckout}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Quick View Dialog */}
            <ProductQuickView
                product={selectedProduct}
                open={quickViewOpen}
                onOpenChange={setQuickViewOpen}
                onAddToCart={handleAddToCart}
            />

            {/* Checkout Modal */}
            <CheckoutModal
                open={checkoutOpen}
                subtotal={subtotal}
                tax={tax}
                discount={discount}
                total={total}
                onClose={() => !isLoading && setCheckoutOpen(false)}
                onConfirm={handleConfirmPayment}
                isLoading={isLoading}
            />

            {/* Receipt Preview */}
            <ReceiptPreview
                open={receiptOpen}
                onClose={handleCloseReceipt}
                transactionData={transactionData}
            />

            {/* Customer Form Modal */}
            <CustomerFormModal
                open={customerModalOpen}
                onOpenChange={setCustomerModalOpen}
                onSuccess={handleCustomerCreated}
                csrf_token={csrfToken}
            />
        </AppLayout>
    );
}
