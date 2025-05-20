<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PartnerController extends Controller
{
    public function index()
    {
        $partners = Partner::orderBy('name')->get();
        
        return Inertia::render('Admin/Partners/Index', [
            'partners' => $partners,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'logo' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        // Generate slug
        $slug = Str::slug($validated['name']);
        $baseSlug = $slug;
        $counter = 1;

        // Ensure unique slug
        while (Partner::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('partners', 'public');
            $validated['logo_path'] = Storage::url($path);
        }

        // Create partner
        Partner::create([
            'name' => $validated['name'],
            'slug' => $slug,
            'logo_path' => $validated['logo_path'],
        ]);

        return redirect()->back()->with('success', 'Partner created successfully.');
    }

    public function update(Request $request, Partner $partner)
    {
        $validated = $request->validate([
            'name' => 'required|string|min:2|max:255',
            'logo' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:5120', // 5MB max
        ]);

        // Generate new slug only if name changed
        if ($partner->name !== $validated['name']) {
            $slug = Str::slug($validated['name']);
            $baseSlug = $slug;
            $counter = 1;

            while (Partner::where('slug', $slug)
                ->where('id', '!=', $partner->id)
                ->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }

            $validated['slug'] = $slug;
        }

        // Handle logo upload
        if ($request->hasFile('logo')) {
            // Delete old logo if exists
            if ($partner->logo_path) {
                $oldPath = str_replace('/storage/', '', $partner->logo_path);
                Storage::disk('public')->delete($oldPath);
            }

            // Store new logo
            $path = $request->file('logo')->store('partners', 'public');
            $validated['logo_path'] = Storage::url($path);
        }

        // Update partner
        $partner->update($validated);

        return redirect()->back()->with('success', 'Partner updated successfully.');
    }

    public function destroy(Partner $partner)
    {
        // Delete logo file if exists
        if ($partner->logo_path) {
            $path = str_replace('/storage/', '', $partner->logo_path);
            Storage::disk('public')->delete($path);
        }

        $partner->delete();

        return redirect()->back()->with('success', 'Partner deleted successfully.');
    }
} 