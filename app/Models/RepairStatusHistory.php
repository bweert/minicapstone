<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RepairStatusHistory extends Model
{
    protected $table = 'repair_status_history';
    
    protected $fillable = [
        'repair_transaction_id',
        'old_status',
        'new_status',
        'changed_by',
        'notes',
    ];

    public function repair(): BelongsTo
    {
        return $this->belongsTo(RepairTransaction::class, 'repair_transaction_id');
    }

    public function changedByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'changed_by');
    }
}
