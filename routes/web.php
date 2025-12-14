<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\POSController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\SparePartController;
use App\Http\Controllers\RepairServiceController;
use App\Http\Controllers\RepairOrderController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('dashboard');
    }
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('products', ProductController::class);
    Route::resource('categories', CategoryController::class);
    
    // POS Routes
    Route::get('pos', [POSController::class, 'index'])->name('pos.index');
    Route::post('pos/checkout', [POSController::class, 'checkout'])->name('pos.checkout');

    // Repair Routes - Customer Creation
    Route::get('customers/create', function () {
        return Inertia::render('Repairs/CreateCustomer');
    })->name('customers.create');

    // Transaction Routes
    Route::get('transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('transactions/{transaction}', [TransactionController::class, 'show'])->name('transactions.show');
    Route::post('transactions/{transaction}/refund', [TransactionController::class, 'refund'])->name('transactions.refund');

    // Repair System Routes
    Route::resource('customers', CustomerController::class);

    // Repair Management Routes
    Route::resource('spare-parts', SparePartController::class);
    Route::resource('repair-services', RepairServiceController::class);
    Route::resource('repair-orders', RepairOrderController::class);
    Route::post('repair-orders/{repairOrder}/add-service', [RepairOrderController::class, 'addService'])->name('repair-orders.add-service');
    Route::post('repair-orders/{repairOrder}/services/{serviceId}/add-part', [RepairOrderController::class, 'addPart'])->name('repair-orders.add-part');
    Route::resource('payments', PaymentController::class);
    Route::post('payments/{payment}/refund', [PaymentController::class, 'refund'])->name('payments.refund');

});
 
require __DIR__.'/settings.php';
