<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    protected $table = 'service';
    
    protected $fillable = [
        'service_name',
        'service_price',
    ];

    protected $casts = [
        'service_price' => 'decimal:2',
    ];

    public function repairParts()
    {
        return $this->belongsToMany(RepairParts::class, 'service_repair_parts', 'service_id', 'repair_part_id')
                    ->withPivot('quantity_needed');
    }

    public function transactions()
    {
        return $this->belongsToMany(Transaction::class, 'transaction_services', 'service_id', 'transaction_id')
                    ->withPivot('service_price');
    }
}
