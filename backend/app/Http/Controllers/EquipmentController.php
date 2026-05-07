<?php

namespace App\Http\Controllers;

use App\Models\Equipment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class EquipmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $equipment = Equipment::with(['zone', 'equipmentAssignments', 'incidentReports'])->get();
        return response()->json(['data' => $equipment], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'sku_code' => 'required|string|unique:equipment,sku_code',
            'name' => 'required|string|max:255',
            'category' => ['required', Rule::in(['harness', 'helmet', 'paintball_marker', 'buggy', 'other'])],
            'zone_id' => 'nullable|exists:zones,id',
            'status' => ['required', Rule::in(['available', 'in_use', 'needs_inspection', 'in_repair', 'retired'])],
            'last_inspection_date' => 'nullable|date',
        ]);

        $equipment = Equipment::create($validated);

        return response()->json(['data' => $equipment], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Equipment $equipment): JsonResponse
    {
        $equipment->load(['zone', 'equipmentAssignments', 'incidentReports']);
        return response()->json(['data' => $equipment], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Equipment $equipment): JsonResponse
    {
        $validated = $request->validate([
            'sku_code' => ['sometimes', 'required', 'string', Rule::unique('equipment')->ignore($equipment->id)],
            'name' => 'sometimes|required|string|max:255',
            'category' => ['sometimes', 'required', Rule::in(['harness', 'helmet', 'paintball_marker', 'buggy', 'other'])],
            'zone_id' => 'nullable|exists:zones,id',
            'status' => ['sometimes', 'required', Rule::in(['available', 'in_use', 'needs_inspection', 'in_repair', 'retired'])],
            'last_inspection_date' => 'nullable|date',
        ]);

        $equipment->update($validated);

        return response()->json(['data' => $equipment], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Equipment $equipment): JsonResponse
    {
        $equipment->delete();
        return response()->json(null, 204);
    }
}
