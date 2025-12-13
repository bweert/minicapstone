<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Inertia\Inertia;
use Illuminate\Http\Request;

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
            ],
        ]);
    }

    public function show(Transaction $transaction)
    {
        $transaction->load('items.product');

        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction,
        ]);
    }
}
