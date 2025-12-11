<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairUsedPart extends Model
{
    protected $fillable = [
        'repair_transaction_id',
        'product_id',
        'quantity',
        'cost',
        'is_reversible',
        'reversal_status',
    ];

    protected $casts = [
        'cost' => 'decimal:2',
        'is_reversible' => 'boolean',
    ];

    public function repair(): BelongsTo
    {
        return $this->belongsTo(RepairTransaction::class, 'repair_transaction_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeReversible($query)
    {
        return $query->where('is_reversible', true);
    }

    public function scopeNotReversed($query)
    {
        return $query->where('reversal_status', 'not_reversed');
    }
}
