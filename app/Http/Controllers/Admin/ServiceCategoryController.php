<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Str;

class ServiceCategoryController extends Controller
{
    public function index()
    {
        $categories = ServiceCategory::latest()->get();
        return Inertia::render('Admin/ServiceCategories/index', [
            'serviceCategories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'hourly_rate' => 'required|numeric|min:0',
            'icon' => 'nullable|string',
            // 'sort_order' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        ServiceCategory::create($validated);

        return redirect()->back()->with('success', 'Service category created successfully.');
    }

    public function update(Request $request, ServiceCategory $serviceCategory)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'hourly_rate' => 'required|numeric|min:0',
            'icon' => 'nullable|string',
            // 'sort_order' => 'required|integer|min:0',
            'is_active' => 'required|boolean',
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        $serviceCategory->update($validated);

        return redirect()->back()->with('success', 'Service category updated successfully.');
    }

    public function destroy(ServiceCategory $serviceCategory)
    {
        $serviceCategory->delete();

        return redirect()->back()->with('success', 'Service category deleted successfully.');
    }
} 