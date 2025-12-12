<?php

namespace App\Http\Controllers;

use App\Models\RepairPartsCategory;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RepairPartsCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        $categories = RepairPartsCategory::all();

        return response()->json(['data' => $categories]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'category_name' => 'required|string|max:255|unique:repair_parts_category',
        ]);

        $category = RepairPartsCategory::create($validated);

        return response()->json(['data' => $category], 201);
    }

    public function show(RepairPartsCategory $repairPartsCategory): JsonResponse
    {
        $repairPartsCategory->load('repairParts');

        return response()->json(['data' => $repairPartsCategory]);
    }

    public function update(Request $request, RepairPartsCategory $repairPartsCategory): JsonResponse
    {
        $validated = $request->validate([
            'category_name' => 'sometimes|string|max:255|unique:repair_parts_category,category_name,' . $repairPartsCategory->id,
        ]);

        $repairPartsCategory->update($validated);

        return response()->json(['data' => $repairPartsCategory->fresh()]);
    }

    public function destroy(RepairPartsCategory $repairPartsCategory): JsonResponse
    {
        $repairPartsCategory->delete();

        return response()->json(['message' => 'Category deleted']);
    }
}
