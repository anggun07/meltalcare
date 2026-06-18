<?php

namespace Database\Seeders;

use App\Models\HeartRate;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@meltalcare.test'],
            [
                'name' => 'Administrator',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ],
        );

        $students = [
            ['name' => 'Ahmad Fauzi', 'email' => 'ahmad.fauzi@student.ac.id', 'nim' => '20210001'],
            ['name' => 'Budi Santoso', 'email' => 'budi.santoso@student.ac.id', 'nim' => '20210002'],
            ['name' => 'Citra Dewi', 'email' => 'citra.dewi@student.ac.id', 'nim' => '20210003'],
            ['name' => 'Dian Pratama', 'email' => 'dian.pratama@student.ac.id', 'nim' => '20210004'],
        ];

        foreach ($students as $studentData) {
            $user = User::firstOrCreate(
                ['email' => $studentData['email']],
                [
                    'name' => $studentData['name'],
                    'password' => Hash::make('password'),
                    'role' => 'mahasiswa',
                ],
            );

            $student = Student::firstOrCreate(
                ['nim' => $studentData['nim']],
                [
                    'user_id' => $user->id,
                    'name' => $studentData['name'],
                ],
            );

            if ($student->heartRates()->doesntExist()) {
                foreach ([68, 72, 85, 78, 92, 75, 88, 95] as $index => $bpm) {
                    HeartRate::create([
                        'student_id' => $student->id,
                        'bpm' => $bpm + ($student->id % 3) * 4,
                        'created_at' => now()->subHours(8 - $index),
                        'updated_at' => now()->subHours(8 - $index),
                    ]);
                }
            }
        }

        unset($admin);
    }
}
