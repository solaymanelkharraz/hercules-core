<?php

namespace App\Http\Controllers;

use App\Models\EquipmentAssignment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class EquipmentAssignmentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $assignments = EquipmentAssignment::with(['equipment', 'user'])->get();
        return response()->json(['data' => $assignments], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'equipment_id' => 'required|exists:equipment,id',
            'assigned_at' => 'sometimes|required|date',
            'returned_at' => 'nullable|date',
        ]);

        $validated['user_id'] = $request->user()->id;

        $assignment = EquipmentAssignment::create($validated);

        return response()->json(['data' => $assignment], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(EquipmentAssignment $equipmentAssignment): JsonResponse
    {
        $equipmentAssignment->load(['equipment', 'user']);
        return response()->json(['data' => $equipmentAssignment], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EquipmentAssignment $equipmentAssignment): JsonResponse
    {
        $validated = $request->validate([
            'equipment_id' => 'sometimes|required|exists:equipment,id',
            'assigned_at' => 'sometimes|required|date',
            'returned_at' => 'nullable|date',
        ]);

        if ($request->has('user_id') || true) {
            $validated['user_id'] = $request->user()->id;
        }

        $equipmentAssignment->update($validated);

        return response()->json(['data' => $equipmentAssignment], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EquipmentAssignment $equipmentAssignment): JsonResponse
    {
        $equipmentAssignment->delete();
        return response()->json(null, 204);
    }
}
