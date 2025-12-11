<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_used_parts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_transaction_id')->constrained('repair_transactions')->cascadeOnDelete();
            $table->foreignId('product_id')->constrained('products')->cascadeOnDelete();
            $table->integer('quantity');
            $table->decimal('cost', 10, 2);
            $table->boolean('is_reversible')->default(true);
            $table->enum('reversal_status', ['not_reversed', 'reversed', 'waste'])->default('not_reversed');
            $table->timestamps();
            
            $table->index('repair_transaction_id');
            $table->index('product_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_used_parts');
    }
};
