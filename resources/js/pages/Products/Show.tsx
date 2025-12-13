import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Product } from '@/types/pos';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Pencil, Package, DollarSign, Barcode, FolderOpen, ImageIcon } from 'lucide-react';

interface Props {
    product: Product;
}

export default function Show({ product }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: product.name, href: `/products/${product.id}` },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const getStockStatus = (quantity: number) => {
        if (quantity === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700', progress: 0 };
        if (quantity <= 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700', progress: 25 };
        if (quantity <= 50) return { label: 'In Stock', color: 'bg-blue-100 text-blue-700', progress: 60 };
        return { label: 'Well Stocked', color: 'bg-green-100 text-green-700', progress: 100 };
    };

    const stockStatus = getStockStatus(product.stock_quantity);
    const profitMargin = product.price - product.cost;
    const profitPercentage = ((profitMargin / product.cost) * 100).toFixed(1);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product.name} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/products">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">{product.name}</h1>
                            <p className="text-muted-foreground">Product Details</p>
                        </div>
                    </div>
                    <Button asChild>
                        <Link href={`/products/${product.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Product
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Product Image & Basic Info */}
                    <Card className="md:col-span-1">
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {/* Product Image */}
                                <div className="aspect-square rounded-lg border overflow-hidden bg-muted/50 flex items-center justify-center">
                                    {product.image ? (
                                        <img
                                            src={`/storage/${product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <ImageIcon className="h-16 w-16" />
                                            <span className="text-sm">No image</span>
                                        </div>
                                    )}
                                </div>

                                {/* Stock Status */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-muted-foreground">Stock Status</span>
                                        <span className={`text-sm px-3 py-1 rounded-full ${stockStatus.color}`}>
                                            {stockStatus.label}
                                        </span>
                                    </div>
                                    <Progress value={stockStatus.progress} className="h-2" />
                                    <p className="text-center text-2xl font-bold">{product.stock_quantity} units</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Product Details */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Barcode className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">SKU</p>
                                        <p className="font-mono font-semibold">{product.SKU}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                        <FolderOpen className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Category</p>
                                        <Badge variant="secondary" className="mt-1">
                                            {product.category?.categorie_name || 'Uncategorized'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Pricing Details</h3>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-green-50 border border-green-200">
                                        <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                            <DollarSign className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-green-600">Selling Price</p>
                                            <p className="text-xl font-bold text-green-700">{formatCurrency(product.price)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
                                        <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                            <Package className="h-5 w-5 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Cost Price</p>
                                            <p className="text-xl font-bold">{formatCurrency(product.cost)}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
                                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                            <span className="text-blue-600 font-bold text-sm">%</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-blue-600">Profit Margin</p>
                                            <p className="text-xl font-bold text-blue-700">
                                                {formatCurrency(profitMargin)}
                                                <span className="text-sm font-normal ml-1">({profitPercentage}%)</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="font-semibold mb-4">Inventory Value</h3>
                                <div className="p-4 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Total Stock Value (at selling price)</p>
                                            <p className="text-3xl font-bold text-primary">
                                                {formatCurrency(product.price * product.stock_quantity)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground">At Cost</p>
                                            <p className="text-xl font-semibold">
                                                {formatCurrency(product.cost * product.stock_quantity)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-6 flex items-center justify-between text-sm text-muted-foreground">
                                <span>Created: {new Date(product.created_at).toLocaleString()}</span>
                                <span>Updated: {new Date(product.updated_at).toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
