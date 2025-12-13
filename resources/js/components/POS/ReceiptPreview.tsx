import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/hooks/useCart';
import { Printer, CheckCircle2, X, Banknote, Smartphone, Receipt } from 'lucide-react';
import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

interface ReceiptPreviewProps {
    open: boolean;
    onClose: () => void;
    transactionData: {
        reference_number: string;
        items: CartItem[];
        subtotal: number;
        tax: number;
        discount: number;
        total: number;
        paymentMethod: 'cash' | 'gcash';
        amountReceived?: number;
        change?: number;
        gcashReference?: string;
        timestamp: string;
    } | null;
}

export function ReceiptPreview({
    open,
    onClose,
    transactionData,
}: ReceiptPreviewProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handleCloseAndReload = () => {
        onClose();
        window.location.reload();
    };

    const handlePrintAndReload = useReactToPrint({
        contentRef: printRef,
        pageStyle: `
      @page {
        size: 80mm 297mm;
        margin: 5mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
        onAfterPrint: () => {
            window.location.reload();
        },
    });

    if (!transactionData) return null;

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-lg">
                <DialogHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full">
                                <CheckCircle2 className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
                                <p className="text-sm text-gray-500 mt-1">Transaction completed</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="gap-1">
                            <Receipt className="h-3 w-3" />
                            {transactionData.reference_number}
                        </Badge>
                    </div>
                </DialogHeader>

                {/* Receipt Preview Card */}
                <div
                    ref={printRef}
                    className="bg-gradient-to-b from-gray-50 to-white rounded-xl border shadow-inner p-6 space-y-4 print:shadow-none print:border-0 print:p-4"
                >
                    {/* Header */}
                    <div className="text-center space-y-2 pb-4 border-b-2 border-dashed">
                        <div className="flex justify-center">
                            <img
                                src="/images/public/images/423716193_122100729734197999_6164029439040549086_n.png"
                                alt="Cellub Logo"
                                className="h-10 w-auto print:h-8"
                            />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900">CELLUB</h2>
                        <p className="text-xs text-gray-500">Professional Cellphone Services</p>
                        <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                            <span>#{transactionData.reference_number}</span>
                            <span>•</span>
                            <span>{transactionData.timestamp}</span>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Items Purchased</h3>
                        <div className="space-y-2">
                            {transactionData.items.map((item) => (
                                <div key={item.id} className="flex justify-between items-start text-sm">
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                            ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2 })} × {item.quantity}
                                        </p>
                                    </div>
                                    <span className="font-semibold text-gray-900">
                                        ₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="border-t-2 border-dashed pt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₱{transactionData.subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                        </div>
                        {transactionData.tax > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">VAT (12%)</span>
                                <span>₱{transactionData.tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        {transactionData.discount > 0 && (
                            <div className="flex justify-between text-sm text-green-600">
                                <span>Discount</span>
                                <span>-₱{transactionData.discount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                            </div>
                        )}
                        <Separator className="my-2" />
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ₱{transactionData.total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-gray-100 rounded-lg p-4 space-y-2 print:bg-gray-50">
                        <div className="flex items-center gap-2 mb-3">
                            {transactionData.paymentMethod === 'cash' ? (
                                <Banknote className="h-5 w-5 text-green-600" />
                            ) : (
                                <Smartphone className="h-5 w-5 text-blue-600" />
                            )}
                            <span className="font-semibold text-gray-900 uppercase">
                                {transactionData.paymentMethod === 'cash' ? 'Cash Payment' : 'GCash Payment'}
                            </span>
                        </div>

                        {transactionData.paymentMethod === 'cash' ? (
                            <>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Amount Tendered</span>
                                    <span className="font-medium">
                                        ₱{transactionData.amountReceived?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Change</span>
                                    <span className="font-bold text-green-600">
                                        ₱{transactionData.change?.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            </>
                        ) : (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Reference No.</span>
                                <span className="font-mono font-medium">{transactionData.gcashReference}</span>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="text-center pt-4 border-t-2 border-dashed space-y-2">
                        <p className="font-semibold text-gray-900">Thank you for your purchase!</p>
                        <p className="text-xs text-gray-500">We appreciate your business. Come visit us again!</p>
                        <div className="pt-2">
                            <p className="text-[10px] text-gray-400">
                                Powered by Cellub POS System
                            </p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 print:hidden">
                    <Button
                        variant="outline"
                        onClick={handleCloseAndReload}
                        className="flex-1 gap-2"
                    >
                        <X className="w-4 h-4" />
                        Close & New Sale
                    </Button>
                    <Button
                        onClick={() => handlePrintAndReload()}
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
