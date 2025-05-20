<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class SettingController extends Controller
{
    /**
     * Settings categories and their fields
     */
    protected $settingsStructure = [
        'general' => [
            'site_name' => ['type' => 'text', 'rules' => 'required|string|max:255'],
            'site_description' => ['type' => 'textarea', 'rules' => 'required|string|max:1000'],
            'site_logo' => ['type' => 'image', 'rules' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:2048'],
            'favicon' => ['type' => 'image', 'rules' => 'nullable|image|mimes:ico,png|max:1024'],
            'email' => ['type' => 'email', 'rules' => 'required|email'],
            'phone' => ['type' => 'text', 'rules' => 'required|string|max:20'],
            'address' => ['type' => 'textarea', 'rules' => 'required|string|max:500'],
            'working_hours' => ['type' => 'text', 'rules' => 'required|string|max:255'],
            'emergency_phone' => ['type' => 'text', 'rules' => 'nullable|string|max:20'],
            'whatsapp_number' => ['type' => 'text', 'rules' => 'nullable|string|max:20'],
        ],
        'booking' => [
            'min_booking_notice' => ['type' => 'number', 'rules' => 'required|integer|min:0'],
            'max_booking_days_ahead' => ['type' => 'number', 'rules' => 'required|integer|min:1'],
            'booking_time_slot' => ['type' => 'number', 'rules' => 'required|integer|in:30,60,120'],
            'allow_cancellation' => ['type' => 'boolean', 'rules' => 'boolean'],
            'cancellation_deadline_hours' => ['type' => 'number', 'rules' => 'required|integer|min:1'],
            'require_payment' => ['type' => 'boolean', 'rules' => 'boolean'],
            'deposit_percentage' => ['type' => 'number', 'rules' => 'required|integer|min:0|max:100'],
            'weekend_surcharge' => ['type' => 'number', 'rules' => 'nullable|numeric|min:0|max:100'],
            'holiday_surcharge' => ['type' => 'number', 'rules' => 'nullable|numeric|min:0|max:100'],
            'emergency_surcharge' => ['type' => 'number', 'rules' => 'nullable|numeric|min:0|max:100'],
        ],
        'services' => [
            'min_service_duration' => ['type' => 'number', 'rules' => 'required|integer|min:30'],
            'max_service_duration' => ['type' => 'number', 'rules' => 'required|integer|min:60'],
            'service_increment' => ['type' => 'number', 'rules' => 'required|integer|in:15,30,60'],
            'allow_custom_services' => ['type' => 'boolean', 'rules' => 'boolean'],
            'show_prices' => ['type' => 'boolean', 'rules' => 'boolean'],
            'enable_ratings' => ['type' => 'boolean', 'rules' => 'boolean'],
            'enable_reviews' => ['type' => 'boolean', 'rules' => 'boolean'],
            'auto_approve_reviews' => ['type' => 'boolean', 'rules' => 'boolean'],
        ],
        'staff' => [
            'show_staff_profiles' => ['type' => 'boolean', 'rules' => 'boolean'],
            'allow_staff_selection' => ['type' => 'boolean', 'rules' => 'boolean'],
            'staff_commission_percentage' => ['type' => 'number', 'rules' => 'nullable|numeric|min:0|max:100'],
            'enable_staff_schedule' => ['type' => 'boolean', 'rules' => 'boolean'],
            'staff_break_duration' => ['type' => 'number', 'rules' => 'nullable|integer|min:15|max:120'],
            'max_daily_bookings_per_staff' => ['type' => 'number', 'rules' => 'nullable|integer|min:1'],
        ],
        'social' => [
            'facebook_url' => ['type' => 'url', 'rules' => 'nullable|url'],
            'twitter_url' => ['type' => 'url', 'rules' => 'nullable|url'],
            'instagram_url' => ['type' => 'url', 'rules' => 'nullable|url'],
            'linkedin_url' => ['type' => 'url', 'rules' => 'nullable|url'],
            'youtube_url' => ['type' => 'url', 'rules' => 'nullable|url'],
            'tiktok_url' => ['type' => 'url', 'rules' => 'nullable|url'],
            'enable_social_login' => ['type' => 'boolean', 'rules' => 'boolean'],
            'enable_social_sharing' => ['type' => 'boolean', 'rules' => 'boolean'],
        ],
        'notifications' => [
            'admin_email' => ['type' => 'email', 'rules' => 'required|email'],
            'notify_on_booking' => ['type' => 'boolean', 'rules' => 'boolean'],
            'notify_on_cancellation' => ['type' => 'boolean', 'rules' => 'boolean'],
            'notify_before_service' => ['type' => 'boolean', 'rules' => 'boolean'],
            'notification_hours_before' => ['type' => 'number', 'rules' => 'required|integer|min:1'],
            'enable_sms' => ['type' => 'boolean', 'rules' => 'boolean'],
            'sms_provider' => ['type' => 'select', 'rules' => 'required_if:enable_sms,true', 'options' => [
                'twilio' => 'Twilio',
                'nexmo' => 'Nexmo',
                'messagebird' => 'MessageBird',
            ]],
            'enable_push_notifications' => ['type' => 'boolean', 'rules' => 'boolean'],
            'enable_email_queue' => ['type' => 'boolean', 'rules' => 'boolean'],
            'notification_templates' => ['type' => 'select', 'rules' => 'required', 'options' => [
                'default' => 'Default Template',
                'minimal' => 'Minimal Template',
                'branded' => 'Branded Template',
            ]],
        ],
        'seo' => [
            'meta_title' => ['type' => 'text', 'rules' => 'required|string|max:60'],
            'meta_description' => ['type' => 'textarea', 'rules' => 'required|string|max:160'],
            'meta_keywords' => ['type' => 'text', 'rules' => 'nullable|string|max:255'],
            'google_analytics_id' => ['type' => 'text', 'rules' => 'nullable|string|max:50'],
            'enable_sitemap' => ['type' => 'boolean', 'rules' => 'boolean'],
            'robots_txt' => ['type' => 'textarea', 'rules' => 'nullable|string'],
            'canonical_url' => ['type' => 'url', 'rules' => 'nullable|url'],
            'enable_schema_markup' => ['type' => 'boolean', 'rules' => 'boolean'],
            'google_site_verification' => ['type' => 'text', 'rules' => 'nullable|string'],
            'bing_site_verification' => ['type' => 'text', 'rules' => 'nullable|string'],
        ],
        'payment' => [
            'currency' => ['type' => 'select', 'rules' => 'required', 'options' => [
                'USD' => 'US Dollar',
                'EUR' => 'Euro',
                'GBP' => 'British Pound',
                'AUD' => 'Australian Dollar',
                'CAD' => 'Canadian Dollar',
            ]],
            'stripe_enabled' => ['type' => 'boolean', 'rules' => 'boolean'],
            'stripe_key' => ['type' => 'text', 'rules' => 'required_if:stripe_enabled,true'],
            'stripe_secret' => ['type' => 'text', 'rules' => 'required_if:stripe_enabled,true'],
            'paypal_enabled' => ['type' => 'boolean', 'rules' => 'boolean'],
            'paypal_client_id' => ['type' => 'text', 'rules' => 'required_if:paypal_enabled,true'],
            'paypal_secret' => ['type' => 'text', 'rules' => 'required_if:paypal_enabled,true'],
            'tax_percentage' => ['type' => 'number', 'rules' => 'required|numeric|min:0|max:100'],
            'enable_invoicing' => ['type' => 'boolean', 'rules' => 'boolean'],
            'invoice_prefix' => ['type' => 'text', 'rules' => 'nullable|string|max:10'],
            'invoice_footer_text' => ['type' => 'textarea', 'rules' => 'nullable|string'],
        ],
        'security' => [
            'enable_2fa' => ['type' => 'boolean', 'rules' => 'boolean'],
            'password_expiry_days' => ['type' => 'number', 'rules' => 'nullable|integer|min:0'],
            'max_login_attempts' => ['type' => 'number', 'rules' => 'required|integer|min:3'],
            'lockout_duration' => ['type' => 'number', 'rules' => 'required|integer|min:1'],
            'session_lifetime' => ['type' => 'number', 'rules' => 'required|integer|min:1'],
            'enable_ip_blocking' => ['type' => 'boolean', 'rules' => 'boolean'],
            'blocked_ips' => ['type' => 'textarea', 'rules' => 'nullable|string'],
            'allowed_countries' => ['type' => 'textarea', 'rules' => 'nullable|string'],
            'force_ssl' => ['type' => 'boolean', 'rules' => 'boolean'],
            'enable_maintenance_mode' => ['type' => 'boolean', 'rules' => 'boolean'],
        ],
        'localization' => [
            'default_language' => ['type' => 'select', 'rules' => 'required', 'options' => [
                'en' => 'English',
                'es' => 'Spanish',
                'fr' => 'French',
                'de' => 'German',
                'it' => 'Italian',
                'pt' => 'Portuguese',
                'ar' => 'Arabic',
            ]],
            'default_timezone' => ['type' => 'select', 'rules' => 'required', 'options' => [
                'UTC' => 'UTC',
                'America/New_York' => 'Eastern Time',
                'America/Chicago' => 'Central Time',
                'America/Denver' => 'Mountain Time',
                'America/Los_Angeles' => 'Pacific Time',
                'Europe/London' => 'London',
                'Europe/Paris' => 'Paris',
            ]],
            'date_format' => ['type' => 'select', 'rules' => 'required', 'options' => [
                'Y-m-d' => 'YYYY-MM-DD',
                'd/m/Y' => 'DD/MM/YYYY',
                'm/d/Y' => 'MM/DD/YYYY',
                'd.m.Y' => 'DD.MM.YYYY',
            ]],
            'time_format' => ['type' => 'select', 'rules' => 'required', 'options' => [
                'H:i' => '24 Hour',
                'h:i A' => '12 Hour',
            ]],
            'enable_rtl' => ['type' => 'boolean', 'rules' => 'boolean'],
            'first_day_of_week' => ['type' => 'select', 'rules' => 'required', 'options' => [
                '0' => 'Sunday',
                '1' => 'Monday',
            ]],
        ],
    ];

    public function index()
    {
        $settings = Setting::all()->pluck('value', 'key')->toArray();
        
        // Group settings by category
        $groupedSettings = [];
        foreach ($this->settingsStructure as $category => $fields) {
            $groupedSettings[$category] = [];
            foreach ($fields as $key => $config) {
                $groupedSettings[$category][$key] = [
                    'value' => $settings[$key] ?? null,
                    'type' => $config['type'],
                    'options' => $config['options'] ?? null,
                ];
            }
        }

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $groupedSettings,
            'structure' => $this->settingsStructure,
        ]);
    }

    public function update(Request $request)
    {
        $allRules = [];
        foreach ($this->settingsStructure as $category => $fields) {
            foreach ($fields as $key => $config) {
                $allRules[$key] = $config['rules'];
            }
        }

        $validated = $request->validate($allRules);

        foreach ($validated as $key => $value) {
            // Handle file uploads
            if (in_array($this->getFieldType($key), ['image'])) {
                if ($request->hasFile($key)) {
                    // Delete old file if exists
                    $oldSetting = Setting::where('key', $key)->first();
                    if ($oldSetting && $oldSetting->value) {
                        Storage::disk('public')->delete($oldSetting->value);
                    }

                    // Store new file
                    $path = $request->file($key)->store('settings', 'public');
                    $value = Storage::url($path);
                } else {
                    continue; // Skip if no new file uploaded
                }
            }

            Setting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Clear settings cache
        Cache::forget('settings');

        return redirect()->back()->with('success', 'Settings updated successfully.');
    }

    protected function getFieldType($key)
    {
        foreach ($this->settingsStructure as $category => $fields) {
            if (isset($fields[$key])) {
                return $fields[$key]['type'];
            }
        }
        return 'text';
    }

    public function export()
    {
        $settings = Setting::all()->map(function ($setting) {
            return [
                'key' => $setting->key,
                'value' => $setting->value,
            ];
        });

        $filename = 'settings-' . now()->format('Y-m-d-His') . '.json';
        
        return response()->json($settings)
            ->header('Content-Disposition', 'attachment; filename=' . $filename)
            ->header('Content-Type', 'application/json');
    }

    public function import(Request $request)
    {
        $request->validate([
            'settings' => 'required|file|mimes:json|max:2048'
        ]);

        try {
            $content = json_decode(file_get_contents($request->file('settings')), true);

            if (!is_array($content)) {
                throw new \Exception('Invalid settings file format');
            }

            \DB::beginTransaction();

            foreach ($content as $setting) {
                if (!isset($setting['key']) || !array_key_exists('value', $setting)) {
                    continue;
                }

                // Validate the setting key exists in our structure
                $found = false;
                foreach ($this->settingsStructure as $category => $fields) {
                    if (array_key_exists($setting['key'], $fields)) {
                        $found = true;
                        break;
                    }
                }

                if (!$found) {
                    continue;
                }

                Setting::updateOrCreate(
                    ['key' => $setting['key']],
                    ['value' => $setting['value']]
                );
            }

            \DB::commit();
            Cache::forget('settings');

            return response()->json(['message' => 'Settings imported successfully']);
        } catch (\Exception $e) {
            \DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
} 