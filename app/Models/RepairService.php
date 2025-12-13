<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairService extends Model
{
    protected $fillable = [
        'name',
        'base_price',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
    ];

    public function repairOrderServices(): HasMany
    {
        return $this->hasMany(RepairOrderService::class, 'service_id');
    }
}
