import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Package, Minus, Plus, AlertTriangle, Check } from 'lucide-react';

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

interface ProductQuickViewProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAddToCart: (product: Product, quantity: number) => void;
}

export function ProductQuickView({
    product,
    open,
    onOpenChange,
    onAddToCart,
}: ProductQuickViewProps) {
    const [quantity, setQuantity] = useState(1);

    // Reset quantity when product changes
    useEffect(() => {
        setQuantity(1);
    }, [product?.id]);

    if (!product) return null;

    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    const handleAddToCart = () => {
        onAddToCart(product, quantity);
        setQuantity(1);
        onOpenChange(false);
    };

    const handleQuantityChange = (value: number) => {
        const newQuantity = Math.max(1, Math.min(value, product.stock));
        setQuantity(newQuantity);
    };

    const subtotal = product.price * quantity;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl p-0 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* Image */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center min-h-[300px] md:min-h-[400px]">
                        {product.image ? (
                            <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center text-gray-400">
                                <Package className="w-20 h-20 mb-3" />
                                <span className="text-sm">No Image Available</span>
                            </div>
                        )}

                        {/* Status Badge */}
                        {isOutOfStock ? (
                            <Badge variant="destructive" className="absolute top-4 left-4">
                                Out of Stock
                            </Badge>
                        ) : isLowStock ? (
                            <Badge variant="outline" className="absolute top-4 left-4 bg-amber-50 text-amber-700 border-amber-200">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Only {product.stock} left
                            </Badge>
                        ) : null}

                        {/* Category Badge */}
                        {product.category && (
                            <Badge variant="secondary" className="absolute top-4 right-4">
                                {product.category}
                            </Badge>
                        )}
                    </div>

                    {/* Details */}
                    <div className="p-6 flex flex-col">
                        <DialogHeader className="text-left mb-4">
                            <DialogTitle className="text-xl font-bold leading-tight">
                                {product.name}
                            </DialogTitle>
                            {product.sku && (
                                <p className="text-sm text-gray-400 mt-1">SKU: {product.sku}</p>
                            )}
                        </DialogHeader>

                        <p className="text-gray-600 text-sm mb-4 flex-1">
                            {product.description || 'Premium quality product from our trusted suppliers.'}
                        </p>

                        {/* Price Card */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl mb-4 border border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-blue-600 font-medium mb-1">Price per unit</p>
                                    <p className="text-3xl font-bold text-blue-700">
                                        ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                                    isOutOfStock
                                        ? 'bg-red-100 text-red-700'
                                        : isLowStock
                                            ? 'bg-amber-100 text-amber-700'
                                            : 'bg-green-100 text-green-700'
                                }`}>
                                    {isOutOfStock ? (
                                        <>Out of Stock</>
                                    ) : (
                                        <><Check className="w-4 h-4" /> {product.stock} available</>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Quantity & Action */}
                        {!isOutOfStock && (
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-semibold text-gray-700 block mb-2">
                                        Quantity
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange(quantity - 1)}
                                                disabled={quantity <= 1}
                                                className="rounded-none h-10 w-10"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </Button>
                                            <input
                                                type="number"
                                                min="1"
                                                max={product.stock}
                                                value={quantity}
                                                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                                className="w-16 text-center border-x py-2 font-semibold focus:outline-none"
                                            />
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleQuantityChange(quantity + 1)}
                                                disabled={quantity >= product.stock}
                                                className="rounded-none h-10 w-10"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </Button>
                                        </div>
                                        <div className="text-right flex-1">
                                            <p className="text-xs text-gray-500">Subtotal</p>
                                            <p className="text-lg font-bold text-gray-900">
                                                ₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleAddToCart}
                                    size="lg"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold h-12 shadow-lg"
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                            </div>
                        )}

                        {isOutOfStock && (
                            <div className="bg-gray-100 rounded-lg p-4 text-center">
                                <p className="text-gray-600 text-sm">
                                    This product is currently out of stock. Please check back later.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
