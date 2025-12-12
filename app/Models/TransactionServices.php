<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransactionServices extends Model
{
    protected $table = 'transaction_services';
    
    protected $fillable = [
        'transaction_id',
        'service_id',
        'service_price',
    ];

    protected $casts = [
        'service_price' => 'decimal:2',
    ];

    public function transaction()
    {
        return $this->belongsTo(Transaction::class);
    }

    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}
