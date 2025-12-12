<?php

namespace Database\Seeders;

use App\Models\RepairService;
use Illuminate\Database\Seeder;

class RepairServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'name' => 'Screen Replacement',
                'description' => 'Replace broken or damaged screen',
                'base_price' => 1500.00,
            ],
            [
                'name' => 'Battery Replacement',
                'description' => 'Replace device battery',
                'base_price' => 800.00,
            ],
            [
                'name' => 'Charging Port Repair',
                'description' => 'Fix or replace charging port',
                'base_price' => 600.00,
            ],
            [
                'name' => 'Software Repair',
                'description' => 'Fix software issues and OS problems',
                'base_price' => 500.00,
            ],
            [
                'name' => 'Water Damage Repair',
                'description' => 'Repair water-damaged device',
                'base_price' => 2000.00,
            ],
            [
                'name' => 'Button Repair',
                'description' => 'Fix broken physical buttons',
                'base_price' => 400.00,
            ],
            [
                'name' => 'Motherboard Repair',
                'description' => 'Repair or replace motherboard',
                'base_price' => 3000.00,
            ],
            [
                'name' => 'Device Cleaning',
                'description' => 'Clean device internal parts',
                'base_price' => 300.00,
            ],
        ];

        foreach ($services as $service) {
            RepairService::create($service);
        }
    }
}
