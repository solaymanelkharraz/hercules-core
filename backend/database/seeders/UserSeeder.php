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
            'password' => Hash::make('password'),
            'role' => 'admin',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Manager Achakkar',
            'email' => 'manager@hercules.ma',
            'password' => Hash::make('password'),
            'role' => 'manager',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Guide Tangier',
            'email' => 'guide@hercules.ma',
            'password' => Hash::make('password'),
            'role' => 'guide',
            'status' => 'active',
        ]);

        User::create([
            'name' => 'Cashier Core',
            'email' => 'cashier@hercules.ma',
            'password' => Hash::make('password'),
            'role' => 'cashier',
            'status' => 'active',
        ]);
    }
}
