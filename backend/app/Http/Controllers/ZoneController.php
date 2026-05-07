<?php

namespace App\Http\Controllers;

use App\Models\Zone;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class ZoneController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $zones = Zone::with(['equipment', 'incidentReports'])->get();
        return response()->json(['data' => $zones], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'status' => ['required', Rule::in(['open', 'closed', 'maintenance'])],
            'max_capacity' => 'required|integer|min:0',
            'current_visitors' => 'required|integer|min:0',
        ]);

        $zone = Zone::create($validated);

        return response()->json(['data' => $zone], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Zone $zone): JsonResponse
    {
        $zone->load(['equipment', 'incidentReports']);
        return response()->json(['data' => $zone], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Zone $zone): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'status' => ['sometimes', 'required', Rule::in(['open', 'closed', 'maintenance'])],
            'max_capacity' => 'sometimes|required|integer|min:0',
            'current_visitors' => 'sometimes|required|integer|min:0',
        ]);

        $zone->update($validated);

        return response()->json(['data' => $zone], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Zone $zone): JsonResponse
    {
        $zone->delete();
        return response()->json(null, 204);
    }
}
