<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SparePart extends Model
{
    protected $fillable = [
        'name',
        'stock_qty',
        'unit_price',
    ];

    protected $casts = [
        'unit_price' => 'decimal:2',
    ];

    public function repairOrderParts(): HasMany
    {
        return $this->hasMany(RepairOrderPart::class, 'part_id');
    }

    /**
     * Deduct stock quantity
     */
    public function deductStock(int $quantity): bool
    {
        if ($this->stock_qty < $quantity) {
            return false;
        }
        $this->stock_qty -= $quantity;
        $this->save();
        return true;
    }

    /**
     * Add stock quantity
     */
    public function addStock(int $quantity): void
    {
        $this->stock_qty += $quantity;
        $this->save();
    }
}
