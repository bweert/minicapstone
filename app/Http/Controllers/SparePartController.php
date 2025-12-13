<?php

namespace App\Http\Controllers;

use App\Models\SparePart;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SparePartController extends Controller
{
    public function index()
    {
        $spareParts = SparePart::latest()->paginate(10);
        return Inertia::render('SpareParts/Index', ['spareParts' => $spareParts]);
    }

    public function create()
    {
        return Inertia::render('SpareParts/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock_qty' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
        ]);

        SparePart::create($validated);

        return redirect()->route('spare-parts.index')->with('success', 'Spare part created successfully.');
    }

    public function show(SparePart $sparePart)
    {
        return Inertia::render('SpareParts/Show', ['sparePart' => $sparePart]);
    }

    public function edit(SparePart $sparePart)
    {
        return Inertia::render('SpareParts/Edit', ['sparePart' => $sparePart]);
    }

    public function update(Request $request, SparePart $sparePart)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock_qty' => 'required|integer|min:0',
            'unit_price' => 'required|numeric|min:0',
        ]);

        $sparePart->update($validated);

        return redirect()->route('spare-parts.index')->with('success', 'Spare part updated successfully.');
    }

    public function destroy(SparePart $sparePart)
    {
        $sparePart->delete();
        return redirect()->route('spare-parts.index')->with('success', 'Spare part deleted successfully.');
    }
}
