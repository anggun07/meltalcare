<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MentalHealthTest;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;

class AdminSettingsController extends Controller
{
    public function show(User $user)
    {
        $this->ensureAdmin($user);

        return response()->json([
            'data' => $user->adminSettings()->firstOrCreate()->refresh(),
        ]);
    }

    public function update(User $user, Request $request)
    {
        $this->ensureAdmin($user);

        $validated = $request->validate([
            'institution_name' => ['required', 'string', 'max:255'],
            'new_student_notification' => ['required', 'boolean'],
            'critical_alert' => ['required', 'boolean'],
            'system_update_notification' => ['required', 'boolean'],
            'daily_report' => ['required', 'boolean'],
        ]);

        $settings = $user->adminSettings()->updateOrCreate([], $validated);

        return response()->json([
            'message' => 'Pengaturan admin berhasil disimpan.',
            'data' => $settings,
        ]);
    }

    public function backup(User $user)
    {
        $this->ensureAdmin($user);
        $settings = $user->adminSettings()->firstOrCreate();
        $settings->update(['last_backup_at' => now()]);

        return response()->json([
            'filename' => 'backup-meltalcare-'.now()->format('Ymd-His').'.json',
            'created_at' => $settings->last_backup_at,
            'data' => [
                'users' => User::with(['student', 'adminProfile'])->get(),
                'students' => Student::with('mentalHealthTests')->get(),
                'mental_health_tests' => MentalHealthTest::with('student.user')->get(),
            ],
        ]);
    }

    public function export(User $user)
    {
        $this->ensureAdmin($user);
        $handle = fopen('php://temp', 'r+');
        fputcsv($handle, ['Tanggal Tes', 'NIM', 'Nama Mahasiswa', 'Email', 'Skor', 'Skor Maksimal', 'Kategori']);

        MentalHealthTest::with('student.user')->latest('tested_at')->each(function (MentalHealthTest $test) use ($handle) {
            fputcsv($handle, [
                $test->tested_at?->format('Y-m-d H:i:s'),
                $test->student?->nim,
                $test->student?->name,
                $test->student?->user?->email,
                $test->score,
                $test->max_score,
                $test->category,
            ]);
        });

        rewind($handle);
        $csv = stream_get_contents($handle);
        fclose($handle);

        return response()->json([
            'filename' => 'hasil-tes-meltalcare-'.now()->format('Ymd-His').'.csv',
            'content' => $csv,
        ]);
    }

    private function ensureAdmin(User $user): void
    {
        abort_unless($user->role === 'admin', 404, 'Pengaturan admin tidak ditemukan.');
    }
}
