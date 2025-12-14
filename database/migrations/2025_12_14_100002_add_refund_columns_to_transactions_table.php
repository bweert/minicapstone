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
        Schema::table('transactions', function (Blueprint $table) {
            if (!Schema::hasColumn('transactions', 'status')) {
                $table->enum('status', ['completed', 'partial_refund', 'refunded'])->default('completed')->after('payment_method');
            }
            if (!Schema::hasColumn('transactions', 'total_refunded')) {
                $table->decimal('total_refunded', 10, 2)->default(0)->after('payment_method');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            if (Schema::hasColumn('transactions', 'status')) {
                $table->dropColumn('status');
            }
            if (Schema::hasColumn('transactions', 'total_refunded')) {
                $table->dropColumn('total_refunded');
            }
        });
    }
};
