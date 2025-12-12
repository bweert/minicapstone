<?php

namespace App\Http\Controllers;

use App\Models\RepairParts;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RepairPartsController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = RepairParts::with('category');

        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('search')) {
            $query->where('part_name', 'like', "%{$request->search}%");
        }

        $parts = $query->paginate(15);

        return response()->json($parts);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:repair_parts_category,id',
            'part_name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
        ]);

        $part = RepairParts::create($validated);

        return response()->json(['data' => $part], 201);
    }

    public function show(RepairParts $repairParts): JsonResponse
    {
        $repairParts->load('category', 'services');

        return response()->json(['data' => $repairParts]);
    }

    public function update(Request $request, RepairParts $repairParts): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => 'sometimes|exists:repair_parts_category,id',
            'part_name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
        ]);

        $repairParts->update($validated);

        return response()->json(['data' => $repairParts->fresh()]);
    }

    public function destroy(RepairParts $repairParts): JsonResponse
    {
        $repairParts->delete();

        return response()->json(['message' => 'Part deleted']);
    }
}
