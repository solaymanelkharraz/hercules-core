<?php

namespace Database\Seeders;

use App\Models\IncidentReport;
use App\Models\User;
use App\Models\Zone;
use App\Models\Equipment;
use Illuminate\Database\Seeder;

class IncidentReportSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $guide = User::where('role', 'guide')->first();
        $zone = Zone::where('name', 'Circuit Buggy Spartel')->first();
        $equipment = Equipment::where('sku_code', 'BGY-001')->first();

        IncidentReport::create([
            'user_id' => $guide->id,
            'zone_id' => $zone->id,
            'equipment_id' => $equipment->id,
            'severity_level' => 'low',
            'description' => 'Minor oil leak detected on the buggy engine.',
            'status' => 'investigating',
        ]);

        IncidentReport::create([
            'user_id' => $guide->id,
            'zone_id' => $zone->id,
            'severity_level' => 'low',
            'description' => 'Broken fence near the entrance of the buggy circuit.',
            'status' => 'reported',
        ]);
    }
}
