import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Transaction } from '@/types/pos';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { 
    ArrowLeft, Receipt, Calendar, CreditCard, Banknote, 
    DollarSign, Package, Printer, ImageIcon, RotateCcw, AlertCircle, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

interface Props {
    transaction: Transaction;
}

interface RefundItemState {
    transaction_item_id: number;
    quantity: number;
    max_quantity: number;
    price: number;
    product_name: string;
    selected: boolean;
}

export default function Show({ transaction }: Props) {
    const [isRefundOpen, setIsRefundOpen] = useState(false);
    const [refundReason, setRefundReason] = useState('');
    const [refundItems, setRefundItems] = useState<RefundItemState[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Transactions', href: '/transactions' },
        { title: transaction.reference_number, href: `/transactions/${transaction.id}` },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-PH', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const handlePrint = () => {
        window.print();
    };

    const initRefundItems = () => {
        const items: RefundItemState[] = (transaction.items || [])
            .filter(item => (item.refundable_quantity ?? item.quantity) > 0)
            .map(item => ({
                transaction_item_id: item.id,
                quantity: 0,
                max_quantity: item.refundable_quantity ?? item.quantity,
                price: item.price,
                product_name: item.product?.name || 'Unknown',
                selected: false,
            }));
        setRefundItems(items);
        setRefundReason('');
    };

    const handleItemSelect = (index: number, checked: boolean) => {
        const updated = [...refundItems];
        updated[index].selected = checked;
        if (checked && updated[index].quantity === 0) {
            updated[index].quantity = 1;
        }
        if (!checked) {
            updated[index].quantity = 0;
        }
        setRefundItems(updated);
    };

    const handleQuantityChange = (index: number, value: number) => {
        const updated = [...refundItems];
        const maxQty = updated[index].max_quantity;
        updated[index].quantity = Math.max(0, Math.min(value, maxQty));
        updated[index].selected = updated[index].quantity > 0;
        setRefundItems(updated);
    };

    const calculateRefundTotal = () => {
        return refundItems
            .filter(item => item.selected && item.quantity > 0)
            .reduce((sum, item) => sum + (item.price * item.quantity), 0);
    };

    const handleRefundSubmit = () => {
        const selectedItems = refundItems
            .filter(item => item.selected && item.quantity > 0)
            .map(item => ({
                transaction_item_id: item.transaction_item_id,
                quantity: item.quantity,
            }));

        if (selectedItems.length === 0) {
            return;
        }

        setIsProcessing(true);
        router.post(`/transactions/${transaction.id}/refund`, {
            items: selectedItems,
            reason: refundReason,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsRefundOpen(false);
                setIsProcessing(false);
            },
            onError: (errors) => {
                console.error('Refund error:', errors);
                setIsProcessing(false);
            },
        });
    };

    const canBeRefunded = transaction.status !== 'refunded';
    const hasRefundableItems = (transaction.items || []).some(
        item => (item.refundable_quantity ?? item.quantity) > 0
    );

    const getStatusBadge = () => {
        switch (transaction.status) {
            case 'refunded':
                return <Badge variant="destructive" className="gap-1"><RotateCcw className="h-3 w-3" /> Fully Refunded</Badge>;
            case 'partially_refunded':
                return <Badge variant="secondary" className="gap-1 bg-orange-100 text-orange-700"><AlertCircle className="h-3 w-3" /> Partial Refund</Badge>;
            default:
                return <Badge variant="secondary" className="gap-1 bg-green-100 text-green-700"><CheckCircle2 className="h-3 w-3" /> Completed</Badge>;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Transaction ${transaction.reference_number}`} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/transactions">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                                <Receipt className="h-6 w-6 text-primary" />
                                {transaction.reference_number}
                            </h1>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-muted-foreground">Transaction Details</p>
                                {getStatusBadge()}
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 print:hidden">
                        {canBeRefunded && hasRefundableItems && (
                            <Dialog open={isRefundOpen} onOpenChange={(open) => {
                                setIsRefundOpen(open);
                                if (open) initRefundItems();
                            }}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="gap-2 text-orange-600 border-orange-300 hover:bg-orange-50">
                                        <RotateCcw className="h-4 w-4" />
                                        Process Refund
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                    <DialogHeader>
                                        <DialogTitle>Process Refund</DialogTitle>
                                        <DialogDescription>
                                            Select items and quantities to refund. Stock will be restored automatically.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-12"></TableHead>
                                                    <TableHead>Product</TableHead>
                                                    <TableHead className="text-center">Available</TableHead>
                                                    <TableHead className="text-center w-24">Qty to Refund</TableHead>
                                                    <TableHead className="text-right">Refund Amount</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {refundItems.map((item, index) => (
                                                    <TableRow key={item.transaction_item_id}>
                                                        <TableCell>
                                                            <Checkbox
                                                                checked={item.selected}
                                                                onCheckedChange={(checked) => handleItemSelect(index, !!checked)}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">{item.product_name}</TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge variant="outline">{item.max_quantity}</Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                min={0}
                                                                max={item.max_quantity}
                                                                value={item.quantity}
                                                                onChange={(e) => handleQuantityChange(index, parseInt(e.target.value) || 0)}
                                                                className="w-20 text-center"
                                                                disabled={!item.selected && item.quantity === 0}
                                                            />
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium">
                                                            {formatCurrency(item.price * item.quantity)}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>

                                        <div className="space-y-2">
                                            <Label htmlFor="reason">Refund Reason (Optional)</Label>
                                            <Textarea
                                                id="reason"
                                                placeholder="Enter reason for refund..."
                                                value={refundReason}
                                                onChange={(e) => setRefundReason(e.target.value)}
                                            />
                                        </div>

                                        <div className="p-4 bg-muted rounded-lg">
                                            <div className="flex justify-between items-center text-lg font-bold">
                                                <span>Total Refund Amount:</span>
                                                <span className="text-red-600">{formatCurrency(calculateRefundTotal())}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setIsRefundOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button 
                                            onClick={handleRefundSubmit} 
                                            disabled={isProcessing || calculateRefundTotal() === 0}
                                            className="bg-red-600 hover:bg-red-700"
                                        >
                                            {isProcessing ? 'Processing...' : `Refund ${formatCurrency(calculateRefundTotal())}`}
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        )}
                        <Button onClick={handlePrint} variant="outline" className="gap-2">
                            <Printer className="h-4 w-4" />
                            Print Receipt
                        </Button>
                    </div>
                </div>

                {/* Refund Summary Alert */}
                {transaction.total_refunded > 0 && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-3">
                            <RotateCcw className="h-5 w-5 text-orange-600" />
                            <div>
                                <p className="font-medium text-orange-800">Refund Applied</p>
                                <p className="text-sm text-orange-600">
                                    Total refunded: {formatCurrency(transaction.total_refunded)} 
                                    {transaction.status === 'partial_refund' && (
                                        <span> • Remaining: {formatCurrency(transaction.total - transaction.total_refunded)}</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Transaction Summary */}
                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Package className="h-5 w-5" />
                                Items Purchased
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-muted/50">
                                        <TableHead className="font-semibold">Product</TableHead>
                                        <TableHead className="font-semibold text-center">Qty</TableHead>
                                        <TableHead className="font-semibold text-center">Refunded</TableHead>
                                        <TableHead className="font-semibold text-right">Price</TableHead>
                                        <TableHead className="font-semibold text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transaction.items?.map((item) => (
                                        <TableRow key={item.id} className={item.refunded_quantity === item.quantity ? 'opacity-50' : ''}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    {item.product?.image ? (
                                                        <img
                                                            src={`/storage/${item.product.image}`}
                                                            alt={item.product?.name || 'Product'}
                                                            className="h-10 w-10 rounded-lg object-cover border"
                                                        />
                                                    ) : (
                                                        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                                            <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="font-medium">{item.product?.name || 'Unknown Product'}</p>
                                                        <p className="text-xs text-muted-foreground">
                                                            SKU: {item.product?.SKU || '—'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="secondary">{item.quantity}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {(item.refunded_quantity ?? 0) > 0 ? (
                                                    <Badge variant="destructive">{item.refunded_quantity}</Badge>
                                                ) : (
                                                    <span className="text-muted-foreground">—</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right text-muted-foreground">
                                                {formatCurrency(item.price)}
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                {formatCurrency(item.subtotal)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>

                            {/* Totals */}
                            <div className="mt-6 border-t pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span>{formatCurrency(transaction.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Tax</span>
                                    <span>{formatCurrency(transaction.tax)}</span>
                                </div>
                                {transaction.discount > 0 && (
                                    <div className="flex justify-between text-sm text-red-600">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(transaction.discount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-lg font-bold border-t pt-2">
                                    <span>Total</span>
                                    <span className="text-green-600">{formatCurrency(transaction.total)}</span>
                                </div>
                                {transaction.total_refunded > 0 && (
                                    <>
                                        <div className="flex justify-between text-sm text-red-600">
                                            <span>Total Refunded</span>
                                            <span>-{formatCurrency(transaction.total_refunded)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold text-primary">
                                            <span>Net Amount</span>
                                            <span>{formatCurrency(transaction.total - transaction.total_refunded)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Information */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Payment Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-sm text-muted-foreground">Payment Method</span>
                                    {transaction.payment_method === 'cash' ? (
                                        <Badge className="bg-green-100 text-green-700 gap-1">
                                            <Banknote className="h-4 w-4" />
                                            Cash
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-blue-100 text-blue-700 gap-1">
                                            <CreditCard className="h-4 w-4" />
                                            GCash
                                        </Badge>
                                    )}
                                </div>

                                {transaction.payment_method === 'cash' && (
                                    <>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Amount Received</span>
                                            <span className="font-medium">{formatCurrency(transaction.amount_received || 0)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Change</span>
                                            <span className="font-medium text-orange-600">{formatCurrency(transaction.change || 0)}</span>
                                        </div>
                                    </>
                                )}

                                {transaction.payment_method === 'gcash' && transaction.gcash_reference && (
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">GCash Reference</span>
                                        <span className="font-mono text-sm">{transaction.gcash_reference}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5" />
                                    Transaction Info
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground">Transaction Date</p>
                                    <p className="font-medium">{formatDate(transaction.created_at)}</p>
                                </div>
                                {transaction.completed_at && (
                                    <div>
                                        <p className="text-sm text-muted-foreground">Completed At</p>
                                        <p className="font-medium">{formatDate(transaction.completed_at)}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-sm text-muted-foreground">Reference Number</p>
                                    <p className="font-mono font-bold text-primary">{transaction.reference_number}</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Summary Card */}
                        <Card className={`border-2 ${transaction.status === 'refunded' ? 'bg-red-50 border-red-200' : transaction.status === 'partial_refund' ? 'bg-orange-50 border-orange-200' : 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20'}`}>
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-1">
                                        {transaction.status === 'refunded' ? 'Fully Refunded' : transaction.status === 'partial_refund' ? 'Net Amount' : 'Total Amount'}
                                    </p>
                                    <p className={`text-4xl font-bold ${transaction.status === 'refunded' ? 'text-red-600 line-through' : transaction.status === 'partial_refund' ? 'text-orange-600' : 'text-primary'}`}>
                                        {transaction.status === 'refunded' 
                                            ? formatCurrency(transaction.total)
                                            : formatCurrency(transaction.total - transaction.total_refunded)
                                        }
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {transaction.items?.length || 0} item(s) purchased
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Refund History */}
                        {transaction.refunded_items && transaction.refunded_items.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2 text-orange-600">
                                        <RotateCcw className="h-5 w-5" />
                                        Refund History
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {transaction.refunded_items.map((refund) => (
                                        <div key={refund.id} className="p-3 bg-muted/50 rounded-lg text-sm">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{refund.product?.name}</p>
                                                    <p className="text-muted-foreground">
                                                        Qty: {refund.quantity_refunded} × {formatCurrency(refund.refund_amount / refund.quantity_refunded)}
                                                    </p>
                                                    {refund.reason && (
                                                        <p className="text-xs text-muted-foreground mt-1">Reason: {refund.reason}</p>
                                                    )}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-medium text-red-600">-{formatCurrency(refund.refund_amount)}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(refund.refunded_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
