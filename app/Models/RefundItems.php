<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RefundItems extends Model
{
    protected $table = 'refund_items';
    
    protected $fillable = [
        'refund_id',
        'service_id',
        'repair_part_id',
        'quantity',
        'amount',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    public function refund()
    {
        return $this->belongsTo(Refund::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function repairPart()
    {
        return $this->belongsTo(RepairParts::class, 'repair_part_id');
    }
}
