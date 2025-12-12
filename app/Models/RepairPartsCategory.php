<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairPartsCategory extends Model
{
    protected $table = 'repair_parts_category';
    
    protected $fillable = [
        'category_name',
    ];

    public function repairParts()
    {
        return $this->hasMany(RepairParts::class, 'category_id');
    }
}
