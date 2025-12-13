import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type SparePart } from '@/types/repair';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Package, DollarSign, Hash } from 'lucide-react';

interface Props {
    sparePart: SparePart;
}

export default function Edit({ sparePart }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Spare Parts', href: '/spare-parts' },
        { title: sparePart.name, href: `/spare-parts/${sparePart.id}/edit` },
        { title: 'Edit', href: `/spare-parts/${sparePart.id}/edit` },
    ];

    const [formData, setFormData] = useState({
        name: sparePart.name,
        stock_qty: sparePart.stock_qty.toString(),
        unit_price: sparePart.unit_price.toString(),
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        router.put(`/spare-parts/${sparePart.id}`, {
            name: formData.name,
            stock_qty: parseInt(formData.stock_qty) || 0,
            unit_price: parseFloat(formData.unit_price) || 0,
        }, {
            onSuccess: () => {
                toast.success('Spare part updated successfully');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to update spare part');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${sparePart.name}`} />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/spare-parts">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Inventory
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Edit Spare Part
                        </CardTitle>
                        <CardDescription>
                            Update the spare part information.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    Part Name *
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="e.g., iPhone 13 Screen"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="stock_qty" className="flex items-center gap-2">
                                        <Hash className="h-4 w-4 text-muted-foreground" />
                                        Stock Quantity *
                                    </Label>
                                    <Input
                                        id="stock_qty"
                                        type="number"
                                        min="0"
                                        value={formData.stock_qty}
                                        onChange={(e) => handleChange('stock_qty', e.target.value)}
                                        placeholder="0"
                                        className={errors.stock_qty ? 'border-red-500' : ''}
                                    />
                                    {errors.stock_qty && (
                                        <p className="text-sm text-red-500">{errors.stock_qty}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="unit_price" className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        Unit Price (₱) *
                                    </Label>
                                    <Input
                                        id="unit_price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={formData.unit_price}
                                        onChange={(e) => handleChange('unit_price', e.target.value)}
                                        placeholder="0.00"
                                        className={errors.unit_price ? 'border-red-500' : ''}
                                    />
                                    {errors.unit_price && (
                                        <p className="text-sm text-red-500">{errors.unit_price}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/spare-parts">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
