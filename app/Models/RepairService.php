<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RepairService extends Model
{
    protected $fillable = [
        'name',
        'description',
        'base_price',
    ];

    protected $casts = [
        'base_price' => 'decimal:2',
    ];

    public function transactionServices()
    {
        return $this->hasMany(RepairTransactionService::class, 'repair_service_id');
    }
}
