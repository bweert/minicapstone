<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_services', function (Blueprint $table) {
            $table->id();
            $table->string('name');              // e.g., LCD Replacement
            $table->decimal('base_price', 10, 2); // service cost without parts
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_services');
    }
};
