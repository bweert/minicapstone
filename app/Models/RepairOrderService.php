<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairOrderService extends Model
{
    protected $fillable = [
        'repair_order_id',
        'service_id',
        'service_price',
    ];

    protected $casts = [
        'service_price' => 'decimal:2',
    ];

    public function repairOrder(): BelongsTo
    {
        return $this->belongsTo(RepairOrder::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(RepairService::class, 'service_id');
    }

    public function parts(): HasMany
    {
        return $this->hasMany(RepairOrderPart::class);
    }

    /**
     * Add a part to this service and deduct from inventory
     */
    public function addPart(SparePart $part, int $quantity, ?float $unitPrice = null): ?RepairOrderPart
    {
        // Deduct from inventory
        if (!$part->deductStock($quantity)) {
            return null; // Not enough stock
        }

        return $this->parts()->create([
            'part_id' => $part->id,
            'quantity' => $quantity,
            'unit_price' => $unitPrice ?? $part->unit_price,
        ]);
    }

    /**
     * Get total parts cost for this service
     */
    public function getPartsTotalAttribute(): float
    {
        return $this->parts()->sum(\DB::raw('quantity * unit_price'));
    }
}
