<?php

namespace App\Http\Controllers;

use App\Models\Refund;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class RefundController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Refund::with('transaction', 'refundItems');

        if ($request->filled('transaction_id')) {
            $query->where('transaction_id', $request->transaction_id);
        }

        $refunds = $query->paginate(15);

        return response()->json($refunds);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'transaction_id' => 'required|exists:transaction,id',
            'refund_amount' => 'required|numeric|min:0',
            'reason' => 'nullable|string',
        ]);

        $refund = Refund::create($validated);

        return response()->json(['data' => $refund], 201);
    }

    public function show(Refund $refund): JsonResponse
    {
        $refund->load('transaction', 'refundItems');

        return response()->json(['data' => $refund]);
    }

    public function update(Request $request, Refund $refund): JsonResponse
    {
        $validated = $request->validate([
            'refund_amount' => 'sometimes|numeric|min:0',
            'reason' => 'nullable|string',
        ]);

        $refund->update($validated);

        return response()->json(['data' => $refund->fresh()]);
    }

    public function destroy(Refund $refund): JsonResponse
    {
        $refund->delete();

        return response()->json(['message' => 'Refund deleted']);
    }
}
