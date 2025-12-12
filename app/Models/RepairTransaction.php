<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairTransaction extends Model
{
    protected $fillable = [
        'customer_id',
        'total_price',
        'status',
        'notes',
        'cancelled_at',
        'cancellation_reason',
        'refund_status',
        'pickup_date',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
        'cancelled_at' => 'datetime',
        'pickup_date' => 'datetime',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function services(): HasMany
    {
        return $this->hasMany(RepairTransactionService::class);
    }

    public function usedParts(): HasMany
    {
        return $this->hasMany(RepairUsedPart::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(RepairPayment::class);
    }

    public function refundPayment()
    {
        return $this->hasOne(RefundPayment::class);
    }

    public function statusHistory(): HasMany
    {
        return $this->hasMany(RepairStatusHistory::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeInProgress($query)
    {
        return $query->where('status', 'in_progress');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeClaimed($query)
    {
        return $query->where('status', 'claimed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }
}
