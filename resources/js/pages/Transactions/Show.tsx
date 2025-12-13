import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Transaction } from '@/types/pos';
import { Head, Link } from '@inertiajs/react';
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
    ArrowLeft, Receipt, Calendar, CreditCard, Banknote, 
    DollarSign, Package, Printer, ImageIcon
} from 'lucide-react';

interface Props {
    transaction: Transaction;
}

export default function Show({ transaction }: Props) {
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
                            <p className="text-muted-foreground">Transaction Details</p>
                        </div>
                    </div>
                    <Button onClick={handlePrint} variant="outline" className="gap-2 print:hidden">
                        <Printer className="h-4 w-4" />
                        Print Receipt
                    </Button>
                </div>

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
                                        <TableHead className="font-semibold text-right">Price</TableHead>
                                        <TableHead className="font-semibold text-right">Subtotal</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {transaction.items?.map((item) => (
                                        <TableRow key={item.id}>
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
                        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                            <CardContent className="pt-6">
                                <div className="text-center">
                                    <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
                                    <p className="text-4xl font-bold text-primary">{formatCurrency(transaction.total)}</p>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        {transaction.items?.length || 0} item(s) purchased
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
