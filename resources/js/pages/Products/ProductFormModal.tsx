import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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

export interface Product {
    id?: number;
    name: string;
    category_id: number;
    SKU: string;
    price: number;
    cost: number;
    stock_quantity: number;
    image?: string;
}

export interface Category {
    id: number;
    categorie_name: string;
}

interface ProductFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product;
    categories: Category[];
}

export function ProductFormModal({ open, onOpenChange, product, categories }: ProductFormModalProps) {
    const [preview, setPreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category_id: '',
        SKU: '',
        price: '',
        cost: '',
        stock_quantity: '',
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // Initialize form when product changes or modal opens
    useEffect(() => {
        if (open && product) {
            console.log('Modal opened with product:', product);
            setFormData({
                name: product.name || '',
                category_id: product.category_id?.toString() || '',
                SKU: product.SKU || '',
                price: product.price?.toString() || '',
                cost: product.cost?.toString() || '',
                stock_quantity: product.stock_quantity?.toString() || '',
            });
            setPreview(product.image ? `/storage/${product.image}` : null);
            setImageFile(null);
        } else if (open && !product) {
            console.log('Modal opened for creating new product');
            setFormData({
                name: '',
                category_id: '',
                SKU: '',
                price: '',
                cost: '',
                stock_quantity: '',
            });
            setPreview(null);
            setImageFile(null);
        }
        setErrors({});
    }, [open, product]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setErrors({});

        const data = new FormData();
        data.append('name', formData.name);
        data.append('category_id', formData.category_id);
        data.append('SKU', formData.SKU);
        data.append('price', formData.price);
        data.append('cost', formData.cost);
        data.append('stock_quantity', formData.stock_quantity);
        
        if (imageFile) {
            data.append('image', imageFile);
        }

        if (product?.id) {
            // UPDATE - Use PUT method with _method override
            console.log('Submitting UPDATE for product:', product.id);
            data.append('_method', 'PUT');
            
            router.post(`/products/${product.id}`, data, {
                onSuccess: () => {
                    console.log('Product updated successfully');
                    toast.success('Product updated successfully!');
                    setIsProcessing(false);
                    onOpenChange(false);
                    // Reload page to show updated data
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                },
                onError: (errors: any) => {
                    console.error('Update error:', errors);
                    setErrors(errors);
                    toast.error('Failed to update product');
                    setIsProcessing(false);
                },
            });
        } else {
            // CREATE - Use POST method
            console.log('Submitting CREATE for new product');
            
            router.post('/products', data, {
                onSuccess: () => {
                    console.log('Product created successfully');
                    toast.success('Product created successfully!');
                    setIsProcessing(false);
                    onOpenChange(false);
                    // Reload page to show new data
                    setTimeout(() => {
                        window.location.reload();
                    }, 500);
                },
                onError: (errors: any) => {
                    console.error('Create error:', errors);
                    setErrors(errors);
                    toast.error('Failed to create product');
                    setIsProcessing(false);
                },
            });
        }
    };

    const handleDialogClose = (open: boolean) => {
        if (!open) {
            setFormData({
                name: '',
                category_id: '',
                SKU: '',
                price: '',
                cost: '',
                stock_quantity: '',
            });
            setImageFile(null);
            setPreview(null);
            setErrors({});
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleDialogClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {product ? 'Edit Product' : 'Create New Product'}
                    </DialogTitle>
                    <DialogDescription>
                        {product
                            ? 'Update the product details below.'
                            : 'Fill in the form to create a new product.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name">Product Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder="Enter product name"
                                className={errors.name ? 'border-red-500' : ''}
                                autoFocus
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="category">Category *</Label>
                            <Select
                                value={formData.category_id}
                                onValueChange={(value) => handleInputChange('category_id', value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {categories.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id.toString()}>
                                            {cat.categorie_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category_id && (
                                <p className="text-red-500 text-sm mt-1">{errors.category_id}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="SKU">SKU *</Label>
                            <Input
                                id="SKU"
                                value={formData.SKU}
                                onChange={(e) => handleInputChange('SKU', e.target.value)}
                                placeholder="Enter SKU"
                                className={errors.SKU ? 'border-red-500' : ''}
                            />
                            {errors.SKU && (
                                <p className="text-red-500 text-sm mt-1">{errors.SKU}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="stock">Stock Quantity *</Label>
                            <Input
                                id="stock"
                                type="number"
                                value={formData.stock_quantity}
                                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                                placeholder="0"
                                className={errors.stock_quantity ? 'border-red-500' : ''}
                            />
                            {errors.stock_quantity && (
                                <p className="text-red-500 text-sm mt-1">{errors.stock_quantity}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="price">Price (₱) *</Label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleInputChange('price', e.target.value)}
                                placeholder="0.00"
                                className={errors.price ? 'border-red-500' : ''}
                            />
                            {errors.price && (
                                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="cost">Cost (₱) *</Label>
                            <Input
                                id="cost"
                                type="number"
                                step="0.01"
                                value={formData.cost}
                                onChange={(e) => handleInputChange('cost', e.target.value)}
                                placeholder="0.00"
                                className={errors.cost ? 'border-red-500' : ''}
                            />
                            {errors.cost && (
                                <p className="text-red-500 text-sm mt-1">{errors.cost}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <Label htmlFor="image">Product Image</Label>
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={errors.image ? 'border-red-500' : ''}
                        />
                        {errors.image && (
                            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                        )}
                        {preview && (
                            <div className="mt-3">
                                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-24 w-24 object-cover rounded border"
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 pt-4 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleDialogClose(false)}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isProcessing}>
                            {isProcessing ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}