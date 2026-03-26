<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Orders/Index', [
            'orders' => Order::with('items.product', 'user')->latest()->get(),
            'users' => \App\Models\User::select('id', 'name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
        ]);

        $order = Order::create($request->only(['user_id', 'total_amount', 'status']));

        foreach ($request->items as $item) {
            $order->items()->create($item);
        }

        return redirect()->route('orders.index')->with('success', 'Order created successfully');
    }

    public function update(Request $request, Order $order)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric|min:0',
            'status' => 'required|in:active,inactive',
            'items' => 'required|array|min:1',
        ]);

        $order->update($request->only(['user_id', 'total_amount', 'status']));

        $order->items()->delete();

        foreach ($request->items as $item) {
            $order->items()->create($item);
        }

        return redirect()->route('orders.index')->with('success', 'Order updated successfully');
    }

    public function destroy(Order $order)
    {
        $order->delete();
        return redirect()->route('orders.index')->with('success', 'Order deleted successfully');
    }
}