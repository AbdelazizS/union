<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class TestimonialController extends Controller
{
    public function index()
    {
        $testimonials = Testimonial::latest()->get();
        
        return Inertia::render('Admin/Testimonials/Index', [
            'testimonials' => $testimonials
        ]);
    }

    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_approved' => 'boolean',
            'service_id' => 'nullable|exists:services,id',
        ])->validate();

        Testimonial::create($validated);

        return redirect()->back()->with('success', 'Testimonial created successfully.');
    }

    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = Validator::make($request->all(), [
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'required|email|max:255',
            'comment' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
            'is_featured' => 'boolean',
            'is_approved' => 'boolean',
            'service_id' => 'nullable|exists:services,id',
        ])->validate();

        $testimonial->update($validated);

        return redirect()->back()->with('success', 'Testimonial updated successfully.');
    }

    public function destroy(Testimonial $testimonial)
    {
        $testimonial->delete();
        return redirect()->back()->with('success', 'Testimonial deleted successfully.');
    }

    public function toggleFeatured(Testimonial $testimonial)
    {
        $testimonial->update([
            'is_featured' => !$testimonial->is_featured
        ]);

        return redirect()->back()->with('success', 'Testimonial featured status updated successfully.');
    }

    public function toggleApproved(Testimonial $testimonial)
    {
        $testimonial->update([
            'is_approved' => !$testimonial->is_approved
        ]);

        return redirect()->back()->with('success', 'Testimonial approval status updated successfully.');
    }
} 