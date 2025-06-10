<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceOption;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceOptionController extends Controller
{
    public function index(Service $service)
    {
        $options = $service->options()->ordered()->get();
        
        return Inertia::render('Admin/Services/Options/Index', [
            'service' => $service,
            'options' => $options
        ]);
    }

    public function create(Service $service)
    {
        return Inertia::render('Admin/Services/Options/Create', [
            'service' => $service
        ]);
    }

    public function store(Request $request, Service $service)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'min_qty' => 'required|integer|min:1',
            'max_qty' => 'nullable|integer|min:1',
            'is_variable' => 'boolean',
            'note' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $option = $service->options()->create($validated);

        return redirect()
            ->route('admin.services.options.index', $service)
            ->with('success', 'Service option created successfully.');
    }

    public function edit(Service $service, ServiceOption $option)
    {
        return Inertia::render('Admin/Services/Options/Edit', [
            'service' => $service,
            'option' => $option
        ]);
    }

    public function update(Request $request, Service $service, ServiceOption $option)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'min_qty' => 'required|integer|min:1',
            'max_qty' => 'nullable|integer|min:1',
            'is_variable' => 'boolean',
            'note' => 'nullable|string|max:255',
            'is_active' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $option->update($validated);

        return redirect()
            ->route('admin.services.options.index', $service)
            ->with('success', 'Service option updated successfully.');
    }

    public function destroy(Service $service, ServiceOption $option)
    {
        $option->delete();

        return redirect()
            ->route('admin.services.options.index', $service)
            ->with('success', 'Service option deleted successfully.');
    }

    public function reorder(Request $request, Service $service)
    {
        $validated = $request->validate([
            'options' => 'required|array',
            'options.*.id' => 'required|exists:service_options,id',
            'options.*.sort_order' => 'required|integer|min:0'
        ]);

        foreach ($validated['options'] as $item) {
            ServiceOption::where('id', $item['id'])
                ->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Options reordered successfully']);
    }
} 