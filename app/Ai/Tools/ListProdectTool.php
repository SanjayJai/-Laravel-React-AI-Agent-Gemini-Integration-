<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class ListProdectTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'List all products with their name, price, stock, and category.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $products = \App\Models\Product::with('category')->get();
        if ($products->isEmpty()) {
            return 'No products found.';
        } else {
            $lines = [];
            foreach ($products as $product) {
                $lines[] = sprintf(
                    "%s (Category: %s)\nDescription: %s\nPrice: $%s, Stock: %s",
                    $product->name,
                    $product->category?->name ?? 'N/A',
                    $product->description ?? 'No description',
                    $product->price,
                    $product->stock
                );
            }
            return implode("\n\n", $lines);
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
