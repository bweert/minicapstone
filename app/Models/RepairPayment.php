<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairPayment extends Model
{
    protected $fillable = [
        'repair_transaction_id',
        'amount',
        'method',
        'status',
        'payment_reference',
        'paid_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'paid_at' => 'datetime',
    ];

    public function repair(): BelongsTo
    {
        return $this->belongsTo(RepairTransaction::class, 'repair_transaction_id');
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
