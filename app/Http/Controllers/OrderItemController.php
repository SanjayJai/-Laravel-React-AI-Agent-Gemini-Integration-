<?php

namespace App\Http\Controllers;

use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderItemController extends Controller
{
    public function index()
    {
        return Inertia::render('OrderItems/Index', [
            'orderItems' => OrderItem::with(['order', 'product'])->latest()->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'order_id' => 'required',
            'product_id' => 'required',
            'quantity' => 'required',
            'price' => 'required',
        ]);
        OrderItem::create($request->all());
        return redirect()->route('order-items.index')->with('success', 'Order item created');
    }

    public function update(Request $request, OrderItem $orderItem)
    {
        $request->validate([
            'quantity' => 'required',
            'price' => 'required',
        ]);
        $orderItem->update($request->all());
        return redirect()->route('order-items.index')->with('success', 'Order item updated');
    }

    public function destroy(OrderItem $orderItem)
    {
        $orderItem->delete();
        return redirect()->route('order-items.index')->with('success', 'Order item deleted');
    }
}
