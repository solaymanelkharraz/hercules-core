<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AlertController extends Controller
{
    public function latest(): JsonResponse
    {
        $alert = Alert::where('is_active', true)->latest()->first();
        return response()->json(['data' => $alert], 200);
    }
}
