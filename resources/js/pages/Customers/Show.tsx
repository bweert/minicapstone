import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Customer } from '@/types/repair';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/repair';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { ArrowLeft, Pencil, User, Phone, Mail, Calendar, ClipboardList } from 'lucide-react';

interface Props {
    customer: Customer;
}

export default function Show({ customer }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Customers', href: '/customers' },
        { title: customer.name, href: `/customers/${customer.id}` },
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={customer.name} />

            <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/customers">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Customers
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href={`/customers/${customer.id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Customer
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                    {/* Customer Info Card */}
                    <Card className="md:col-span-1 shadow-sm">
                        <CardHeader className="pb-4">
                            <div className="flex items-center gap-4">
                                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                                    <span className="text-2xl font-bold text-primary">
                                        {customer.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <CardTitle>{customer.name}</CardTitle>
                                    <CardDescription>Customer Profile</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{customer.phone || 'No phone number'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{customer.email || 'No email address'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Member since {new Date(customer.created_at).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Repair Orders Card */}
                    <Card className="md:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ClipboardList className="h-5 w-5" />
                                Repair Orders
                            </CardTitle>
                            <CardDescription>
                                All repair orders for this customer
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {customer.repair_orders && customer.repair_orders.length > 0 ? (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Order ID</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Total</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customer.repair_orders.map((order) => (
                                            <TableRow key={order.id}>
                                                <TableCell className="font-medium">
                                                    #{order.id.toString().padStart(5, '0')}
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={order.status} />
                                                </TableCell>
                                                <TableCell>{formatCurrency(order.total_price)}</TableCell>
                                                <TableCell className="text-muted-foreground">
                                                    {new Date(order.created_at).toLocaleDateString()}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm" asChild>
                                                        <Link href={`/repair-orders/${order.id}`}>
                                                            View
                                                        </Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                    <p>No repair orders yet</p>
                                    <Button className="mt-4" asChild>
                                        <Link href={`/repair-orders/create?customer_id=${customer.id}`}>
                                            Create Repair Order
                                        </Link>
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
