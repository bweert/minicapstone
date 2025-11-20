<?php
namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Products/Index', [
            'products' => Product::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'price' => 'required|integer'
        ]);

        Product::create($request->all());

        return redirect()->back();
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name' => 'required',
            'price' => 'required|integer'
        ]);

        $product->update($request->all());

        return redirect()->back();
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->back();
    }
}
