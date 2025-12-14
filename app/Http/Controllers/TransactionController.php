<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\TransactionItem;
use App\Models\RefundedItem;
use App\Models\Product;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('items.product')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'stats' => [
                'total_transactions' => Transaction::count(),
                'total_revenue' => Transaction::sum('total'),
                'cash_transactions' => Transaction::where('payment_method', 'cash')->count(),
                'gcash_transactions' => Transaction::where('payment_method', 'gcash')->count(),
                'today_revenue' => Transaction::whereDate('created_at', today())->sum('total'),
                'today_transactions' => Transaction::whereDate('created_at', today())->count(),
                'total_refunded' => Transaction::sum('total_refunded'),
                'refunded_transactions' => Transaction::where('status', 'refunded')->count(),
                'partial_refunds' => Transaction::where('status', 'partially_refunded')->count(),
            ],
        ]);
    }

    public function show(Transaction $transaction)
    {
        $transaction->load(['items.product', 'items.refundedItems', 'refundedItems.refundedByUser', 'refundedItems.product']);

        // Add refunded quantity to each item
        $transaction->items->each(function ($item) {
            $item->refunded_quantity = $item->getRefundedQuantity();
            $item->refundable_quantity = $item->getRefundableQuantity();
        });

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }

    /**
     * Process refund for transaction items
     */
    public function refund(Request $request, Transaction $transaction)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.transaction_item_id' => 'required|exists:transaction_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'reason' => 'nullable|string|max:255',
        ]);

        if (!$transaction->canBeRefunded()) {
            return back()->withErrors(['error' => 'This transaction has already been fully refunded.']);
        }

        DB::beginTransaction();

        try {
            $totalRefundAmount = 0;

            foreach ($request->items as $itemData) {
                $transactionItem = TransactionItem::with('product')
                    ->where('id', $itemData['transaction_item_id'])
                    ->where('transaction_id', $transaction->id)
                    ->firstOrFail();

                $quantityToRefund = (int) $itemData['quantity'];
                $availableQuantity = $transactionItem->getRefundableQuantity();

                // Validate quantity
                if ($quantityToRefund > $availableQuantity) {
                    throw new \Exception("Cannot refund {$quantityToRefund} of {$transactionItem->product->name}. Only {$availableQuantity} available.");
                }

                // Calculate refund amount for this item
                $refundAmount = $transactionItem->price * $quantityToRefund;
                $totalRefundAmount += $refundAmount;

                // Create refunded item record
                RefundedItem::create([
                    'transaction_id' => $transaction->id,
                    'transaction_item_id' => $transactionItem->id,
                    'product_id' => $transactionItem->product_id,
                    'quantity_refunded' => $quantityToRefund,
                    'refund_amount' => $refundAmount,
                    'reason' => $request->reason,
                    'refunded_by' => auth()->id(),
                    'refunded_at' => now(),
                ]);

                // Restore product stock
                Product::where('id', $transactionItem->product_id)
                    ->increment('stock_quantity', $quantityToRefund);
            }

            // Update transaction total refunded
            $transaction->total_refunded = (float) $transaction->total_refunded + $totalRefundAmount;
            $transaction->save();

            // Update transaction status
            $transaction->updateRefundStatus();

            DB::commit();

            return back()->with('success', 'Refund processed successfully. Total refunded: ₱' . number_format($totalRefundAmount, 2));
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }
}
