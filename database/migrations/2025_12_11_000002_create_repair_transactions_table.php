<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('customer_id')->constrained('users')->cascadeOnDelete();
            $table->decimal('total_price', 10, 2);
            $table->enum('status', ['pending', 'in_progress', 'quality_check', 'completed', 'claimed', 'cancelled'])->default('pending');
            $table->text('notes')->nullable();
            $table->timestamp('cancelled_at')->nullable();
            $table->string('cancellation_reason')->nullable();
            $table->enum('refund_status', ['none', 'pending', 'completed', 'failed'])->default('none');
            $table->timestamp('pickup_date')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('customer_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_transactions');
    }
};
