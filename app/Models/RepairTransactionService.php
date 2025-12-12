<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairTransactionService extends Model
{
    protected $fillable = [
        'repair_transaction_id',
        'repair_service_id',
        'price',
        'notes',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function repair(): BelongsTo
    {
        return $this->belongsTo(RepairTransaction::class, 'repair_transaction_id');
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(RepairService::class, 'repair_service_id');
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
