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
        $categories = ServiceCategory::withCount('services')->latest()->get();
        return Inertia::render('Admin/ServiceCategories/index', [
            'serviceCategories' => $categories
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
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

    public function show(ServiceCategory $serviceCategory)
    {
        $serviceCategory->load(['services' => function ($query) {
            $query->withCount('bookings');
        }]);

        return response()->json([
            'category' => [
                'id' => $serviceCategory->id,
                'name' => $serviceCategory->name,
                'description' => $serviceCategory->description,
                'is_active' => $serviceCategory->is_active,
                'services_count' => $serviceCategory->services_count,
                'services' => $serviceCategory->services->map(function ($service) {
                    return [
                        'id' => $service->id,
                        'name' => $service->name,
                        'description' => $service->description,
                        'is_active' => $service->is_active,
                        'bookings_count' => $service->bookings_count,
                    ];
                }),
            ]
        ]);
    }
} 