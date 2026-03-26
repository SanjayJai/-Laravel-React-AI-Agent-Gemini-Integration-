<?php

namespace App\Ai\Tools;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Tools\Request;
use Stringable;

class ListCatagoryTool implements Tool
{
    /**
     * Get the description of the tool's purpose.
     */
    public function description(): Stringable|string
    {
        return 'List all product categories with their description.';
    }

    /**
     * Execute the tool.
     */
    public function handle(Request $request): Stringable|string
    {
        $categories = \App\Models\Category::all();
        if ($categories->isEmpty()) {
            return 'No categories found.';
        } else {
            $lines = [];
            foreach ($categories as $category) {
                $lines[] = sprintf(
                    "%s: %s",
                    $category->name,
                    $category->description
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
