import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type Customer, type RepairService, type SparePart } from '@/types/repair';
import { Head, router, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { ArrowLeft, Save, Plus, X, Settings2, Package, User } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Repair Orders', href: '/repair-orders' },
    { title: 'Create', href: '/repair-orders/create' },
];

interface Props {
    customers: Customer[];
    services: RepairService[];
    spareParts: SparePart[];
}

interface ServiceEntry {
    service_id: string;
    service_price: string;
    parts: PartEntry[];
}

interface PartEntry {
    part_id: string;
    quantity: string;
    unit_price: string;
}

export default function Create({ customers, services, spareParts }: Props) {
    const [customerId, setCustomerId] = useState('');
    const [serviceEntries, setServiceEntries] = useState<ServiceEntry[]>([
        { service_id: '', service_price: '', parts: [] },
    ]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [partsDialogOpen, setPartsDialogOpen] = useState(false);
    const [activeServiceIndex, setActiveServiceIndex] = useState<number | null>(null);
    const [partsSearchQuery, setPartsSearchQuery] = useState('');

    // Auto-fill price when service is selected
    const handleServiceChange = (index: number, serviceId: string) => {
        const service = services.find((s) => s.id.toString() === serviceId);
        setServiceEntries((prev) => {
            const newEntries = [...prev];
            newEntries[index] = {
                ...newEntries[index],
                service_id: serviceId,
                service_price: service?.base_price.toString() || '',
            };
            return newEntries;
        });
    };

    const addService = () => {
        setServiceEntries((prev) => [
            ...prev,
            { service_id: '', service_price: '', parts: [] },
        ]);
    };

    const removeService = (index: number) => {
        if (serviceEntries.length > 1) {
            setServiceEntries((prev) => prev.filter((_, i) => i !== index));
        }
    };

    const openPartsDialog = (serviceIndex: number) => {
        setActiveServiceIndex(serviceIndex);
        setPartsSearchQuery('');
        setPartsDialogOpen(true);
    };

    const addPart = () => {
        if (activeServiceIndex === null) return;
        setServiceEntries((prev) => {
            const newEntries = [...prev];
            newEntries[activeServiceIndex].parts.push({
                part_id: '',
                quantity: '1',
                unit_price: '',
            });
            return newEntries;
        });
    };

    const removePart = (serviceIndex: number, partIndex: number) => {
        setServiceEntries((prev) => {
            const newEntries = [...prev];
            newEntries[serviceIndex].parts = newEntries[serviceIndex].parts.filter(
                (_, i) => i !== partIndex
            );
            return newEntries;
        });
    };

    const handlePartChange = (
        serviceIndex: number,
        partIndex: number,
        field: keyof PartEntry,
        value: string
    ) => {
        setServiceEntries((prev) => {
            const newEntries = [...prev];
            const part = newEntries[serviceIndex].parts[partIndex];
            
            if (field === 'part_id') {
                const sparePart = spareParts.find((p) => p.id.toString() === value);
                newEntries[serviceIndex].parts[partIndex] = {
                    ...part,
                    part_id: value,
                    unit_price: sparePart?.unit_price.toString() || '',
                };
            } else {
                newEntries[serviceIndex].parts[partIndex] = {
                    ...part,
                    [field]: value,
                };
            }
            
            return newEntries;
        });
    };

    const calculateTotal = () => {
        return serviceEntries.reduce((total, service) => {
            const servicePrice = parseFloat(service.service_price) || 0;
            const partsTotal = service.parts.reduce((partTotal, part) => {
                const quantity = parseInt(part.quantity) || 0;
                const unitPrice = parseFloat(part.unit_price) || 0;
                return partTotal + quantity * unitPrice;
            }, 0);
            return total + servicePrice + partsTotal;
        }, 0);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        const data = {
            customer_id: customerId,
            services: serviceEntries
                .filter((s) => s.service_id)
                .map((s) => ({
                    service_id: parseInt(s.service_id),
                    service_price: parseFloat(s.service_price) || 0,
                    parts: s.parts
                        .filter((p) => p.part_id)
                        .map((p) => ({
                            part_id: parseInt(p.part_id),
                            quantity: parseInt(p.quantity) || 1,
                            unit_price: parseFloat(p.unit_price) || 0,
                        })),
                })),
        };

        router.post('/repair-orders', data, {
            onSuccess: () => {
                toast.success('Repair order created successfully');
                setIsSubmitting(false);
            },
            onError: (errors) => {
                setErrors(errors);
                toast.error('Failed to create repair order');
                setIsSubmitting(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Repair Order" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/repair-orders">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Orders
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Customer Selection */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Customer Information
                            </CardTitle>
                            <CardDescription>
                                Select the customer for this repair order
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Customer *</Label>
                                <Select value={customerId} onValueChange={setCustomerId}>
                                    <SelectTrigger className={errors.customer_id ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Select a customer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {customers.map((customer) => (
                                            <SelectItem key={customer.id} value={customer.id.toString()}>
                                                {customer.name} {customer.phone && `- ${customer.phone}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.customer_id && (
                                    <p className="text-sm text-red-500">{errors.customer_id}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings2 className="h-5 w-5" />
                                Repair Services
                            </CardTitle>
                            <CardDescription>
                                Add the services required for this repair
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {serviceEntries.map((entry, serviceIndex) => (
                                <div
                                    key={serviceIndex}
                                    className="p-4 border rounded-lg bg-muted/30 space-y-4"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Service *</Label>
                                                <Select
                                                    value={entry.service_id}
                                                    onValueChange={(value) =>
                                                        handleServiceChange(serviceIndex, value)
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a service" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {services.map((service) => (
                                                            <SelectItem
                                                                key={service.id}
                                                                value={service.id.toString()}
                                                            >
                                                                {service.name} - {formatCurrency(service.base_price)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Price *</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={entry.service_price}
                                                    onChange={(e) =>
                                                        setServiceEntries((prev) => {
                                                            const newEntries = [...prev];
                                                            newEntries[serviceIndex].service_price =
                                                                e.target.value;
                                                            return newEntries;
                                                        })
                                                    }
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>
                                        {serviceEntries.length > 1 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeService(serviceIndex)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>

                                    {/* Parts for this service */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="flex items-center gap-2">
                                                <Package className="h-4 w-4" />
                                                Spare Parts ({entry.parts.length})
                                            </Label>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => openPartsDialog(serviceIndex)}
                                            >
                                                <Plus className="mr-2 h-4 w-4" />
                                                Add Parts
                                            </Button>
                                        </div>

                                        {entry.parts.length > 0 && (
                                            <div className="space-y-2 mt-2">
                                                {entry.parts.map((part, partIndex) => {
                                                    const sparePart = spareParts.find(
                                                        (p) => p.id.toString() === part.part_id
                                                    );
                                                    return (
                                                        <div
                                                            key={partIndex}
                                                            className="flex items-center gap-2 p-2 bg-background rounded border"
                                                        >
                                                            <span className="flex-1 text-sm">
                                                                {sparePart?.name || 'Unknown part'} x{part.quantity}
                                                            </span>
                                                            <span className="text-sm font-medium">
                                                                {formatCurrency(
                                                                    (parseFloat(part.unit_price) || 0) *
                                                                        (parseInt(part.quantity) || 0)
                                                                )}
                                                            </span>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-6 w-6 text-red-500"
                                                                onClick={() =>
                                                                    removePart(serviceIndex, partIndex)
                                                                }
                                                            >
                                                                <X className="h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <Button type="button" variant="outline" onClick={addService} className="w-full">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Another Service
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between text-lg font-semibold">
                                <span>Total Amount:</span>
                                <span className="text-primary">{formatCurrency(calculateTotal())}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex gap-4">
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                            <Save className="mr-2 h-4 w-4" />
                            {isSubmitting ? 'Creating...' : 'Create Repair Order'}
                        </Button>
                        <Button type="button" variant="outline" asChild>
                            <Link href="/repair-orders">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>

            {/* Parts Selection Dialog */}
            <Dialog open={partsDialogOpen} onOpenChange={setPartsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Package className="h-5 w-5" />
                            Add Spare Parts
                        </DialogTitle>
                        <DialogDescription>
                            Search and add spare parts to this service
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Search Input */}
                        <div className="space-y-2">
                            <Label>Search Parts</Label>
                            <Input
                                placeholder="Type part name to search..."
                                value={partsSearchQuery}
                                onChange={(e) => setPartsSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>

                        {/* Search Results */}
                        {partsSearchQuery && (
                            <div className="border rounded-lg max-h-48 overflow-y-auto">
                                {spareParts
                                    .filter(
                                        (part) =>
                                            part.name.toLowerCase().includes(partsSearchQuery.toLowerCase()) &&
                                            part.stock_qty > 0
                                    )
                                    .map((part) => {
                                        const isAlreadyAdded = activeServiceIndex !== null && 
                                            serviceEntries[activeServiceIndex]?.parts.some(
                                                (p) => p.part_id === part.id.toString()
                                            );
                                        return (
                                            <div
                                                key={part.id}
                                                className={`flex items-center justify-between p-3 border-b last:border-b-0 ${
                                                    isAlreadyAdded 
                                                        ? 'bg-muted/50 cursor-not-allowed opacity-60' 
                                                        : 'hover:bg-muted/50 cursor-pointer'
                                                }`}
                                                onClick={() => {
                                                    if (isAlreadyAdded || activeServiceIndex === null) return;
                                                    
                                                    // Double-check to prevent duplicate
                                                    const alreadyExists = serviceEntries[activeServiceIndex]?.parts.some(
                                                        (p) => p.part_id === part.id.toString()
                                                    );
                                                    if (alreadyExists) {
                                                        toast.error('Part already added');
                                                        return;
                                                    }

                                                    setServiceEntries((prev) => {
                                                        const newEntries = [...prev];
                                                        // Check again inside setState to be safe
                                                        const exists = newEntries[activeServiceIndex].parts.some(
                                                            (p) => p.part_id === part.id.toString()
                                                        );
                                                        if (exists) return prev;
                                                        
                                                        newEntries[activeServiceIndex] = {
                                                            ...newEntries[activeServiceIndex],
                                                            parts: [
                                                                ...newEntries[activeServiceIndex].parts,
                                                                {
                                                                    part_id: part.id.toString(),
                                                                    quantity: '1',
                                                                    unit_price: part.unit_price.toString(),
                                                                }
                                                            ]
                                                        };
                                                        return newEntries;
                                                    });
                                                    setPartsSearchQuery('');
                                                }}
                                            >
                                                <div>
                                                    <p className="font-medium text-sm">{part.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Stock: {part.stock_qty} | Price: {formatCurrency(part.unit_price)}
                                                    </p>
                                                </div>
                                                {isAlreadyAdded ? (
                                                    <span className="text-xs text-muted-foreground">Added</span>
                                                ) : (
                                                    <Plus className="h-4 w-4 text-green-600" />
                                                )}
                                            </div>
                                        );
                                    })}
                                {spareParts.filter(
                                    (p) => p.name.toLowerCase().includes(partsSearchQuery.toLowerCase()) && p.stock_qty > 0
                                ).length === 0 && (
                                    <p className="p-3 text-sm text-muted-foreground text-center">No parts found</p>
                                )}
                            </div>
                        )}

                        {/* Added Parts List */}
                        {activeServiceIndex !== null && serviceEntries[activeServiceIndex]?.parts.length > 0 && (
                            <div className="space-y-2">
                                <Label>Added Parts ({serviceEntries[activeServiceIndex].parts.length})</Label>
                                <div className="space-y-2">
                                    {serviceEntries[activeServiceIndex].parts.map((part, partIndex) => {
                                        const sparePart = spareParts.find((p) => p.id.toString() === part.part_id);
                                        return (
                                            <div
                                                key={partIndex}
                                                className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
                                            >
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{sparePart?.name}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatCurrency(parseFloat(part.unit_price))} each
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Label className="text-xs">Qty:</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        value={part.quantity}
                                                        onChange={(e) =>
                                                            handlePartChange(
                                                                activeServiceIndex,
                                                                partIndex,
                                                                'quantity',
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-16 h-8"
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-500"
                                                    onClick={() => removePart(activeServiceIndex, partIndex)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button onClick={() => setPartsDialogOpen(false)}>Done</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
