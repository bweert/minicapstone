import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  category?: string;
}

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export function ProductCard({ product, onQuickView }: ProductCardProps) {
  const isOutOfStock = product.stock <= 0;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all cursor-pointer h-full flex flex-col">
      <CardContent
        className="p-0 flex-1 flex items-center justify-center bg-gray-100 relative group overflow-hidden h-40"
        onClick={() => onQuickView(product)}
      >
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-400">
            <ShoppingCart className="w-12 h-12 mb-2" />
            <span className="text-sm">No Image</span>
          </div>
        )}

        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start gap-3 p-4 border-t">
        <div className="w-full">
          <h3 className="font-semibold text-sm line-clamp-2">{product.name}</h3>
          {product.category && (
            <p className="text-xs text-gray-500 mt-1">{product.category}</p>
          )}
        </div>

        <div className="w-full flex items-center justify-between">
          <div>
            <p className="font-bold text-lg text-blue-600">₱{product.price.toFixed(2)}</p>
            <p className="text-xs text-gray-500">Stock: {product.stock}</p>
          </div>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            disabled={isOutOfStock}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
