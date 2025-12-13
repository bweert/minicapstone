import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Payment } from '@/types/repair';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/repair';
import {
    ArrowLeft,
    Pencil,
    CreditCard,
    User,
    ClipboardList,
    Banknote,
    Globe,
    Calendar,
    Receipt,
} from 'lucide-react';

interface Props {
    payment: Payment;
}

export default function Show({ payment }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Payments', href: '/payments' },
        { title: `#P${payment.id.toString().padStart(5, '0')}`, href: `/payments/${payment.id}` },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash':
                return <Banknote className="h-5 w-5" />;
            case 'card':
                return <CreditCard className="h-5 w-5" />;
            case 'online':
                return <Globe className="h-5 w-5" />;
            default:
                return <CreditCard className="h-5 w-5" />;
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Payment #P${payment.id.toString().padStart(5, '0')}`} />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/payments">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Payments
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/payments/${payment.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Payment
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {/* Payment Details */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <Receipt className="h-5 w-5" />
                                    Payment #P{payment.id.toString().padStart(5, '0')}
                                </CardTitle>
                                <StatusBadge status={payment.status} />
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between py-3 border-b">
                                <span className="text-muted-foreground">Amount</span>
                                <span className="text-2xl font-bold text-primary">
                                    {formatCurrency(payment.amount)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    {getPaymentMethodIcon(payment.payment_method)}
                                    Payment Method
                                </span>
                                <span className="font-medium capitalize">{payment.payment_method}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground flex items-center gap-2">
                                    <Calendar className="h-4 w-4" />
                                    Date
                                </span>
                                <span>{new Date(payment.created_at).toLocaleString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Related Order */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" />
                                Related Order
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">Order ID</span>
                                <Link
                                    href={`/repair-orders/${payment.repair_order_id}`}
                                    className="text-primary hover:underline font-medium"
                                >
                                    #{payment.repair_order_id.toString().padStart(5, '0')}
                                </Link>
                            </div>
                            {payment.repair_order && (
                                <>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Order Status</span>
                                        <StatusBadge status={payment.repair_order.status} />
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Order Total</span>
                                        <span className="font-medium">
                                            {formatCurrency(payment.repair_order.total_price)}
                                        </span>
                                    </div>
                                </>
                            )}

                            {payment.repair_order?.customer && (
                                <div className="pt-4 border-t">
                                    <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Customer
                                    </p>
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                            <span className="font-semibold text-primary">
                                                {payment.repair_order.customer.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium">{payment.repair_order.customer.name}</p>
                                            <Link
                                                href={`/customers/${payment.repair_order.customer.id}`}
                                                className="text-sm text-primary hover:underline"
                                            >
                                                View Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
