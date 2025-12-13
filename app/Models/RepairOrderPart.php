<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairOrderPart extends Model
{
    protected $fillable = [
        'repair_order_service_id',
        'part_id',
        'quantity',
        'unit_price',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
    ];

    public function repairOrderService(): BelongsTo
    {
        return $this->belongsTo(RepairOrderService::class);
    }

    public function part(): BelongsTo
    {
        return $this->belongsTo(SparePart::class, 'part_id');
    }

    /**
     * Get total cost for this part entry
     */
    public function getTotalCostAttribute(): float
    {
        return $this->quantity * $this->unit_price;
    }
}
