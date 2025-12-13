import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type RepairOrder, type Customer, type RepairService, type SparePart } from '@/types/repair';
import { Head, router, Link } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Save, ClipboardList } from 'lucide-react';

interface Props {
    order: RepairOrder;
    customers: Customer[];
    services: RepairService[];
    spareParts: SparePart[];
}

export default function Edit({ order, customers, services, spareParts }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Repair Orders', href: '/repair-orders' },
        { title: `Order #${order.id.toString().padStart(5, '0')}`, href: `/repair-orders/${order.id}` },
        { title: 'Edit', href: `/repair-orders/${order.id}/edit` },
    ];

    const [status, setStatus] = useState(order.status);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.put(
            `/repair-orders/${order.id}`,
            { status },
            {
                onSuccess: () => {
                    toast.success('Repair order updated successfully');
                    setIsSubmitting(false);
                },
                onError: () => {
                    toast.error('Failed to update repair order');
                    setIsSubmitting(false);
                },
            }
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Order #${order.id.toString().padStart(5, '0')}`} />

            <div className="p-6 max-w-2xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/repair-orders/${order.id}`}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Order
                        </Link>
                    </Button>
                </div>

                <Card className="shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ClipboardList className="h-5 w-5" />
                            Edit Order #{order.id.toString().padStart(5, '0')}
                        </CardTitle>
                        <CardDescription>
                            Update the order status. Note: Services and parts cannot be modified after creation.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label>Customer</Label>
                                <p className="text-sm text-muted-foreground">{order.customer?.name}</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                                Pending
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-blue-500" />
                                                In Progress
                                            </div>
                                        </SelectItem>
                                        <SelectItem value="completed">
                                            <div className="flex items-center gap-2">
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                Completed
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="submit" disabled={isSubmitting} className="flex-1">
                                    <Save className="mr-2 h-4 w-4" />
                                    {isSubmitting ? 'Saving...' : 'Save Changes'}
                                </Button>
                                <Button type="button" variant="outline" asChild>
                                    <Link href={`/repair-orders/${order.id}`}>Cancel</Link>
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
