<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Transaction extends Model
{
    protected $fillable = [
        'reference_number',
        'subtotal',
        'tax',
        'discount',
        'total',
        'payment_method',
        'amount_received',
        'change',
        'gcash_reference',
        'completed_at',
        'status',
        'total_refunded',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'tax' => 'decimal:2',
        'discount' => 'decimal:2',
        'total' => 'decimal:2',
        'amount_received' => 'decimal:2',
        'change' => 'decimal:2',
        'total_refunded' => 'decimal:2',
        'completed_at' => 'datetime',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(TransactionItem::class);
    }

    public function refundedItems(): HasMany
    {
        return $this->hasMany(RefundedItem::class);
    }

    public static function generateReferenceNumber(): string
    {
        return 'TRX-' . date('YmdHis') . '-' . random_int(1000, 9999);
    }

    /**
     * Check if transaction can be refunded
     */
    public function canBeRefunded(): bool
    {
        return $this->status !== 'refunded';
    }

    /**
     * Check if transaction is fully refunded
     */
    public function isFullyRefunded(): bool
    {
        return $this->status === 'refunded';
    }

    /**
     * Check if transaction is partially refunded
     */
    public function isPartiallyRefunded(): bool
    {
        return $this->status === 'partially_refunded';
    }

    /**
     * Get refundable amount
     */
    public function getRefundableAmount(): float
    {
        return (float) $this->total - (float) $this->total_refunded;
    }

    /**
     * Update transaction status based on refunded amount
     */
    public function updateRefundStatus(): void
    {
        $this->refresh();
        
        if ((float) $this->total_refunded >= (float) $this->total) {
            $this->status = 'refunded';
        } elseif ((float) $this->total_refunded > 0) {
            $this->status = 'partially_refunded';
        } else {
            $this->status = 'completed';
        }
        
        $this->save();
    }
}
