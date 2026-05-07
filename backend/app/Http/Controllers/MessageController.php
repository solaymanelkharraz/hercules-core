<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\IncidentReport;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    public function index($incidentId): JsonResponse
    {
        $incident = IncidentReport::findOrFail($incidentId);
        $messages = $incident->messages()->with('user:id,name,role')->orderBy('created_at', 'asc')->get();
        return response()->json(['data' => $messages], 200);
    }

    public function store(Request $request, $incidentId): JsonResponse
    {
        $incident = IncidentReport::findOrFail($incidentId);
        
        if ($incident->status === 'resolved') {
            return response()->json(['message' => 'Incident is resolved. Chat is closed.'], 403);
        }

        try {
            $validated = $request->validate([
                'message' => 'nullable|string|max:1000',
                'image' => 'nullable|file|max:15000'
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'message' => 'Validation failed: ' . json_encode($e->errors())
            ], 422);
        }

        if (empty($validated['message']) && !$request->hasFile('image')) {
            return response()->json(['message' => 'Message or image is required. Received: ' . json_encode($request->all())], 422);
        }

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('chat_images', 'public');
        }

        $message = $incident->messages()->create([
            'user_id' => $request->user()->id,
            'message' => $validated['message'] ?? '',
            'image_path' => $imagePath ? '/storage/' . $imagePath : null
        ]);

        return response()->json(['data' => $message->load('user:id,name,role')], 201);
    }
}
