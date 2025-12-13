<?php

namespace App\Http\Controllers;

use App\Models\RepairService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RepairServiceController extends Controller
{
    public function index()
    {
        $services = RepairService::latest()->paginate(10);
        return Inertia::render('RepairServices/Index', ['services' => $services]);
    }

    public function create()
    {
        return Inertia::render('RepairServices/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:0',
        ]);

        RepairService::create($validated);

        return redirect()->route('repair-services.index')->with('success', 'Service created successfully.');
    }

    public function show(RepairService $repairService)
    {
        return Inertia::render('RepairServices/Show', ['service' => $repairService]);
    }

    public function edit(RepairService $repairService)
    {
        return Inertia::render('RepairServices/Edit', ['service' => $repairService]);
    }

    public function update(Request $request, RepairService $repairService)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'base_price' => 'required|numeric|min:0',
        ]);

        $repairService->update($validated);

        return redirect()->route('repair-services.index')->with('success', 'Service updated successfully.');
    }

    public function destroy(RepairService $repairService)
    {
        $repairService->delete();
        return redirect()->route('repair-services.index')->with('success', 'Service deleted successfully.');
    }
}
