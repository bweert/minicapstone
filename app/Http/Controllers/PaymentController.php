<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\RepairOrder;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::with('repairOrder.customer')
            ->latest()
            ->paginate(10);
        return Inertia::render('Payments/Index', ['payments' => $payments]);
    }

    public function create(Request $request)
    {
        $repairOrders = RepairOrder::with('customer')
            ->whereDoesntHave('payments', function ($query) {
                $query->where('status', 'paid');
            })
            ->get();

        $selectedOrder = null;
        if ($request->has('repair_order_id')) {
            $selectedOrder = RepairOrder::with('customer')->find($request->repair_order_id);
        }

        return Inertia::render('Payments/Create', [
            'repairOrders' => $repairOrders,
            'selectedOrder' => $selectedOrder,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'repair_order_id' => 'required|exists:repair_orders,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,online',
            'status' => 'required|in:paid,pending',
        ]);

        Payment::create($validated);

        // Update order status if payment is completed
        if ($validated['status'] === 'paid') {
            $order = RepairOrder::find($validated['repair_order_id']);
            $order->update(['status' => 'completed']);
        }

        return redirect()->route('payments.index')->with('success', 'Payment recorded successfully.');
    }

    public function show(Payment $payment)
    {
        $payment->load('repairOrder.customer', 'repairOrder.services.service');
        return Inertia::render('Payments/Show', ['payment' => $payment]);
    }

    public function edit(Payment $payment)
    {
        $payment->load('repairOrder.customer');
        return Inertia::render('Payments/Edit', ['payment' => $payment]);
    }

    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,online',
            'status' => 'required|in:paid,pending',
        ]);

        $payment->update($validated);

        // Update order status if payment is completed
        if ($validated['status'] === 'paid') {
            $payment->repairOrder->update(['status' => 'completed']);
        }

        return redirect()->route('payments.index')->with('success', 'Payment updated successfully.');
    }

    public function destroy(Payment $payment)
    {
        $payment->delete();
        return redirect()->route('payments.index')->with('success', 'Payment deleted successfully.');
    }
}
