<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('refunded_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transactions')->cascadeOnDelete();
            $table->foreignId('transaction_item_id')->constrained('transaction_items')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('quantity_refunded');
            $table->decimal('refund_amount', 10, 2);
            $table->string('reason')->nullable();
            $table->foreignId('refunded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('refunded_at')->useCurrent();
            $table->timestamps();

            // Index for quick lookups
            $table->index(['transaction_id', 'transaction_item_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('refunded_items');
    }
};
