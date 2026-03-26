<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class ListOrderTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'List all orders with user, total amount, and status.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $orders = \App\Models\Order::with('user')->get();
        if ($orders->isEmpty()) {
            return 'No orders found.';
        } else {
            $lines = [];
            foreach ($orders as $order) {
                $lines[] = sprintf(
                    "Order #%s by %s - $%s, Status: %s",
                    $order->id,
                    $order->user?->name ?? 'Guest',
                    $order->total_amount,
                    $order->status
                );
            }
            return implode("\n", $lines);
        }
    }

    /**
     * Get the tool's schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'value' => $schema->string()->required(),
        ];
    }
}
