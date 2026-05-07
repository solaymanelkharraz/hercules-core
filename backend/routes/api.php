<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ZoneController;
use App\Http\Controllers\EquipmentController;
use App\Http\Controllers\EquipmentAssignmentController;
use App\Http\Controllers\IncidentReportController;
use App\Http\Controllers\AlertController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/alerts/latest', [AlertController::class, 'latest']);
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // User List is readable by everyone (for dropdowns), but management is restricted
    Route::get('/users', [UserController::class, 'index']);
    
    // Admin & Manager Only
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        
        Route::apiResource('equipment-assignments', EquipmentAssignmentController::class);
    });

    // Zones: Admin/Manager can manage, others can only view
    Route::get('/zones', [ZoneController::class, 'index']);
    Route::get('/zones/{zone}', [ZoneController::class, 'show']);
    Route::middleware('role:admin,manager')->group(function () {
        Route::post('/zones', [ZoneController::class, 'store']);
        Route::put('/zones/{zone}', [ZoneController::class, 'update']);
        Route::delete('/zones/{zone}', [ZoneController::class, 'destroy']);
    });

    // Equipment: Admin/Manager/Cashier can view/manage
    Route::get('/equipment', [EquipmentController::class, 'index']);
    Route::get('/equipment/{equipment}', [EquipmentController::class, 'show']);
    Route::middleware('role:admin,manager,cashier')->group(function () {
        Route::post('/equipment', [EquipmentController::class, 'store']);
        Route::put('/equipment/{equipment}', [EquipmentController::class, 'update']);
        Route::delete('/equipment/{equipment}', [EquipmentController::class, 'destroy']);
    });

    // Incidents: Admin/Manager/Guide can view/manage
    Route::get('/incident-reports', [IncidentReportController::class, 'index']);
    Route::get('/incident-reports/{incident_report}', [IncidentReportController::class, 'show']);
    Route::middleware('role:admin,manager,guide')->group(function () {
        Route::post('/incident-reports', [IncidentReportController::class, 'store']);
        Route::put('/incident-reports/{incident_report}', [IncidentReportController::class, 'update']);
        Route::delete('/incident-reports/{incident_report}', [IncidentReportController::class, 'destroy']);
    });
    
    // War Room Chat (available to anyone who can view incidents)
    Route::middleware('role:admin,manager,guide')->group(function () {
        Route::get('/incident-reports/{id}/messages', [\App\Http\Controllers\MessageController::class, 'index']);
        Route::post('/incident-reports/{id}/messages', [\App\Http\Controllers\MessageController::class, 'store']);
    });
});
