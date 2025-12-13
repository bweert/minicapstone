import { CartItem } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Trash2,
    Minus,
    Plus,
    ShoppingCart,
    CreditCard,
    Receipt,
    Package
} from 'lucide-react';

interface CartSidebarProps {
    items: CartItem[];
    subtotal: number;
    tax: number;
    total: number;
    onUpdateQuantity: (id: number, quantity: number) => void;
    onRemoveItem: (id: number) => void;
    onCheckout: () => void;
    isLoading?: boolean;
}

export function CartSidebar({
    items,
    subtotal,
    tax,
    total,
    onUpdateQuantity,
    onRemoveItem,
    onCheckout,
    isLoading = false,
}: CartSidebarProps) {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col h-full">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-lg">
                            <ShoppingCart className="h-5 w-5" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold">Shopping Cart</h2>
                            <p className="text-sm text-blue-100">{itemCount} item{itemCount !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                    {items.length > 0 && (
                        <Badge className="bg-white/20 hover:bg-white/30 text-white">
                            {items.length} unique
                        </Badge>
                    )}
                </div>
            </div>

            {/* Items */}
            <ScrollArea className="flex-1">
                <div className="p-4 space-y-3">
                    {items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                            <div className="p-4 bg-gray-100 rounded-full mb-4">
                                <Package className="w-10 h-10" />
                            </div>
                            <p className="font-medium text-gray-600">Cart is empty</p>
                            <p className="text-sm text-gray-400 mt-1">Add products to get started</p>
                        </div>
                    ) : (
                        items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gray-50 rounded-xl p-3 border border-gray-100 hover:border-gray-200 transition-colors"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-semibold text-sm text-gray-900 truncate">
                                            {item.name}
                                        </h4>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })} × {item.quantity}
                                        </p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onRemoveItem(item.id)}
                                        className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8 p-0"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center bg-white rounded-lg border shadow-sm">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-l-lg rounded-r-none"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="w-10 text-center text-sm font-semibold text-gray-900">
                                            {item.quantity}
                                        </span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-r-lg rounded-l-none"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <span className="font-bold text-gray-900">
                                        ₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </ScrollArea>

            {/* Footer */}
            {items.length > 0 && (
                <div className="border-t bg-gray-50 p-4 space-y-4">
                    {/* Summary */}
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span className="font-medium">₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Tax (12%)</span>
                            <span className="font-medium">₱{tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                        </div>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-gray-900">Total</span>
                        <span className="text-2xl font-bold text-blue-600">
                            ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                        </span>
                    </div>

                    {/* Checkout Button */}
                    <Button
                        onClick={onCheckout}
                        disabled={items.length === 0 || isLoading}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                Processing...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Proceed to Checkout
                            </span>
                        )}
                    </Button>

                    <p className="text-xs text-center text-gray-500">
                        Secure checkout • Cash or GCash accepted
                    </p>
                </div>
            )}
        </div>
    );
}
