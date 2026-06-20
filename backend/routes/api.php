<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AccountSettingsController;
use App\Http\Controllers\Api\AdminProfileController;
use App\Http\Controllers\Api\AdminSettingsController;
use App\Http\Controllers\Api\HeartRateController;
use App\Http\Controllers\Api\MentalHealthTestController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/status', fn () => response()->json([
    'message' => 'Meltalcare API aktif',
]));

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/users', [AuthController::class, 'users']);
Route::get('/users/{user}/settings', [AccountSettingsController::class, 'show']);
Route::put('/users/{user}/settings', [AccountSettingsController::class, 'update']);
Route::put('/users/{user}/password', [AccountSettingsController::class, 'updatePassword']);
Route::get('/users/{user}/admin-profile', [AdminProfileController::class, 'show']);
Route::put('/users/{user}/admin-profile', [AdminProfileController::class, 'update']);
Route::get('/users/{user}/admin-settings', [AdminSettingsController::class, 'show']);
Route::put('/users/{user}/admin-settings', [AdminSettingsController::class, 'update']);
Route::post('/users/{user}/admin-settings/backup', [AdminSettingsController::class, 'backup']);
Route::get('/users/{user}/admin-settings/export', [AdminSettingsController::class, 'export']);

Route::apiResource('/students', StudentController::class);

Route::get('/admin/dashboard', [MentalHealthTestController::class, 'dashboard']);
Route::get('/mental-health-tests', [MentalHealthTestController::class, 'index']);
Route::post('/mental-health-tests', [MentalHealthTestController::class, 'store']);
Route::get('/mental-health-tests/{mentalHealthTest}', [MentalHealthTestController::class, 'show']);
Route::get('/students/{student}/mental-health-tests', [MentalHealthTestController::class, 'byStudent']);

Route::get('/students/{student}/heart-rates', [HeartRateController::class, 'byStudent']);
Route::get('/heart-rates', [HeartRateController::class, 'index']);
Route::post('/heart-rates', [HeartRateController::class, 'store']);
Route::get('/iot/latest', [HeartRateController::class, 'latest']);
