import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  image?: string;
  description?: string;
  category?: string;
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

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    onOpenChange(false);
  };

  const handleQuantityChange = (value: number) => {
    const newQuantity = Math.max(1, Math.min(value, product.stock));
    setQuantity(newQuantity);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Image */}
          <div className="flex items-center justify-center bg-gray-100 rounded-lg min-h-80">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-gray-400">
                <ShoppingCart className="w-16 h-16 mb-2" />
                <span>No Image Available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col justify-between">
            <div>
              {product.category && (
                <p className="text-sm text-gray-500 mb-2">{product.category}</p>
              )}
              <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-gray-600 mb-4">
                {product.description || 'Premium quality product'}
              </p>

              {/* Price */}
              <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-200">
                <p className="text-gray-600 text-sm mb-1">Price</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₱{product.price.toFixed(2)}
                </p>
              </div>

              {/* Stock Info */}
              <div className="mb-4">
                <p
                  className={`text-sm font-semibold ${
                    isOutOfStock ? 'text-red-600' : 'text-green-600'
                  }`}
                >
                  {isOutOfStock ? 'Out of Stock' : `${product.stock} in stock`}
                </p>
              </div>
            </div>

            {/* Quantity & Action */}
            {!isOutOfStock && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity - 1)}
                    >
                      −
                    </Button>
                    <input
                      type="number"
                      min="1"
                      max={product.stock}
                      value={quantity}
                      onChange={(e) =>
                        handleQuantityChange(parseInt(e.target.value) || 1)
                      }
                      className="w-16 text-center border rounded px-2 py-1"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold h-10"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
