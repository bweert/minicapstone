<?php
// filepath: app/Http/Controllers/CategoryController.php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::withCount('products')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('Categories/Index', [
            'categories' => $categories,
            'stats' => [
                'total' => Category::count(),
                'with_products' => Category::has('products')->count(),
                'empty' => Category::doesntHave('products')->count(),
            ],
        ]);
    }

    public function create()
    {
        return Inertia::render('Categories/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'categorie_name' => 'required|string|max:255|unique:categories',
        ]);

        Category::create($validated);

        return redirect()->route('categories.index')->with('success', 'Category created successfully!');
    }

    public function edit(Category $category)
    {
        return Inertia::render('Categories/Edit', [
            'category' => $category,
        ]);
    }

    public function update(Request $request, Category $category)
    {
        $validated = $request->validate([
            'categorie_name' => 'required|string|max:255|unique:categories,categorie_name,' . $category->id,
        ]);

        $category->update($validated);

        return redirect()->route('categories.index')->with('success', 'Category updated successfully!');
    }

    public function destroy(Category $category)
    {
        $category->delete();

        return redirect()->route('categories.index')->with('success', 'Category deleted successfully!');
    }
}