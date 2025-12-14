<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'repair_order_id',
        'amount',
        'payment_method',
        'status',
        'refund_amount',
        'refund_reason',
        'refunded_by',
        'refunded_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'refund_amount' => 'decimal:2',
        'refunded_at' => 'datetime',
    ];

    public function repairOrder(): BelongsTo
    {
        return $this->belongsTo(RepairOrder::class);
    }

    public function refundedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'refunded_by');
    }

    /**
     * Mark payment as paid
     */
    public function markAsPaid(): void
    {
        $this->status = 'paid';
        $this->save();
    }

    /**
     * Check if payment can be refunded
     */
    public function canBeRefunded(): bool
    {
        return $this->status === 'paid';
    }

    /**
     * Check if payment is refunded
     */
    public function isRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * Process refund for this payment
     */
    public function processRefund(float $amount, string $reason, int $userId): void
    {
        $this->refund_amount = $amount;
        $this->refund_reason = $reason;
        $this->refunded_by = $userId;
        $this->refunded_at = now();
        $this->status = 'refunded';
        $this->save();
    }
}
