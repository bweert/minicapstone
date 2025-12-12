<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refund', function (Blueprint $table) {
            $table->id();
            $table->foreignId('transaction_id')->constrained('transaction')->onDelete('cascade');
            $table->decimal('refund_amount', 10, 2)->nullable();
            $table->text('reason')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refund');
    }
};
