<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class POSController extends Controller
{
    public function index()
    {
        $products = Product::with('category:id,categorie_name')
            ->select('id', 'name', 'price', 'stock_quantity', 'image', 'category_id', 'SKU')
            ->where('stock_quantity', '>', 0)
            ->orderBy('name')
            ->get()
            ->map(fn($product) => [
                'id' => $product->id,
                'name' => $product->name,
                'price' => floatval($product->price),
                'stock' => $product->stock_quantity,
                'image' => $product->image ? asset('storage/' . $product->image) : null,
                'description' => 'Premium Product',
                'category' => $product->category?->categorie_name ?? 'Uncategorized',
                'sku' => $product->SKU ?? null,
            ]);

        // Calculate stats
        $today = Carbon::today();
        $totalProducts = Product::where('stock_quantity', '>', 0)->count();
        $activeCategories = Category::whereHas('products', fn($q) => $q->where('stock_quantity', '>', 0))->count();
        
        // Today's sales
        $todaysSales = Transaction::whereDate('created_at', $today)->sum('total');
        $todaysTransactions = Transaction::whereDate('created_at', $today)->count();
        
        // Average transaction value today
        $avgTransaction = $todaysTransactions > 0 
            ? $todaysSales / $todaysTransactions 
            : 0;
        
        // Best seller today
        $bestSeller = TransactionItem::whereHas('transaction', fn($q) => $q->whereDate('created_at', $today))
            ->select('product_id', DB::raw('SUM(quantity) as total_qty'))
            ->groupBy('product_id')
            ->orderByDesc('total_qty')
            ->with('product:id,name')
            ->first();

        // Get all categories for filter
        $categories = Category::whereHas('products', fn($q) => $q->where('stock_quantity', '>', 0))
            ->select('id', 'categorie_name')
            ->orderBy('categorie_name')
            ->get()
            ->map(fn($cat) => [
                'id' => $cat->id,
                'name' => $cat->categorie_name,
            ]);

        return Inertia::render('POS/Index', [
            'products' => $products,
            'categories' => $categories,
            'csrf_token' => csrf_token(),
            'stats' => [
                'totalProducts' => $totalProducts,
                'activeCategories' => $activeCategories,
                'todaysSales' => floatval($todaysSales),
                'todaysTransactions' => $todaysTransactions,
                'avgTransaction' => floatval($avgTransaction),
                'bestSeller' => $bestSeller?->product?->name ?? 'No sales yet',
            ],
        ]);
    }

    public function checkout(Request $request)
    {
        // Use Validator to ensure JSON response even on validation failure
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'subtotal' => 'required|numeric|min:0',
            'tax' => 'required|numeric|min:0',
            'discount' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,gcash',
            'amount_received' => 'nullable|numeric|min:0',
            'gcash_reference' => 'nullable|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $validated = $validator->validated();

        // Validate payment before transaction
        if ($validated['payment_method'] === 'cash') {
            if (!isset($validated['amount_received']) || $validated['amount_received'] < $validated['total']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Insufficient cash amount',
                ], 422);
            }
        }

        if ($validated['payment_method'] === 'gcash') {
            if (!isset($validated['gcash_reference']) || empty($validated['gcash_reference'])) {
                return response()->json([
                    'success' => false,
                    'message' => 'GCash reference number is required',
                ], 422);
            }
        }

        // Verify stock before transaction
        foreach ($validated['items'] as $item) {
            $product = Product::find($item['id']);
            if (!$product || $product->stock_quantity < $item['quantity']) {
                return response()->json([
                    'success' => false,
                    'message' => "Insufficient stock for product ID {$item['id']}",
                ], 422);
            }
        }

        try {
            $transaction = DB::transaction(function () use ($validated) {
                // Create transaction
                $txn = Transaction::create([
                    'reference_number' => Transaction::generateReferenceNumber(),
                    'subtotal' => $validated['subtotal'],
                    'tax' => $validated['tax'],
                    'discount' => $validated['discount'],
                    'total' => $validated['total'],
                    'payment_method' => $validated['payment_method'],
                    'amount_received' => $validated['amount_received'] ?? null,
                    'change' => $validated['payment_method'] === 'cash' 
                        ? $validated['amount_received'] - $validated['total'] 
                        : null,
                    'gcash_reference' => $validated['gcash_reference'] ?? null,
                    'completed_at' => now(),
                ]);

                // Create transaction items and update stock
                foreach ($validated['items'] as $item) {
                    $product = Product::lockForUpdate()->find($item['id']);

                    TransactionItem::create([
                        'transaction_id' => $txn->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                        'subtotal' => $product->price * $item['quantity'],
                    ]);

                    // Deduct stock
                    $product->decrement('stock_quantity', $item['quantity']);
                }

                return $txn;
            });

            return response()->json([
                'success' => true,
                'message' => 'Transaction completed successfully',
                'transaction' => [
                    'id' => $transaction->id,
                    'reference_number' => $transaction->reference_number,
                    'subtotal' => floatval($transaction->subtotal),
                    'tax' => floatval($transaction->tax),
                    'discount' => floatval($transaction->discount),
                    'total' => floatval($transaction->total),
                    'payment_method' => $transaction->payment_method,
                    'amount_received' => $transaction->amount_received ? floatval($transaction->amount_received) : null,
                    'change' => $transaction->change ? floatval($transaction->change) : null,
                    'gcash_reference' => $transaction->gcash_reference,
                    'completed_at' => $transaction->completed_at,
                    'items' => $transaction->items()->with('product')->get(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Transaction failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}
