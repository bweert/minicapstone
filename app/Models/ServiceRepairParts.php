<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceRepairParts extends Model
{
    protected $table = 'service_repair_parts';
    
    protected $fillable = [
        'service_id',
        'repair_part_id',
        'quantity_needed',
    ];

    public function service()
    {
        return $this->belongsTo(Service::class);
    }

    public function repairPart()
    {
        return $this->belongsTo(RepairParts::class, 'repair_part_id');
    }
}
