import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Payment } from '@/types/repair';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { ArrowLeft, Save, DollarSign, Banknote, Smartphone, Receipt } from 'lucide-react';

interface Props {
    payment: Payment;
}

export default function Edit({ payment }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Payments', href: '/payments' },
        { title: `#P${payment.id.toString().padStart(5, '0')}`, href: `/payments/${payment.id}` },
        { title: 'Edit', href: `/payments/${payment.id}/edit` },
    ];

    const [formData, setFormData] = useState({
        amount: payment.amount.toString(),
        payment_method: payment.payment_method,
        status: payment.status,
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

        router.put(`/payments/${payment.id}`, {
            amount: parseFloat(formData.amount) || 0,
            payment_method: formData.payment_method,
            status: formData.status,
        }, {
            onSuccess: () => {
                toast.success('Payment updated successfully');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to update payment');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Payment #P${payment.id.toString().padStart(5, '0')}`} />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/payments/${payment.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payment
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Receipt className="h-5 w-5" />
                            Edit Payment #P{payment.id.toString().padStart(5, '0')}
                        </CardTitle>
                        <CardDescription>
                            Update the payment details.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Repair Order</Label>
                                <p className="text-sm text-muted-foreground">
                                    Order #{payment.repair_order_id.toString().padStart(5, '0')} - {payment.repair_order?.customer?.name}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="amount" className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    Payment Amount (₱) *
                                </Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => handleChange('amount', e.target.value)}
                                    placeholder="0.00"
                                    className={errors.amount ? 'border-red-500' : ''}
                                />
                                {errors.amount && (
                                    <p className="text-sm text-red-500">{errors.amount}</p>
                                )}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Payment Method *</Label>
                                    <Select
                                        value={formData.payment_method}
                                        onValueChange={(value) => handleChange('payment_method', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">
                                                <div className="flex items-center gap-2">
                                                    <Banknote className="h-4 w-4" />
                                                    Cash
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="gcash">
                                                <div className="flex items-center gap-2">
                                                    <Smartphone className="h-4 w-4" />
                                                    GCash
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label>Payment Status *</Label>
                                    <Select
                                        value={formData.status}
                                        onValueChange={(value) => handleChange('status', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="paid">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-green-500" />
                                                    Paid
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="pending">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                                    Pending
                                                </div>
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/payments/${payment.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
