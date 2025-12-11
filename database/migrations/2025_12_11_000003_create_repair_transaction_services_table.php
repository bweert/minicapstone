<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_transaction_services', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_transaction_id')->constrained('repair_transactions')->cascadeOnDelete();
            $table->foreignId('repair_service_id')->constrained('repair_services')->cascadeOnDelete();
            $table->decimal('price', 10, 2);
            $table->text('notes')->nullable();
            $table->enum('status', ['pending', 'in_progress', 'completed'])->default('pending');
            $table->timestamps();
            
            $table->index('repair_transaction_id');
            $table->index('repair_service_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_transaction_services');
    }
};
