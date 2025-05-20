<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class ServiceController extends Controller
{
    public function index()
    {
        $services = Service::with('category')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'slug' => $service->slug,
                    'description' => $service->description,
                    'base_price' => $service->base_price,
                    'duration_minutes' => $service->duration_minutes,
                    'features' => $service->features,
                    'is_active' => $service->is_active,
                    'image_url' => $service->image_url,
                    'category' => $service->category ? [
                        'id' => $service->category->id,
                        'name' => $service->category->name,
                    ] : null,
                    'created_at' => $service->created_at,
                    'updated_at' => $service->updated_at,
                ];
            });

        $categories = ServiceCategory::where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                ];
            });

        return Inertia::render('Admin/Services/Index', [
            'services' => $services,
            'categories' => $categories,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255', Rule::unique('services')],
            'category_id' => ['required', 'exists:service_categories,id'],
            'description' => ['required', 'string', 'min:10'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        try {
            if ($request->has('image') && $request->image) {
                $imageData = $request->image;
                if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                    $type = strtolower($type[1]);

                    if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                        throw new \Exception('Invalid image type');
                    }

                    $imageData = base64_decode($imageData);

                    if ($imageData === false) {
                        throw new \Exception('Base64 decode failed');
                    }

                    $fileName = 'services/' . uniqid() . '.' . $type;
                    Storage::disk('public')->put($fileName, $imageData);
                    $validated['image'] = $fileName;
                }
            }

            Service::create($validated);

            return redirect()->back()->with('success', 'Service created successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to create service. Please try again.']);
        }
    }

    public function update(Request $request, Service $service)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'min:2', 'max:255', Rule::unique('services')->ignore($service->id)],
            'category_id' => ['required', 'exists:service_categories,id'],
            'description' => ['required', 'string', 'min:10'],
            'base_price' => ['required', 'numeric', 'min:0'],
            'duration_minutes' => ['required', 'integer', 'min:1'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:255'],
            'is_active' => ['boolean'],
            'image' => ['nullable', 'string'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        try {
            if ($request->has('image') && $request->image) {
                $imageData = $request->image;
                
                // Check if it's a base64 image
                if (preg_match('/^data:image\/(\w+);base64,/', $imageData, $type)) {
                    $imageData = substr($imageData, strpos($imageData, ',') + 1);
                    $type = strtolower($type[1]);

                    // Accept more image types
                    $allowedTypes = ['jpg', 'jpeg', 'gif', 'png', 'svg', 'webp', 'bmp', 'tiff', 'ico'];
                    if (!in_array($type, $allowedTypes)) {
                        throw new \Exception('Invalid image type. Allowed types: ' . implode(', ', $allowedTypes));
                    }

                    $imageData = base64_decode($imageData);

                    if ($imageData === false) {
                        throw new \Exception('Base64 decode failed');
                    }

                    // Delete old image if exists
                    if ($service->image && Storage::disk('public')->exists($service->image)) {
                        Storage::disk('public')->delete($service->image);
                    }

                    $fileName = 'services/' . uniqid() . '.' . $type;
                    Storage::disk('public')->put($fileName, $imageData);
                    $validated['image'] = $fileName;
                } else {
                    // If it's not a base64 image, keep the existing image
                    unset($validated['image']);
                }
            } else {
                // If no image is provided, keep the existing image
                unset($validated['image']);
            }

            $service->update($validated);

            return redirect()->back()->with('success', 'Service updated successfully.');
        } catch (\Exception $e) {
            \Log::error('Service update error: ' . $e->getMessage());
            return redirect()->back()->withErrors(['error' => 'Failed to update service: ' . $e->getMessage()]);
        }
    }

    public function destroy(Service $service)
    {
        try {
            // Check if service can be deleted (add your business logic here)
            if ($service->bookings()->exists()) {
                return redirect()->back()->withErrors(['error' => 'Cannot delete service with existing bookings.']);
            }

            $service->delete();

            return redirect()->back()->with('success', 'Service deleted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete service. Please try again.']);
        }
    }

    public function toggleStatus(Service $service)
    {
        try {
            $service->update(['is_active' => !$service->is_active]);

            return redirect()->back()->with('success', 'Service status updated successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update service status. Please try again.']);
        }
    }
} 