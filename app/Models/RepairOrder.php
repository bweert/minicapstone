<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RepairOrder extends Model
{
    protected $fillable = [
        'customer_id',
        'status',
        'total_price',
    ];

    protected $casts = [
        'total_price' => 'decimal:2',
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function services(): HasMany
    {
        return $this->hasMany(RepairOrderService::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Calculate and update total price from services and parts
     */
    public function calculateTotalPrice(): void
    {
        $servicesTotal = $this->services()->sum('service_price');
        
        $partsTotal = 0;
        foreach ($this->services as $service) {
            $partsTotal += $service->parts()->sum(\DB::raw('quantity * unit_price'));
        }
        
        $this->total_price = $servicesTotal + $partsTotal;
        $this->save();
    }

    /**
     * Add a service to this order
     */
    public function addService(RepairService $service, ?float $price = null): RepairOrderService
    {
        return $this->services()->create([
            'service_id' => $service->id,
            'service_price' => $price ?? $service->base_price,
        ]);
    }
}
