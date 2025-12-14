<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransactionItem extends Model
{
    protected $fillable = [
        'transaction_id',
        'product_id',
        'quantity',
        'price',
        'subtotal',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function transaction(): BelongsTo
    {
        return $this->belongsTo(Transaction::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function refundedItems(): HasMany
    {
        return $this->hasMany(RefundedItem::class);
    }

    /**
     * Get total quantity refunded for this item
     */
    public function getRefundedQuantity(): int
    {
        return $this->refundedItems()->sum('quantity_refunded');
    }

    /**
     * Get available quantity that can still be refunded
     */
    public function getRefundableQuantity(): int
    {
        return $this->quantity - $this->getRefundedQuantity();
    }

    /**
     * Check if item can be refunded
     */
    public function canBeRefunded(): bool
    {
        return $this->getRefundableQuantity() > 0;
    }
}
