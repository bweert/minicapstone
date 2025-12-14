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
        Schema::table('payments', function (Blueprint $table) {
            // Change status enum to include refunded
            $table->dropColumn('status');
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->enum('status', ['paid', 'pending', 'refunded'])->default('pending')->after('payment_method');
            $table->decimal('refund_amount', 10, 2)->nullable()->after('status');
            $table->string('refund_reason')->nullable()->after('refund_amount');
            $table->foreignId('refunded_by')->nullable()->constrained('users')->nullOnDelete()->after('refund_reason');
            $table->timestamp('refunded_at')->nullable()->after('refunded_by');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            $table->dropForeign(['refunded_by']);
            $table->dropColumn(['refund_amount', 'refund_reason', 'refunded_by', 'refunded_at', 'status']);
        });

        Schema::table('payments', function (Blueprint $table) {
            $table->enum('status', ['paid', 'pending'])->default('pending')->after('payment_method');
        });
    }
};
