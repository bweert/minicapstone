import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Category, type Product } from '@/types/pos';
import { Head, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Loader2, ImageIcon, Upload, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Props {
    product: Product;
    categories: Category[];
}

export default function Edit({ product, categories }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Products', href: '/products' },
        { title: product.name, href: `/products/${product.id}` },
        { title: 'Edit', href: `/products/${product.id}/edit` },
    ];

    const [imagePreview, setImagePreview] = useState<string | null>(
        product.image ? `/storage/${product.image}` : null
    );
    
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: product.name,
        category_id: product.category_id.toString(),
        SKU: product.SKU,
        price: product.price.toString(),
        cost: product.cost.toString(),
        stock_quantity: product.stock_quantity.toString(),
        image: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/products/${product.id}`, {
            forceFormData: true,
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${product.name}`} />

            <div className="p-6 max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/products">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Edit Product</h1>
                        <p className="text-muted-foreground">Update product details and inventory</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Product Information</CardTitle>
                            <CardDescription>Update the basic details for this product</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Product Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Enter product name"
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-500">{errors.name}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="SKU">SKU</Label>
                                    <Input
                                        id="SKU"
                                        value={data.SKU}
                                        onChange={(e) => setData('SKU', e.target.value)}
                                        placeholder="Enter SKU"
                                        className={errors.SKU ? 'border-red-500' : ''}
                                    />
                                    {errors.SKU && (
                                        <p className="text-sm text-red-500">{errors.SKU}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category_id">Category</Label>
                                <Select
                                    value={data.category_id}
                                    onValueChange={(value) => setData('category_id', value)}
                                >
                                    <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.categorie_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.category_id && (
                                    <p className="text-sm text-red-500">{errors.category_id}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Pricing & Inventory</CardTitle>
                            <CardDescription>Update the product pricing and stock levels</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Selling Price (₱)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        placeholder="0.00"
                                        className={errors.price ? 'border-red-500' : ''}
                                    />
                                    {errors.price && (
                                        <p className="text-sm text-red-500">{errors.price}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cost">Cost Price (₱)</Label>
                                    <Input
                                        id="cost"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.cost}
                                        onChange={(e) => setData('cost', e.target.value)}
                                        placeholder="0.00"
                                        className={errors.cost ? 'border-red-500' : ''}
                                    />
                                    {errors.cost && (
                                        <p className="text-sm text-red-500">{errors.cost}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="0"
                                        value={data.stock_quantity}
                                        onChange={(e) => setData('stock_quantity', e.target.value)}
                                        placeholder="0"
                                        className={errors.stock_quantity ? 'border-red-500' : ''}
                                    />
                                    {errors.stock_quantity && (
                                        <p className="text-sm text-red-500">{errors.stock_quantity}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Product Image</CardTitle>
                            <CardDescription>Update the product image (optional)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start gap-6">
                                <div className="w-32 h-32 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                                    {imagePreview ? (
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <Label htmlFor="image" className="cursor-pointer">
                                        <div className="flex items-center gap-2 text-sm text-primary hover:text-primary/80">
                                            <Upload className="h-4 w-4" />
                                            {imagePreview ? 'Change Image' : 'Choose Image'}
                                        </div>
                                    </Label>
                                    <Input
                                        id="image"
                                        type="file"
                                        accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Supported formats: JPEG, PNG, JPG, GIF, WEBP. Max size: 2MB
                                    </p>
                                    {errors.image && (
                                        <p className="text-sm text-red-500">{errors.image}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" asChild>
                            <Link href="/products">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Update Product
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
