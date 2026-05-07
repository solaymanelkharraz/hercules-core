<?php

namespace App\Http\Controllers;

use App\Models\IncidentReport;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;

class IncidentReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $reports = IncidentReport::with(['user', 'zone', 'equipment'])->get();
        return response()->json(['data' => $reports], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'zone_id' => 'required|exists:zones,id',
            'equipment_id' => 'nullable|exists:equipment,id',
            'severity_level' => ['required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'description' => 'required|string',
            'status' => ['required', Rule::in(['reported', 'investigating', 'resolved'])],
        ]);

        $validated['user_id'] = $request->user()->id;

        $report = IncidentReport::create($validated);

        if ($report->severity_level === 'critical') {
            \App\Models\Alert::create([
                'message' => 'CRITICAL SOS: ' . $report->description,
                'type' => 'danger',
                'is_active' => true,
                'incident_id' => $report->id
            ]);
        }

        return response()->json(['data' => $report], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(IncidentReport $incidentReport): JsonResponse
    {
        $incidentReport->load(['user', 'zone', 'equipment']);
        return response()->json(['data' => $incidentReport], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, IncidentReport $incidentReport): JsonResponse
    {
        $validated = $request->validate([
            'zone_id' => 'sometimes|required|exists:zones,id',
            'equipment_id' => 'nullable|exists:equipment,id',
            'severity_level' => ['sometimes', 'required', Rule::in(['low', 'medium', 'high', 'critical'])],
            'description' => 'sometimes|required|string',
            'status' => ['sometimes', 'required', Rule::in(['reported', 'investigating', 'resolved'])],
        ]);

        if ($request->has('user_id') || true) {
            $validated['user_id'] = $request->user()->id;
        }

        $incidentReport->update($validated);

        if ($incidentReport->status === 'resolved') {
            \App\Models\Alert::where('incident_id', $incidentReport->id)->delete();
        }

        return response()->json(['data' => $incidentReport], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(IncidentReport $incidentReport): JsonResponse
    {
        $incidentReport->delete();
        return response()->json(null, 204);
    }
}
