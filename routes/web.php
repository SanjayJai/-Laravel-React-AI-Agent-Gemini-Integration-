<?php
use App\Http\Controllers\AgentController;
use App\Http\Controllers\CategoryController;
Route::post('/agent/chat', [AgentController::class, 'callAgent'])->middleware(['auth']);
Route::get('/agent/chat/history', [AgentController::class, 'chatHistory'])->middleware(['auth']);
Route::delete('/agent/chat/history/{id}', [AgentController::class, 'deleteChatHistory'])->middleware(['auth']);
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', function () {
    return Inertia::render('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::resource('categories', CategoryController::class)
    ->middleware(['auth']);

use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\OrderItemController;

Route::resource('products', ProductController::class)->middleware(['auth']);
Route::resource('orders', OrderController::class)->middleware(['auth']);
Route::resource('order-items', OrderItemController::class)->middleware(['auth']);

Route::get('/api/categories', function () {
    return \App\Models\Category::select('id', 'name')->orderBy('name')->get();
});

Route::get('/api/products', function () {
    return \App\Models\Product::select('id', 'name', 'price')->orderBy('name')->get();
});


Route::post('/invoke-agent', [AgentController::class, 'callAgent'])->name('invoke-agent');

require __DIR__.'/settings.php';
