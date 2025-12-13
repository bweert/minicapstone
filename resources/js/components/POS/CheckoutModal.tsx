import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Banknote, Smartphone, CreditCard, AlertCircle, CheckCircle2 } from 'lucide-react';

interface CheckoutModalProps {
    open: boolean;
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    onClose: () => void;
    onConfirm: (data: CheckoutData) => void;
    isLoading?: boolean;
}

export interface CheckoutData {
    paymentMethod: 'cash' | 'gcash';
    amountReceived?: number;
    gcashReference?: string;
}

export function CheckoutModal({
    open,
    subtotal,
    tax,
    discount,
    total,
    onClose,
    onConfirm,
    isLoading = false,
}: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<'cash' | 'gcash'>('cash');
    const [amountReceived, setAmountReceived] = useState('');
    const [gcashReference, setGcashReference] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!open) {
            setAmountReceived('');
            setGcashReference('');
            setError('');
            setPaymentMethod('cash');
        }
    }, [open]);

    const handleConfirm = () => {
        setError('');

        if (paymentMethod === 'cash') {
            const amount = parseFloat(amountReceived);
            if (isNaN(amount) || amount < total) {
                setError('Insufficient cash amount');
                return;
            }
            onConfirm({
                paymentMethod: 'cash',
                amountReceived: amount,
            });
        } else {
            if (!gcashReference.trim()) {
                setError('GCash reference number is required');
                return;
            }
            onConfirm({
                paymentMethod: 'gcash',
                gcashReference,
            });
        }
    };

    const amountNum = parseFloat(amountReceived) || 0;
    const change = Math.max(0, amountNum - total);
    const isCashValid = amountNum >= total;
    const isGcashValid = gcashReference.trim().length > 0;

    // Quick amount buttons
    const quickAmounts = [100, 500, 1000, 2000].filter(amt => amt >= total);

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-md" aria-describedby="checkout-description">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <CreditCard className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Checkout</DialogTitle>
                            <p className="text-sm text-gray-500">Complete your purchase</p>
                        </div>
                    </div>
                    <div id="checkout-description" className="sr-only">
                        Complete your purchase by selecting a payment method
                    </div>
                </DialogHeader>

                <div className="space-y-5">
                    {/* Payment Method Selector */}
                    <div className="space-y-3">
                        <Label className="text-sm font-semibold">Payment Method</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setPaymentMethod('cash');
                                    setError('');
                                }}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                    paymentMethod === 'cash'
                                        ? 'border-green-500 bg-green-50 text-green-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                            >
                                <div className={`p-3 rounded-full ${paymentMethod === 'cash' ? 'bg-green-100' : 'bg-gray-100'}`}>
                                    <Banknote className="h-6 w-6" />
                                </div>
                                <span className="font-semibold">Cash</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setPaymentMethod('gcash');
                                    setError('');
                                }}
                                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                                    paymentMethod === 'gcash'
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                }`}
                            >
                                <div className={`p-3 rounded-full ${paymentMethod === 'gcash' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                                    <Smartphone className="h-6 w-6" />
                                </div>
                                <span className="font-semibold">GCash</span>
                            </button>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3 border">
                        <h4 className="font-semibold text-gray-900 text-sm">Order Summary</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span>₱{subtotal.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                            </div>
                            {tax > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">VAT (12%)</span>
                                    <span>₱{tax.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Discount</span>
                                    <span>-₱{discount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}</span>
                                </div>
                            )}
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total</span>
                            <span className="text-2xl font-bold text-blue-600">
                                ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    </div>

                    {/* Cash Payment */}
                    {paymentMethod === 'cash' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="amount" className="text-sm font-semibold">Amount Received</Label>
                                <Input
                                    id="amount"
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    placeholder="Enter amount"
                                    value={amountReceived}
                                    onChange={(e) => {
                                        setAmountReceived(e.target.value);
                                        setError('');
                                    }}
                                    className="text-lg font-semibold h-12"
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>

                            {/* Quick Amount Buttons */}
                            {quickAmounts.length > 0 && (
                                <div className="flex gap-2 flex-wrap">
                                    {quickAmounts.map(amt => (
                                        <Button
                                            key={amt}
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setAmountReceived(amt.toString())}
                                            className="flex-1"
                                        >
                                            ₱{amt.toLocaleString()}
                                        </Button>
                                    ))}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setAmountReceived(Math.ceil(total).toString())}
                                        className="flex-1"
                                    >
                                        Exact
                                    </Button>
                                </div>
                            )}

                            {amountReceived && (
                                <div className={`p-4 rounded-xl border-2 ${isCashValid ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {isCashValid ? (
                                                <CheckCircle2 className="h-5 w-5 text-green-600" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-amber-600" />
                                            )}
                                            <span className="font-medium text-gray-900">Change</span>
                                        </div>
                                        <span className={`text-2xl font-bold ${isCashValid ? 'text-green-600' : 'text-amber-600'}`}>
                                            ₱{change.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* GCash Payment */}
                    {paymentMethod === 'gcash' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="gcash-ref" className="text-sm font-semibold">GCash Reference Number</Label>
                                <Input
                                    id="gcash-ref"
                                    type="text"
                                    placeholder="e.g., GCX-XXXXX-XXXXX"
                                    value={gcashReference}
                                    onChange={(e) => {
                                        setGcashReference(e.target.value);
                                        setError('');
                                    }}
                                    className="font-mono text-lg h-12"
                                    disabled={isLoading}
                                    autoFocus
                                />
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                                <div className="flex items-start gap-3">
                                    <Smartphone className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div className="text-sm">
                                        <p className="font-medium text-blue-900">
                                            Amount to pay: ₱{total.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
                                        </p>
                                        <p className="text-blue-700 mt-1">
                                            Please ensure the reference number matches the GCash receipt.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleConfirm}
                            disabled={
                                isLoading ||
                                (paymentMethod === 'cash' ? !isCashValid : !isGcashValid)
                            }
                            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                    Processing...
                                </span>
                            ) : (
                                'Complete Payment'
                            )}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
