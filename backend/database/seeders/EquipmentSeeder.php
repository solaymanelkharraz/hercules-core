<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Zone;
use Illuminate\Database\Seeder;

class EquipmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $tyrolienne = Zone::where('name', 'Tyrolienne Hercules')->first();
        $paintball = Zone::where('name', 'Paintball Achakkar')->first();
        $buggy = Zone::where('name', 'Circuit Buggy Spartel')->first();

        // Tyrolienne Equipment
        Equipment::create([
            'sku_code' => 'HRN-001',
            'name' => 'Safety Harness Pro',
            'category' => 'harness',
            'zone_id' => $tyrolienne->id,
            'status' => 'available',
            'last_inspection_date' => now()->subDays(10),
        ]);

        Equipment::create([
            'sku_code' => 'HLM-001',
            'name' => 'Mountain Helmet X',
            'category' => 'helmet',
            'zone_id' => $tyrolienne->id,
            'status' => 'available',
            'last_inspection_date' => now()->subDays(5),
        ]);

        // Paintball Equipment
        Equipment::create([
            'sku_code' => 'PBM-001',
            'name' => 'Tippmann FT-12',
            'category' => 'paintball_marker',
            'zone_id' => $paintball->id,
            'status' => 'in_use',
            'last_inspection_date' => now()->subDays(2),
        ]);

        // Buggy Equipment
        Equipment::create([
            'sku_code' => 'BGY-001',
            'name' => 'Polaris RZR',
            'category' => 'buggy',
            'zone_id' => $buggy->id,
            'status' => 'needs_inspection',
            'last_inspection_date' => now()->subMonths(3),
        ]);
    }
}
