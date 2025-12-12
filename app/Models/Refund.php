<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Refund extends Model
{
    protected $table = 'refund';
    
    protected $fillable = [
        'transaction_id',
        'refund_amount',
        'reason',
    ];

    protected $casts = [
        'refund_amount' => 'decimal:2',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function refundItems()
    {
        return $this->hasMany(RefundItems::class, 'refund_id');
    }
}
