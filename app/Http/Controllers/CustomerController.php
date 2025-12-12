<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class CustomerController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Customer::query();

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where('name', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%")
                  ->orWhere('brand', 'like', "%{$search}%");
        }

        $customers = $query->paginate(15);

        return response()->json($customers);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string',
            'brand' => 'required|string|max:255',
            'unit' => 'required|string|max:255',
            'problem' => 'required|string',
        ]);

        $customer = Customer::create($validated);

        return response()->json(['data' => $customer], 201);
    }

    public function show(Customer $customer): JsonResponse
    {
        return response()->json(['data' => $customer]);
    }

    public function update(Request $request, Customer $customer): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'address' => 'nullable|string',
            'brand' => 'sometimes|string|max:255',
            'unit' => 'sometimes|string|max:255',
            'problem' => 'sometimes|string',
        ]);

        $customer->update($validated);

        return response()->json(['data' => $customer->fresh()]);
    }

    public function destroy(Customer $customer): JsonResponse
    {
        $customer->delete();

        return response()->json(['message' => 'Customer deleted']);
    }
}
