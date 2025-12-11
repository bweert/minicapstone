<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_status_history', function (Blueprint $table) {
            $table->id();
            $table->foreignId('repair_transaction_id')->constrained('repair_transactions')->cascadeOnDelete();
            $table->string('old_status')->nullable();
            $table->string('new_status');
            $table->foreignId('changed_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            $table->index('repair_transaction_id');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_status_history');
    }
};
