<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RefundPayment extends Model
{
    protected $fillable = [
        'repair_transaction_id',
        'original_payment_id',
        'refund_amount',
        'refund_reason',
        'refund_method',
        'status',
        'processed_by',
        'processed_at',
    ];

    protected $casts = [
        'refund_amount' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    public function repair(): BelongsTo
    {
        return $this->belongsTo(RepairTransaction::class, 'repair_transaction_id');
    }

    public function originalPayment(): BelongsTo
    {
        return $this->belongsTo(RepairPayment::class, 'original_payment_id');
    }

    public function processedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }
}
