import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RepairService } from '@/types/repair';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Settings2, DollarSign } from 'lucide-react';

interface Props {
    service: RepairService;
}

export default function Edit({ service }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Repair Services', href: '/repair-services' },
        { title: service.name, href: `/repair-services/${service.id}/edit` },
        { title: 'Edit', href: `/repair-services/${service.id}/edit` },
    ];

    const [formData, setFormData] = useState({
        name: service.name,
        base_price: service.base_price.toString(),
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

        router.put(`/repair-services/${service.id}`, {
            name: formData.name,
            base_price: parseFloat(formData.base_price) || 0,
        }, {
            onSuccess: () => {
                toast.success('Service updated successfully');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to update service');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit ${service.name}`} />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/repair-services">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Services
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            Edit Service
                        </CardTitle>
                        <CardDescription>
                            Update the service details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2">
                                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                                    Service Name *
                                </Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    placeholder="e.g., Screen Replacement"
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && (
                                    <p className="text-sm text-red-500">{errors.name}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="base_price" className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    Base Price (₱) *
                                </Label>
                                <Input
                                    id="base_price"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.base_price}
                                    onChange={(e) => handleChange('base_price', e.target.value)}
                                    placeholder="0.00"
                                    className={errors.base_price ? 'border-red-500' : ''}
                                />
                                {errors.base_price && (
                                    <p className="text-sm text-red-500">{errors.base_price}</p>
                                )}
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href="/repair-services">Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
