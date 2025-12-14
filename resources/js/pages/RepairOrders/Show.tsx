import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RepairOrder, type Payment } from '@/types/repair';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
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
    RotateCcw,
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
    const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
    const [refundPayment, setRefundPayment] = useState<Payment | null>(null);
    const [refundAmount, setRefundAmount] = useState('');
    const [refundReason, setRefundReason] = useState('');
    const [isRefunding, setIsRefunding] = useState(false);

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

    const openRefundDialog = (payment: Payment) => {
        setRefundPayment(payment);
        setRefundAmount(String(payment.amount));
        setRefundReason('');
        setIsRefundDialogOpen(true);
    };

    const closeRefundDialog = () => {
        setIsRefundDialogOpen(false);
        setRefundPayment(null);
        setRefundAmount('');
        setRefundReason('');
    };

    const handleRefundSubmit = () => {
        if (!refundPayment) return;
        
        const amount = parseFloat(refundAmount);
        if (isNaN(amount) || amount <= 0 || amount > refundPayment.amount) {
            toast.error('Invalid refund amount');
            return;
        }

        setIsRefunding(true);
        router.post(`/payments/${refundPayment.id}/refund`, {
            amount: amount,
            reason: refundReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Payment refunded successfully');
                closeRefundDialog();
                setIsRefunding(false);
            },
            onError: (errors) => {
                toast.error(errors.error || 'Failed to process refund');
                setIsRefunding(false);
            },
        });
    };

    const totalPaid = order.payments?.reduce((sum, p) => (p.status === 'paid' ? sum + parseFloat(String(p.amount)) : sum), 0) || 0;
    const totalRefunded = order.payments?.reduce((sum, p) => (p.status === 'refunded' ? sum + parseFloat(String(p.refund_amount || 0)) : sum), 0) || 0;
    const balance = parseFloat(String(order.total_price)) - totalPaid + totalRefunded;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Order #${order.id.toString().padStart(5, '0')}`} />

            {/* Refund Dialog - Outside the loop */}
            <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Refund Payment</DialogTitle>
                        <DialogDescription>
                            Process a refund for this payment. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    
                    {refundPayment && (
                        <div className="space-y-4">
                            <div className="p-4 bg-muted rounded-lg">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Original Amount</span>
                                    <span className="font-medium">{formatCurrency(refundPayment.amount)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-1">
                                    <span className="text-muted-foreground">Payment Method</span>
                                    <span className="capitalize">{refundPayment.payment_method}</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="refund-amount">Refund Amount</Label>
                                <Input
                                    id="refund-amount"
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    max={refundPayment.amount}
                                    value={refundAmount}
                                    onChange={(e) => setRefundAmount(e.target.value)}
                                    placeholder="Enter refund amount"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="refund-reason">Reason (Optional)</Label>
                                <Textarea
                                    id="refund-reason"
                                    value={refundReason}
                                    onChange={(e) => setRefundReason(e.target.value)}
                                    placeholder="Enter reason for refund..."
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={closeRefundDialog}>
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleRefundSubmit}
                            disabled={isRefunding}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            {isRefunding ? 'Processing...' : 'Process Refund'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                                {totalRefunded > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Total Refunded</span>
                                        <span className="text-red-600">-{formatCurrency(totalRefunded)}</span>
                                    </div>
                                )}
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
                                            className={`p-3 border rounded-lg ${payment.status === 'refunded' ? 'bg-red-50 border-red-200' : ''}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className={`font-medium ${payment.status === 'refunded' ? 'line-through text-muted-foreground' : ''}`}>
                                                        {formatCurrency(payment.amount)}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {payment.payment_method}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {payment.status === 'refunded' ? (
                                                        <Badge variant="destructive" className="gap-1">
                                                            <RotateCcw className="h-3 w-3" />
                                                            Refunded
                                                        </Badge>
                                                    ) : (
                                                        <StatusBadge status={payment.status} />
                                                    )}
                                                    {payment.status === 'paid' && (
                                                        <Button 
                                                            variant="outline" 
                                                            size="sm"
                                                            className="text-orange-600 border-orange-300 hover:text-orange-700 hover:bg-orange-50"
                                                            onClick={() => openRefundDialog(payment)}
                                                        >
                                                            Refund
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                            {payment.status === 'refunded' && (
                                                <div className="mt-2 text-xs text-red-600">
                                                    <p>Refunded: {formatCurrency(payment.refund_amount || 0)}</p>
                                                    {payment.refund_reason && (
                                                        <p>Reason: {payment.refund_reason}</p>
                                                    )}
                                                </div>
                                            )}
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
