<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class FaqController extends Controller
{
    public function index()
    {
        $faqs = Faq::orderBy('sort_order')->get();
        
        return Inertia::render('Admin/Faqs/Index', [
            'faqs' => $faqs,
            'categories' => Faq::getCategories(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'category' => 'required|string',
            'question' => 'required|string|min:5',
            'answer' => 'required|string|min:10',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ])->validate();

        Faq::create($validated);

        return redirect()->back()->with('success', 'FAQ created successfully.');
    }

    public function update(Request $request, Faq $faq)
    {
        $validated = Validator::make($request->all(), [
            'category' => 'required|string',
            'question' => 'required|string|min:5',
            'answer' => 'required|string|min:10',
            'sort_order' => 'required|integer|min:0',
            'is_active' => 'boolean',
        ])->validate();

        $faq->update($validated);

        return redirect()->back()->with('success', 'FAQ updated successfully.');
    }

    public function destroy(Faq $faq)
    {
        $faq->delete();
        return redirect()->back()->with('success', 'FAQ deleted successfully.');
    }

    public function toggleActive(Faq $faq)
    {
        $faq->update([
            'is_active' => !$faq->is_active
        ]);

        return redirect()->back()->with('success', 'FAQ status updated successfully.');
    }

    public function updateOrder(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.id' => 'required|exists:faqs,id',
            'items.*.sort_order' => 'required|integer|min:0',
        ])->validate();

        foreach ($validated['items'] as $item) {
            Faq::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return response()->json(['message' => 'Order updated successfully']);
    }
} 