<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get($key, $default = null)
    {
        $value = Cache::rememberForever('setting.' . $key, function () use ($key) {
            return static::where('key', $key)->value('value');
        });

        return $value ?? $default;
    }

    /**
     * Set a setting value
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public static function set($key, $value)
    {
        static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );

        Cache::forget('setting.' . $key);
    }

    /**
     * Get all settings as key-value pairs
     *
     * @return array
     */
    public static function getAllSettings()
    {
        return Cache::rememberForever('settings.all', function () {
            return static::pluck('value', 'key')->toArray();
        });
    }

    /**
     * Clear all settings cache
     *
     * @return void
     */
    public static function clearCache()
    {
        Cache::forget('settings.all');
        
        // Clear individual setting caches
        $settings = static::all();
        foreach ($settings as $setting) {
            Cache::forget('setting.' . $setting->key);
        }
    }

    protected static function boot()
    {
        parent::boot();

        static::saved(function ($setting) {
            static::clearCache();
        });

        static::deleted(function ($setting) {
            static::clearCache();
        });
    }
} 