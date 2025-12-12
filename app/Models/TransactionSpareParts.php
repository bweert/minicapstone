<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionSpareParts extends Model
{
    protected $table = 'transaction_spare_parts';
    
    protected $fillable = [
        'transaction_id',
        'repair_part_id',
        'quantity',
        'price',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function repairPart()
    {
        return $this->belongsTo(RepairParts::class, 'repair_part_id');
    }
}
