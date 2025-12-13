<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\Customer;
use App\Models\SparePart;
use App\Models\RepairOrder;
use App\Models\RepairService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        // Date ranges
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth();
        $lastMonthStart = $lastMonth->copy()->startOfMonth();
        $lastMonthEnd = $lastMonth->copy()->endOfMonth();

        // Transaction Stats
        $totalRevenue = Transaction::sum('total');
        $todayRevenue = Transaction::whereDate('created_at', $today)->sum('total');
        $thisMonthRevenue = Transaction::where('created_at', '>=', $thisMonth)->sum('total');
        $lastMonthRevenue = Transaction::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->sum('total');
        
        $totalTransactions = Transaction::count();
        $todayTransactions = Transaction::whereDate('created_at', $today)->count();
        $thisMonthTransactions = Transaction::where('created_at', '>=', $thisMonth)->count();
        $lastMonthTransactions = Transaction::whereBetween('created_at', [$lastMonthStart, $lastMonthEnd])->count();

        // Product Stats
        $totalProducts = Product::count();
        $totalStock = Product::sum('stock_quantity');
        $lowStockProducts = Product::where('stock_quantity', '<=', 10)->where('stock_quantity', '>', 0)->get();
        $outOfStockProducts = Product::where('stock_quantity', '=', 0)->count();
        $inventoryValue = Product::sum(\DB::raw('price * stock_quantity'));

        // Category Stats
        $totalCategories = Category::count();
        $categoriesWithProducts = Category::has('products')->count();

        // Repair Stats (if repair system is used)
        $repairOrdersCount = 0;
        $pendingRepairs = 0;
        $completedRepairs = 0;
        $repairRevenue = 0;

        try {
            if (class_exists(\App\Models\RepairOrder::class)) {
                $repairOrdersCount = RepairOrder::count();
                $pendingRepairs = RepairOrder::where('status', 'pending')->count();
                $completedRepairs = RepairOrder::where('status', 'completed')->count();
            }
        } catch (\Exception $e) {
            // Repair tables don't exist
        }

        // Customer Stats
        $totalCustomers = 0;
        try {
            $totalCustomers = Customer::count();
        } catch (\Exception $e) {
            // Customer table doesn't exist
        }

        // Calculate percentage changes
        $revenueChange = $lastMonthRevenue > 0 
            ? round((($thisMonthRevenue - $lastMonthRevenue) / $lastMonthRevenue) * 100, 1)
            : 0;
        
        $transactionsChange = $lastMonthTransactions > 0
            ? round((($thisMonthTransactions - $lastMonthTransactions) / $lastMonthTransactions) * 100, 1)
            : 0;

        // Recent Transactions
        $recentTransactions = Transaction::with('items.product')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Low Stock Items (for display)
        $lowStockItems = Product::where('stock_quantity', '<=', 10)
            ->orderBy('stock_quantity', 'asc')
            ->limit(5)
            ->get(['id', 'name', 'stock_quantity', 'SKU']);

        // Top Selling Products (based on transaction items)
        $topProducts = \DB::table('transaction_items')
            ->join('products', 'transaction_items.product_id', '=', 'products.id')
            ->select('products.id', 'products.name', 'products.image', \DB::raw('SUM(transaction_items.quantity) as total_sold'), \DB::raw('SUM(transaction_items.subtotal) as total_revenue'))
            ->groupBy('products.id', 'products.name', 'products.image')
            ->orderByDesc('total_sold')
            ->limit(5)
            ->get();

        // Sales by Payment Method
        $cashSales = Transaction::where('payment_method', 'cash')->sum('total');
        $gcashSales = Transaction::where('payment_method', 'gcash')->sum('total');

        // Daily sales for chart (last 7 days)
        $dailySales = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $dailySales[] = [
                'date' => $date->format('M d'),
                'day' => $date->format('D'),
                'sales' => Transaction::whereDate('created_at', $date)->sum('total'),
                'count' => Transaction::whereDate('created_at', $date)->count(),
            ];
        }

        return Inertia::render('dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'todayRevenue' => $todayRevenue,
                'thisMonthRevenue' => $thisMonthRevenue,
                'revenueChange' => $revenueChange,
                'totalTransactions' => $totalTransactions,
                'todayTransactions' => $todayTransactions,
                'thisMonthTransactions' => $thisMonthTransactions,
                'transactionsChange' => $transactionsChange,
                'totalProducts' => $totalProducts,
                'totalStock' => $totalStock,
                'lowStockCount' => $lowStockProducts->count(),
                'outOfStockCount' => $outOfStockProducts,
                'inventoryValue' => $inventoryValue,
                'totalCategories' => $totalCategories,
                'categoriesWithProducts' => $categoriesWithProducts,
                'totalCustomers' => $totalCustomers,
                'repairOrdersCount' => $repairOrdersCount,
                'pendingRepairs' => $pendingRepairs,
                'completedRepairs' => $completedRepairs,
                'cashSales' => $cashSales,
                'gcashSales' => $gcashSales,
            ],
            'recentTransactions' => $recentTransactions,
            'lowStockItems' => $lowStockItems,
            'topProducts' => $topProducts,
            'dailySales' => $dailySales,
        ]);
    }
}
