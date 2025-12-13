import { ProductCard } from './ProductCard';

interface Product {
    id: number;
    name: string;
    price: number;
    stock: number;
    image?: string;
    category?: string;
    sku?: string;
}

interface ProductGridProps {
    products: Product[];
    onQuickView: (product: Product) => void;
    viewMode?: 'grid' | 'list';
}

export function ProductGrid({ products, onQuickView, viewMode = 'grid' }: ProductGridProps) {
    if (viewMode === 'list') {
        return (
            <div className="space-y-3">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onQuickView={onQuickView}
                        viewMode="list"
                    />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    viewMode="grid"
                />
            ))}
        </div>
    );
}
