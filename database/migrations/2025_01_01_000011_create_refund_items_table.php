<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refund_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('refund_id')->constrained('refund')->onDelete('cascade');
            $table->foreignId('service_id')->nullable()->constrained('service')->onDelete('set null');
            $table->foreignId('repair_part_id')->nullable()->constrained('repair_parts')->onDelete('set null');
            $table->integer('quantity')->nullable();
            $table->decimal('amount', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refund_items');
    }
};
