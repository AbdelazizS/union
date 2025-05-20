<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('service_id')->constrained()->onDelete('restrict');
            $table->foreignId('coupon_id')->nullable()->constrained()->onDelete('set null');
            $table->string('booking_number')->unique();
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->text('customer_address');
            $table->datetime('booking_date');
            $table->integer('duration_hours');
            $table->decimal('base_amount', 10, 2);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->decimal('frequency_discount', 10, 2)->default(0);
            $table->decimal('bulk_discount', 10, 2)->default(0);
            $table->decimal('coupon_discount', 10, 2)->default(0);
            $table->decimal('special_period_adjustment', 10, 2)->default(0);
            $table->decimal('final_amount', 10, 2);
            $table->string('status')->default('pending');
            $table->text('notes')->nullable();
            $table->json('additional_services')->nullable();
            $table->string('frequency')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
}; 