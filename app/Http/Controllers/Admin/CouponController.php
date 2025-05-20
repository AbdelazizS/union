<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class CouponController extends Controller
{
    public function index(Request $request)
    {
        $query = Coupon::query();

        // Apply filters
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where('code', 'like', "%{$search}%");
        }

        if ($request->has('type')) {
            $query->where('type', $request->get('type'));
        }

        if ($request->has('is_active')) {
            $query->where('is_active', $request->get('is_active'));
        }

        // Apply sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Get all coupons without pagination
        $coupons = $query->get();

        return Inertia::render('Admin/Coupons/Index', [
            'coupons' => [
                'data' => $coupons
            ],
            'filters' => $request->all(['search', 'type', 'is_active', 'sort_field', 'sort_direction']),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $this->validateCoupon($request);
        
        try {
            $coupon = Coupon::create($validated);
            return redirect()->back()->with('success', 'Coupon created successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to create coupon'])
                ->withInput();
        }
    }

    public function show(Coupon $coupon)
    {
        return response()->json([
            'coupon' => $coupon->load(['categories', 'services'])
        ]);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $validated = $this->validateCoupon($request, $coupon);
        
        try {
            $coupon->update($validated);
            return redirect()->back()->with('success', 'Coupon updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withErrors(['error' => 'Failed to update coupon'])
                ->withInput();
        }
    }

    public function destroy(Coupon $coupon)
    {
        try {
            $coupon->delete();
            return redirect()->back()->with('success', 'Coupon deleted successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to delete coupon']);
        }
    }

    public function toggleStatus(Coupon $coupon)
    {
        try {
            $coupon->update(['is_active' => !$coupon->is_active]);
            return redirect()->back()->with('success', 'Coupon status updated successfully');
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to update coupon status. Please try again.']);
        }
    }

    protected function validateCoupon(Request $request, ?Coupon $coupon = null)
    {
        $rules = [
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('coupons')->ignore($coupon)->whereNull('deleted_at')
            ],
            'type' => [
                'required',
                'string',
                Rule::in(['percentage', 'fixed'])
            ],
            'discount_value' => [
                'required',
                'numeric',
                'min:0',
                function ($attribute, $value, $fail) use ($request) {
                    if ($request->type === 'percentage' && $value > 100) {
                        $fail('The discount percentage cannot exceed 100%.');
                    }
                }
            ],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'valid_from' => ['nullable', 'date'],
            'valid_until' => ['nullable', 'date', 'after_or_equal:valid_from'],
            'is_active' => ['boolean'],
            'applicable_categories' => ['nullable', 'array'],
            'applicable_services' => ['nullable', 'array'],
        ];

        return $request->validate($rules);
    }
} 