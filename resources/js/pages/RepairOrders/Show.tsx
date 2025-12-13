import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RepairOrder } from '@/types/repair';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/repair';
import {
    ArrowLeft,
    User,
    Phone,
    Mail,
    ClipboardList,
    Settings2,
    Package,
    CreditCard,
    Calendar,
    Save,
} from 'lucide-react';

interface Props {
    order: RepairOrder;
}

export default function Show({ order }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Repair Orders', href: '/repair-orders' },
        { title: `Order #${order.id.toString().padStart(5, '0')}`, href: `/repair-orders/${order.id}` },
    ];

    const [status, setStatus] = useState(order.status);
    const [isUpdating, setIsUpdating] = useState(false);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const handleStatusUpdate = () => {
        setIsUpdating(true);
        router.put(
            `/repair-orders/${order.id}`,
            { status },
            {
                onSuccess: () => {
                    toast.success('Order status updated');
                    setIsUpdating(false);
                },
                onError: () => {
                    toast.error('Failed to update status');
                    setIsUpdating(false);
                },
            }
        );
    };

    const totalPaid = order.payments?.reduce((sum, p) => (p.status === 'paid' ? sum + p.amount : sum), 0) || 0;
    const balance = order.total_price - totalPaid;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id.toString().padStart(5, '0')}`} />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/repair-orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                    <div className="flex items-center gap-2">
                        {balance > 0 && (
                            <Button asChild>
                                <Link href={`/payments/create?repair_order_id=${order.id}`}>
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    Process Payment
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Order Info */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <ClipboardList className="h-5 w-5" />
                                    Order #{order.id.toString().padStart(5, '0')}
                                </CardTitle>
                                <StatusBadge status={order.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Update Status</label>
                                <div className="flex gap-2">
                                    <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                        <SelectTrigger className="flex-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pending">Pending</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="completed">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        onClick={handleStatusUpdate}
                                        disabled={isUpdating || status === order.status}
                                        size="icon"
                                    >
                                        <Save className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Created
                                    </span>
                                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Total Amount</span>
                                    <span className="font-semibold">{formatCurrency(order.total_price)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">Amount Paid</span>
                                    <span className="text-green-600">{formatCurrency(totalPaid)}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm font-semibold">
                                    <span>Balance</span>
                                    <span className={balance > 0 ? 'text-red-600' : 'text-green-600'}>
                                        {formatCurrency(balance)}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Customer Info */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-lg font-bold text-primary">
                                        {order.customer?.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-semibold">{order.customer?.name}</p>
                                    <Link
                                        href={`/customers/${order.customer?.id}`}
                                        className="text-sm text-primary hover:underline"
                                    >
                                        View Profile
                                    </Link>
                                </div>
                            </div>
                            {order.customer?.phone && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Phone className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.customer.phone}</span>
                                </div>
                            )}
                            {order.customer?.email && (
                                <div className="flex items-center gap-3 text-sm">
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    <span>{order.customer.email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Payment History */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payments
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {order.payments && order.payments.length > 0 ? (
                                <div className="space-y-3">
                                    {order.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="flex items-center justify-between p-3 border rounded-lg"
                                        >
                                            <div>
                                                <p className="font-medium">{formatCurrency(payment.amount)}</p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {payment.payment_method}
                                                </p>
                                            </div>
                                            <StatusBadge status={payment.status} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-4">No payments yet</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Services & Parts */}
                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings2 className="h-5 w-5" />
                            Services & Parts
                        </CardTitle>
                        <CardDescription>Breakdown of services and parts used</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {order.services && order.services.length > 0 ? (
                            <div className="space-y-6">
                                {order.services.map((orderService, index) => (
                                    <div key={orderService.id} className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Settings2 className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">
                                                        {orderService.service?.name || 'Service'}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Service #{index + 1}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="font-semibold">
                                                {formatCurrency(orderService.service_price)}
                                            </span>
                                        </div>

                                        {orderService.parts && orderService.parts.length > 0 && (
                                            <div className="ml-6">
                                                <p className="text-sm font-medium flex items-center gap-2 mb-2">
                                                    <Package className="h-4 w-4" />
                                                    Parts Used
                                                </p>
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Part Name</TableHead>
                                                            <TableHead className="text-center">Qty</TableHead>
                                                            <TableHead className="text-right">Unit Price</TableHead>
                                                            <TableHead className="text-right">Subtotal</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {orderService.parts.map((part) => (
                                                            <TableRow key={part.id}>
                                                                <TableCell>{part.part?.name}</TableCell>
                                                                <TableCell className="text-center">
                                                                    {part.quantity}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    {formatCurrency(part.unit_price)}
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    {formatCurrency(part.quantity * part.unit_price)}
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted-foreground text-center py-8">No services added</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
