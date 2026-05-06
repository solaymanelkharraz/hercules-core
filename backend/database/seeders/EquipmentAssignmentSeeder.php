<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\User;
use App\Models\EquipmentAssignment;
use Illuminate\Database\Seeder;

class EquipmentAssignmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $equipment = Equipment::where('sku_code', 'PBM-001')->first();
        $guide = User::where('role', 'guide')->first();

        if ($equipment && $guide) {
            EquipmentAssignment::create([
                'equipment_id' => $equipment->id,
                'user_id' => $guide->id,
                'assigned_at' => now()->subHours(2),
            ]);
        }
    }
}
