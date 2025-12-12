import AppLayout from '@/layouts/app-layout';
import { useState, useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { useCart } from '@/hooks/useCart';
import { ProductGrid } from '@/components/POS/ProductGrid';
import { ProductSearch } from '@/components/POS/ProductSearch';
import { ProductQuickView } from '@/components/POS/ProductQuickView';
import { CartSidebar } from '@/components/POS/CartSidebar';
import { MobileCartDrawer } from '@/components/POS/MobileCartDrawer';
import { CheckoutModal, CheckoutData } from '@/components/POS/CheckoutModal';
import { ReceiptPreview } from '@/components/POS/ReceiptPreview';
import { toast } from 'sonner';
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/components/ui/native-select"
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

interface PageProps {
  products: Product[];
}

export default function POSIndex() {
  const { props } = usePage();
  const products = (props as any).products as Product[];
  const csrfToken = (props as any).csrf_token || '';

  const { items, addToCart, removeItem, updateQuantity, getSubtotal, clearCart } = useCart();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionData, setTransactionData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return Array.from(cats).sort();
  }, [products]);

  // Filter products by search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Filter by category
      if (selectedCategory && product.category !== selectedCategory) {
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
  const tax = subtotal * 0.0; // 12% tax
  const discount = 0; // Can be dynamic
  const total = subtotal + tax - discount;

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

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Server returned non-JSON response:', text.substring(0, 500));
        toast.error('Server error: Invalid response format. Check browser console for details.');
        setIsLoading(false);
        return;
      }

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || 'Checkout failed');
        setIsLoading(false);
        return;
      }

      if (!result.success) {
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

      // Clear cart and show receipt
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

  // Close receipt and reset data
  const handleCloseReceipt = () => {
    setReceiptOpen(false);
    setTransactionData(null);
  };

  return (
    <AppLayout>
      <div className="flex h-screen bg-gray-100">
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>
                <p className="text-gray-600 mt-1">Browse and select products</p>
              </div>
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

            {/* Search Bar */}
            <ProductSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Filter by Category:</label>
              <NativeSelect value={selectedCategory || ''} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value || null)}>
                <NativeSelectOption value="">All Categories</NativeSelectOption>
                {categories.map((category) => (
                  <NativeSelectOption key={category} value={category}>
                    {category}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} onQuickView={handleQuickView} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found matching your search</p>
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
    </AppLayout>
  );
}
