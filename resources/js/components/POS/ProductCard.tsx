import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Eye, Package, AlertTriangle } from 'lucide-react';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    category?: string;
    sku?: string;
}

interface ProductCardProps {
    product: Product;
    onQuickView: (product: Product) => void;
    viewMode?: 'grid' | 'list';
}

export function ProductCard({ product, onQuickView, viewMode = 'grid' }: ProductCardProps) {
    const isOutOfStock = product.stock <= 0;
    const isLowStock = product.stock > 0 && product.stock <= 5;

    if (viewMode === 'list') {
        return (
            <Card
                className={`overflow-hidden transition-all hover:shadow-md cursor-pointer ${isOutOfStock ? 'opacity-60' : ''}`}
                onClick={() => onQuickView(product)}
            >
                <CardContent className="p-0">
                    <div className="flex items-center gap-4">
                        {/* Image */}
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-100 flex items-center justify-center overflow-hidden">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Package className="w-8 h-8 text-gray-400" />
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 py-3">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        {product.category && (
                                            <Badge variant="secondary" className="text-xs">
                                                {product.category}
                                            </Badge>
                                        )}
                                        {product.sku && (
                                            <span className="text-xs text-gray-400">SKU: {product.sku}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-lg font-bold text-blue-600">
                                        ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </p>
                                    <div className="flex items-center gap-1 justify-end mt-1">
                                        {isOutOfStock ? (
                                            <Badge variant="destructive" className="text-xs">Out of Stock</Badge>
                                        ) : isLowStock ? (
                                            <Badge variant="outline" className="text-xs text-amber-600 border-amber-300 bg-amber-50">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {product.stock} left
                                            </Badge>
                                        ) : (
                                            <span className="text-xs text-gray-500">{product.stock} in stock</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="pr-4">
                            <Button
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onQuickView(product);
                                }}
                                disabled={isOutOfStock}
                                className="gap-2"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            className={`overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer group ${isOutOfStock ? 'opacity-60' : ''}`}
            onClick={() => onQuickView(product)}
        >
            <CardContent className="p-0">
                {/* Image Section */}
                <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center overflow-hidden">
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400">
                            <Package className="w-12 h-12 mb-2" />
                            <span className="text-xs">No Image</span>
                        </div>
                    )}

                    {/* Stock Badge */}
                    {isOutOfStock ? (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="destructive" className="text-sm font-semibold">
                                Out of Stock
                            </Badge>
                        </div>
                    ) : isLowStock ? (
                        <Badge
                            variant="outline"
                            className="absolute top-2 right-2 text-xs bg-amber-50 text-amber-700 border-amber-200"
                        >
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            {product.stock} left
                        </Badge>
                    ) : null}

                    {/* Category Badge */}
                    {product.category && (
                        <Badge
                            variant="secondary"
                            className="absolute top-2 left-2 text-xs bg-white/90 backdrop-blur-sm"
                        >
                            {product.category}
                        </Badge>
                    )}

                    {/* Quick View Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button
                            size="sm"
                            variant="secondary"
                            className="gap-2 shadow-lg"
                            onClick={(e) => {
                                e.stopPropagation();
                                onQuickView(product);
                            }}
                        >
                            <Eye className="w-4 h-4" />
                            Quick View
                        </Button>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-4 border-t bg-white">
                    <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[2.5rem] text-sm">
                        {product.name}
                    </h3>

                    {product.sku && (
                        <p className="text-xs text-gray-400 mt-1">SKU: {product.sku}</p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                        <div>
                            <p className="text-xl font-bold text-blue-600">
                                ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </p>
                            {!isOutOfStock && !isLowStock && (
                                <p className="text-xs text-gray-500">{product.stock} in stock</p>
                            )}
                        </div>
                        <Button
                            size="icon"
                            onClick={(e) => {
                                e.stopPropagation();
                                onQuickView(product);
                            }}
                            disabled={isOutOfStock}
                            className="h-10 w-10 rounded-full shadow-md"
                        >
                            <ShoppingCart className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
