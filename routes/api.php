<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\BookingController;
 
Route::middleware('auth:sanctum')->group(function () {
    Route::post('bookings/calculate-price', [BookingController::class, 'calculatePrice'])->name('api.bookings.calculate-price');
}); 