import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { type Payment } from '@/types/repair';
import { Printer, CheckCircle2, Banknote, CreditCard, Globe, Receipt, User, Wrench } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface PaymentReceiptProps {
    open: boolean;
    onClose: () => void;
    payment: Payment | null;
}

export function PaymentReceipt({
    open,
    onClose,
    payment,
}: PaymentReceiptProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef: printRef,
        pageStyle: `
            @page {
                size: 80mm auto;
                margin: 5mm;
            }
            @media print {
                body {
                    margin: 0;
                    padding: 0;
                }
            }
        `,
    });

    const formatCurrency = (amount: number | string) => {
        const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `₱${numAmount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getPaymentMethodIcon = (method: string) => {
        switch (method) {
            case 'cash':
                return <Banknote className="h-5 w-5 text-green-600" />;
            case 'card':
                return <CreditCard className="h-5 w-5 text-blue-600" />;
            case 'online':
                return <Globe className="h-5 w-5 text-purple-600" />;
            default:
                return <CreditCard className="h-5 w-5" />;
        }
    };

    const getPaymentMethodLabel = (method: string) => {
        switch (method) {
            case 'cash':
                return 'Cash Payment';
            case 'card':
                return 'Card Payment';
            case 'online':
                return 'Online Payment';
            default:
                return 'Payment';
        }
    };

    if (!payment) return null;

    const paymentId = `P${payment.id.toString().padStart(5, '0')}`;
    const orderId = payment.repair_order_id ? `#${payment.repair_order_id.toString().padStart(5, '0')}` : 'N/A';

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader className="pb-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Payment Receipt</DialogTitle>
                                <p className="text-sm text-gray-500 mt-1">Payment #{paymentId}</p>
                            </div>
                        </div>
                        <Badge 
                            variant={payment.status === 'paid' ? 'default' : 'secondary'}
                            className={payment.status === 'paid' ? 'bg-green-100 text-green-700' : ''}
                        >
                            {payment.status === 'paid' ? 'Paid' : 'Pending'}
                        </Badge>
                    </div>
                </DialogHeader>

                {/* Receipt Preview Card - Scrollable */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    <div
                        ref={printRef}
                        className="bg-gradient-to-b from-gray-50 to-white rounded-xl border shadow-inner p-6 space-y-4 print:shadow-none print:border-0 print:p-4"
                    >
                    {/* Header */}
                    <div className="text-center space-y-2 pb-4 border-b-2 border-dashed">
                        <div className="flex justify-center">
                            <img
                                src="/images/423716193_122100729734197999_6164029439040549086_n.png"
                                alt="Cellub Logo"
                                className="h-16 w-auto print:h-12"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">CELLUB</h2>
                        <p className="text-xs text-gray-500">Professional Cellphone Services</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <Receipt className="h-3 w-3" />
                            <span>Payment #{paymentId}</span>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Payment Details</h3>
                        
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Date & Time</span>
                                <span className="font-medium">{formatDate(payment.created_at)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Payment Method</span>
                                <span className="font-medium capitalize">{payment.payment_method}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Status</span>
                                <Badge 
                                    variant={payment.status === 'paid' ? 'default' : 'secondary'}
                                    className={payment.status === 'paid' ? 'bg-green-100 text-green-700 print:border print:border-green-500' : ''}
                                >
                                    {payment.status === 'paid' ? 'Paid' : 'Pending'}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Related Order */}
                    {payment.repair_order && (
                        <div className="space-y-3 pt-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <Wrench className="h-3 w-3" />
                                Repair Order Details
                            </h3>
                            
                            <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm print:bg-gray-100">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Order ID</span>
                                    <span className="font-mono font-medium">{orderId}</span>
                                </div>
                                {payment.repair_order.services && payment.repair_order.services.length > 0 && (
                                    <div className="pt-2 border-t">
                                        <span className="text-gray-600 text-xs">Services:</span>
                                        <div className="mt-1 space-y-1">
                                            {payment.repair_order.services.map((service, index) => (
                                                <div key={index} className="flex justify-between text-xs">
                                                    <span className="text-gray-700">{service.service?.name || 'Service'}</span>
                                                    <span className="font-medium">{formatCurrency(service.service_price || 0)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="flex justify-between items-center pt-2 border-t">
                                    <span className="text-gray-600">Order Total</span>
                                    <span className="font-medium">{formatCurrency(payment.repair_order.total_price)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Customer Info */}
                    {payment.repair_order?.customer && (
                        <div className="space-y-3">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                <User className="h-3 w-3" />
                                Customer Information
                            </h3>
                            
                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-3 print:bg-gray-100">
                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center print:border print:border-gray-300">
                                    <span className="font-semibold text-primary">
                                        {payment.repair_order.customer.name.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">{payment.repair_order.customer.name}</p>
                                    {payment.repair_order.customer.phone && (
                                        <p className="text-xs text-gray-500">{payment.repair_order.customer.phone}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Amount Summary */}
                    <div className="border-t-2 border-dashed pt-4 space-y-2">
                        <div className="flex justify-between items-center bg-gray-100 rounded-lg p-4 print:border print:border-gray-300">
                            <div className="flex items-center gap-2">
                                {getPaymentMethodIcon(payment.payment_method)}
                                <span className="font-semibold text-gray-900">{getPaymentMethodLabel(payment.payment_method)}</span>
                            </div>
                        </div>
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Amount Paid</span>
                            <span className="text-2xl font-bold text-green-600">
                                {formatCurrency(payment.amount)}
                            </span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t-2 border-dashed space-y-2">
                        <p className="font-semibold text-gray-900">Thank you for your payment!</p>
                        <p className="text-xs text-gray-500">We appreciate your business. Come visit us again!</p>
                        <div className="pt-2">
                            <p className="text-[10px] text-gray-400">
                                Powered by Santing
                            </p>
                        </div>
                        </div>
                    </div>
                </div>

                {/* Actions - Fixed at bottom */}
                <div className="flex gap-3 pt-4 print:hidden flex-shrink-0 border-t mt-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Close
                    </Button>
                    <Button
                        onClick={() => handlePrint()}
                        className="flex-1 gap-2 bg-blue-600 hover:bg-blue-700"
                    >
                        <Printer className="w-4 h-4" />
                        Print Receipt
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
