<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::all();

        return response()->json(['data' => $services]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'service_name' => 'required|string|max:255|unique:service',
            'service_price' => 'required|numeric|min:0',
        ]);

        $service = Service::create($validated);

        return response()->json(['data' => $service], 201);
    }

    public function show(Service $service): JsonResponse
    {
        $service->load('repairParts');

        return response()->json(['data' => $service]);
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        $validated = $request->validate([
            'service_name' => 'sometimes|string|max:255|unique:service,service_name,' . $service->id,
            'service_price' => 'sometimes|numeric|min:0',
        ]);

        $service->update($validated);

        return response()->json(['data' => $service->fresh()]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted']);
    }
}
