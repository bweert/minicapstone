import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RepairOrder } from '@/types/repair';
import { Head, router, Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
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
import { ArrowLeft, Save, CreditCard, DollarSign, Banknote, Globe, Receipt } from 'lucide-react';
import { StatusBadge } from '@/components/repair';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Payments', href: '/payments' },
    { title: 'Create', href: '/payments/create' },
];

interface Props {
    repairOrders: RepairOrder[];
    selectedOrder: RepairOrder | null;
}

export default function Create({ repairOrders, selectedOrder }: Props) {
    const { url } = usePage();
    const urlParams = new URLSearchParams(url.split('?')[1] || '');
    const preSelectedOrderId = urlParams.get('repair_order_id');

    const [formData, setFormData] = useState({
        repair_order_id: preSelectedOrderId || '',
        amount: '',
        payment_method: 'cash',
        status: 'paid',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill amount when order is selected
    useEffect(() => {
        if (formData.repair_order_id) {
            const order = repairOrders.find((o) => o.id.toString() === formData.repair_order_id);
            if (order) {
                const totalPaid = order.payments?.reduce((sum, p) => (p.status === 'paid' ? sum + parseFloat(String(p.amount)) : sum), 0) || 0;
                const balance = parseFloat(String(order.total_price)) - totalPaid;
                setFormData((prev) => ({ ...prev, amount: balance.toString() }));
            }
        }
    }, [formData.repair_order_id, repairOrders]);

    // Pre-select order from URL
    useEffect(() => {
        if (selectedOrder) {
            const totalPaid = selectedOrder.payments?.reduce((sum, p) => (p.status === 'paid' ? sum + parseFloat(String(p.amount)) : sum), 0) || 0;
            const balance = parseFloat(String(selectedOrder.total_price)) - totalPaid;
            setFormData((prev) => ({
                ...prev,
                repair_order_id: selectedOrder.id.toString(),
                amount: balance.toString(),
            }));
        }
    }, [selectedOrder]);

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

        router.post('/payments', {
            repair_order_id: parseInt(formData.repair_order_id),
            amount: parseFloat(formData.amount) || 0,
            payment_method: formData.payment_method,
            status: formData.status,
        }, {
            onSuccess: () => {
                toast.success('Payment recorded successfully');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to record payment');
                setIsSubmitting(false);
            },
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const selectedOrderDetails = repairOrders.find((o) => o.id.toString() === formData.repair_order_id);
    const totalPaid = selectedOrderDetails?.payments?.reduce((sum, p) => (p.status === 'paid' ? sum + parseFloat(String(p.amount)) : sum), 0) || 0;
    const balance = selectedOrderDetails ? parseFloat(String(selectedOrderDetails.total_price)) - totalPaid : 0;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Record Payment" />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/payments">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payments
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Receipt className="h-5 w-5" />
                                Record Payment
                            </CardTitle>
                            <CardDescription>
                                Record a payment for a repair order.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label>Repair Order *</Label>
                                <Select
                                    value={formData.repair_order_id}
                                    onValueChange={(value) => handleChange('repair_order_id', value)}
                                >
                                    <SelectTrigger className={errors.repair_order_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a repair order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {repairOrders.map((order) => {
                                            const orderPaid = order.payments?.reduce((sum, p) => (p.status === 'paid' ? sum + parseFloat(String(p.amount)) : sum), 0) || 0;
                                            const orderBalance = parseFloat(String(order.total_price)) - orderPaid;
                                            return (
                                                <SelectItem key={order.id} value={order.id.toString()}>
                                                    #{order.id.toString().padStart(5, '0')} - {order.customer?.name} ({formatCurrency(orderBalance)} due)
                                                </SelectItem>
                                            );
                                        })}
                                    </SelectContent>
                                </Select>
                                {errors.repair_order_id && (
                                    <p className="text-sm text-red-500">{errors.repair_order_id}</p>
                                )}
                            </div>

                            {/* Order Summary */}
                            {selectedOrderDetails && (
                                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Customer</span>
                                        <span className="font-medium">{selectedOrderDetails.customer?.name}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Order Status</span>
                                        <StatusBadge status={selectedOrderDetails.status} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Total Amount</span>
                                        <span className="font-medium">{formatCurrency(selectedOrderDetails.total_price)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Already Paid</span>
                                        <span className="text-green-600">{formatCurrency(totalPaid)}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm font-semibold border-t pt-2">
                                        <span>Balance Due</span>
                                        <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                                            {formatCurrency(balance)}
                                        </span>
                                    </div>
                                </div>
                            )}

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
                                            <SelectItem value="card">
                                                <div className="flex items-center gap-2">
                                                    <CreditCard className="h-4 w-4" />
                                                    Card
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="online">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4" />
                                                    Online
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
                        </CardContent>
                    </Card>

                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Recording...' : 'Record Payment'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/payments">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
