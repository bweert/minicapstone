<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Customer;
use App\Models\SparePart;
use App\Models\RepairService;
use App\Models\RepairOrder;

class RepairSystemSeeder extends Seeder
{
    public function run(): void
    {
        // Create Customers
        $customers = [
            ['name' => 'John Doe', 'phone' => '09171234567', 'email' => 'john@example.com'],
            ['name' => 'Jane Smith', 'phone' => '09171234568', 'email' => 'jane@example.com'],
            ['name' => 'Bob Johnson', 'phone' => '09171234569', 'email' => 'bob@example.com'],
        ];

        foreach ($customers as $customer) {
            Customer::firstOrCreate(['email' => $customer['email']], $customer);
        }

        // Create Spare Parts (Inventory)
        $parts = [
            ['name' => 'iPhone 14 LCD', 'stock_qty' => 10, 'unit_price' => 3500.00],
            ['name' => 'iPhone 14 Battery', 'stock_qty' => 20, 'unit_price' => 1200.00],
            ['name' => 'Samsung S23 LCD', 'stock_qty' => 8, 'unit_price' => 4000.00],
            ['name' => 'Samsung S23 Battery', 'stock_qty' => 15, 'unit_price' => 1000.00],
            ['name' => 'Charging Port (Universal)', 'stock_qty' => 30, 'unit_price' => 500.00],
            ['name' => 'Earpiece Speaker', 'stock_qty' => 25, 'unit_price' => 300.00],
            ['name' => 'Screws Pack', 'stock_qty' => 100, 'unit_price' => 50.00],
        ];

        foreach ($parts as $part) {
            SparePart::firstOrCreate(['name' => $part['name']], $part);
        }

        // Create Repair Services
        $services = [
            ['name' => 'LCD Replacement', 'base_price' => 500.00],
            ['name' => 'Battery Replacement', 'base_price' => 300.00],
            ['name' => 'Charging Port Repair', 'base_price' => 400.00],
            ['name' => 'Software Repair', 'base_price' => 500.00],
            ['name' => 'Water Damage Repair', 'base_price' => 800.00],
            ['name' => 'Speaker Repair', 'base_price' => 350.00],
        ];

        foreach ($services as $service) {
            RepairService::firstOrCreate(['name' => $service['name']], $service);
        }

        // Create a sample repair order
        $customer = Customer::first();
        $lcdService = RepairService::where('name', 'LCD Replacement')->first();
        $batteryService = RepairService::where('name', 'Battery Replacement')->first();
        $lcdPart = SparePart::where('name', 'iPhone 14 LCD')->first();
        $batteryPart = SparePart::where('name', 'iPhone 14 Battery')->first();

        if ($customer && $lcdService && $lcdPart) {
            $order = RepairOrder::create([
                'customer_id' => $customer->id,
                'status' => 'pending',
                'total_price' => 0,
            ]);

            // Add LCD Replacement service
            $orderService = $order->addService($lcdService);
            $orderService->addPart($lcdPart, 1);

            // Add Battery Replacement service
            if ($batteryService && $batteryPart) {
                $orderService2 = $order->addService($batteryService);
                $orderService2->addPart($batteryPart, 1);
            }

            // Calculate total
            $order->calculateTotalPrice();
        }
    }
}
