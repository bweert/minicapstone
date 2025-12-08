import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItem } from '@/hooks/useCart';
import { Printer, Download } from 'lucide-react';
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

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: `
      @page {
        size: a4;
        margin: 10mm;
      }
      @media print {
        body {
          margin: 0;
          padding: 0;
        }
      }
    `,
  });

  if (!transactionData) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receipt Preview</DialogTitle>
        </DialogHeader>

        {/* Printable Receipt */}
        <div
          ref={printRef}
          className="bg-white p-8 space-y-4 print:p-0 print:space-y-2 text-sm"
        >
          {/* Header */}
          <div className="text-center space-y-2 pb-4 border-b-2 border-gray-800">
            <h2 className="text-2xl font-bold">CELLUB</h2>
            <p className="text-xs text-gray-600">Professional Point of Sale</p>
            <p className="text-xs text-gray-600">Receipt #{transactionData.reference_number}</p>
            <p className="text-xs text-gray-600">{transactionData.timestamp}</p>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-gray-400">
                <tr>
                  <th className="pb-1">Item</th>
                  <th className="text-right pb-1">Qty</th>
                  <th className="text-right pb-1">Price</th>
                  <th className="text-right pb-1">Total</th>
                </tr>
              </thead>
              <tbody className="space-y-1">
                {transactionData.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-1">{item.name}</td>
                    <td className="text-right py-1">{item.quantity}</td>
                    <td className="text-right py-1">${item.price.toFixed(2)}</td>
                    <td className="text-right py-1">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="border-t-2 border-gray-800 pt-2 space-y-1">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${transactionData.subtotal.toFixed(2)}</span>
            </div>
            {transactionData.tax > 0 && (
              <div className="flex justify-between">
                <span>Tax (12%):</span>
                <span>${transactionData.tax.toFixed(2)}</span>
              </div>
            )}
            {transactionData.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount:</span>
                <span>-${transactionData.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-base border-t-2 border-gray-800 pt-1">
              <span>TOTAL:</span>
              <span>${transactionData.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Info */}
          <div className="border-t-2 border-gray-800 pt-2 space-y-1">
            {transactionData.paymentMethod === 'cash' ? (
              <>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold">CASH</span>
                </div>
                <div className="flex justify-between">
                  <span>Amount Received:</span>
                  <span>${transactionData.amountReceived?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-base">
                  <span>Change:</span>
                  <span>${transactionData.change?.toFixed(2)}</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-semibold">GCASH</span>
                </div>
                <div className="flex justify-between">
                  <span>Reference:</span>
                  <span className="font-mono">
                    {transactionData.gcashReference}
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="text-center border-t-2 border-gray-800 pt-4 space-y-1">
            <p className="font-bold text-sm">Thank You!</p>
            <p className="text-xs text-gray-600">We appreciate your business</p>
            <p className="text-xs text-gray-600 italic mt-2">
              Powered by POS System
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end pt-4 print:hidden">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </Button>
          <Button className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
