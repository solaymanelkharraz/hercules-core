<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Admin Hercules',
            'email' => 'admin@hercules.ma',
            'phone' => '+212600000001',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Manager Achakkar',
            'email' => 'manager@hercules.ma',
            'phone' => '+212600000002',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Guide Tangier',
            'email' => 'guide@hercules.ma',
            'phone' => '+212600000003',
            'password' => Hash::make('password'),
            'role' => 'guide',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Cashier Core',
            'email' => 'cashier@hercules.ma',
            'phone' => '+212600000004',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'status' => 'active',
        ]);
    }
}
