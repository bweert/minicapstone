<?php

namespace App\Http\Controllers;

use App\Models\RepairOrder;
use App\Models\Customer;
use App\Models\RepairService;
use App\Models\SparePart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepairOrderController extends Controller
{
    public function index()
    {
        $orders = RepairOrder::with('customer', 'services.service', 'payments')
            ->latest()
            ->paginate(10);
        return Inertia::render('RepairOrders/Index', ['orders' => $orders]);
    }

    public function create()
    {
        $customers = Customer::all();
        $services = RepairService::all();
        $spareParts = SparePart::where('stock_qty', '>', 0)->get();

        return Inertia::render('RepairOrders/Create', [
            'customers' => $customers,
            'services' => $services,
            'spareParts' => $spareParts,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'services' => 'required|array|min:1',
            'services.*.service_id' => 'required|exists:repair_services,id',
            'services.*.service_price' => 'required|numeric|min:0',
            'services.*.parts' => 'nullable|array',
            'services.*.parts.*.part_id' => 'required|exists:spare_parts,id',
            'services.*.parts.*.quantity' => 'required|integer|min:1',
            'services.*.parts.*.unit_price' => 'required|numeric|min:0',
        ]);

        // Create repair order
        $order = RepairOrder::create([
            'customer_id' => $validated['customer_id'],
            'status' => 'pending',
            'total_price' => 0,
        ]);

        // Add services and parts
        foreach ($validated['services'] as $serviceData) {
            $orderService = $order->services()->create([
                'service_id' => $serviceData['service_id'],
                'service_price' => $serviceData['service_price'],
            ]);

            // Add parts to service
            if (!empty($serviceData['parts'])) {
                foreach ($serviceData['parts'] as $partData) {
                    $sparePart = SparePart::find($partData['part_id']);
                    $orderService->addPart($sparePart, $partData['quantity'], $partData['unit_price']);
                }
            }
        }

        // Calculate total price
        $order->calculateTotalPrice();

        return redirect()->route('repair-orders.index')->with('success', 'Repair order created successfully.');
    }

    public function show(RepairOrder $repairOrder)
    {
        $repairOrder->load([
            'customer',
            'services.service',
            'services.parts.part',
            'payments.refundedByUser'
        ]);

        return Inertia::render('RepairOrders/Show', ['order' => $repairOrder]);
    }

    public function edit(RepairOrder $repairOrder)
    {
        $repairOrder->load('services.service', 'services.parts.part');
        $customers = Customer::all();
        $services = RepairService::all();
        $spareParts = SparePart::all();

        return Inertia::render('RepairOrders/Edit', [
            'order' => $repairOrder,
            'customers' => $customers,
            'services' => $services,
            'spareParts' => $spareParts,
        ]);
    }

    public function update(Request $request, RepairOrder $repairOrder)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in_progress,completed',
        ]);

        $repairOrder->update($validated);

        return redirect()->route('repair-orders.index')->with('success', 'Repair order updated successfully.');
    }

    public function destroy(RepairOrder $repairOrder)
    {
        $repairOrder->delete();
        return redirect()->route('repair-orders.index')->with('success', 'Repair order deleted successfully.');
    }

    /**
     * Add service to existing order
     */
    public function addService(Request $request, RepairOrder $repairOrder)
    {
        $validated = $request->validate([
            'service_id' => 'required|exists:repair_services,id',
            'service_price' => 'required|numeric|min:0',
        ]);

        $repairOrder->services()->create($validated);
        $repairOrder->calculateTotalPrice();

        return back()->with('success', 'Service added successfully.');
    }

    /**
     * Add part to service
     */
    public function addPart(Request $request, RepairOrder $repairOrder, $serviceId)
    {
        $validated = $request->validate([
            'part_id' => 'required|exists:spare_parts,id',
            'quantity' => 'required|integer|min:1',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $orderService = $repairOrder->services()->findOrFail($serviceId);
        $sparePart = SparePart::findOrFail($validated['part_id']);

        $result = $orderService->addPart($sparePart, $validated['quantity'], $validated['unit_price']);

        if (!$result) {
            return back()->withErrors(['part_id' => 'Not enough stock available.']);
        }

        $repairOrder->calculateTotalPrice();

        return back()->with('success', 'Part added successfully.');
    }
}
