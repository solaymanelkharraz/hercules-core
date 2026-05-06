<?php

namespace Database\Seeders;

use App\Models\Zone;
use Illuminate\Database\Seeder;

class ZoneSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Zone::create([
            'name' => "Chute d'Hippolyte",
            'status' => 'open',
            'max_capacity' => 50,
            'current_visitors' => 12,
        ]);

        Zone::create([
            'name' => 'Paintball Achakkar',
            'status' => 'open',
            'max_capacity' => 24,
            'current_visitors' => 8,
        ]);

        Zone::create([
            'name' => 'Tyrolienne Hercules',
            'status' => 'open',
            'max_capacity' => 15,
            'current_visitors' => 4,
        ]);

        Zone::create([
            'name' => 'Circuit Buggy Spartel',
            'status' => 'maintenance',
            'max_capacity' => 10,
            'current_visitors' => 0,
        ]);
    }
}
