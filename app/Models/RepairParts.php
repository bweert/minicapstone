<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairParts extends Model
{
    protected $table = 'repair_parts';
    
    protected $fillable = [
        'category_id',
        'part_name',
        'price',
        'stock',
    ];

    protected $casts = [
        'price' => 'decimal:2',
    ];

    public function category()
    {
        return $this->belongsTo(RepairPartsCategory::class, 'category_id');
    }

    public function services()
    {
        return $this->belongsToMany(Service::class, 'service_repair_parts', 'repair_part_id', 'service_id')
                    ->withPivot('quantity_needed');
    }
}
