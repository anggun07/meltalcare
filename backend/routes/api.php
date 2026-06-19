<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\HeartRateController;
use App\Http\Controllers\Api\StudentController;
use Illuminate\Support\Facades\Route;

Route::get('/status', fn () => response()->json([
    'message' => 'Meltalcare API aktif',
]));

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);

Route::apiResource('/students', StudentController::class);

Route::get('/students/{student}/heart-rates', [HeartRateController::class, 'byStudent']);
Route::get('/heart-rates', [HeartRateController::class, 'index']);
Route::post('/heart-rates', [HeartRateController::class, 'store']);
Route::get('/iot/latest', [HeartRateController::class, 'latest']);
