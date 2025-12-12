<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    protected $table = 'status';
    
    protected $fillable = [
        'status_name',
    ];

    public function transactions()
    {
        return $this->hasMany(Transaction::class, 'status_id');
    }
}
