<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refund_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_transaction_id')->constrained('repair_transactions')->cascadeOnDelete();
            $table->foreignId('original_payment_id')->nullable()->constrained('repair_payments')->cascadeOnDelete();
            $table->decimal('refund_amount', 10, 2);
            $table->string('refund_reason')->nullable();
            $table->enum('refund_method', ['cash', 'card', 'gcash'])->default('cash');
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending');
            $table->foreignId('processed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            
            $table->index('repair_transaction_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refund_payments');
    }
};
