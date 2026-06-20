<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StudentController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => Student::with([
                'user',
                'heartRates' => fn ($query) => $query->latest()->limit(1),
                'mentalHealthTests' => fn ($query) => $query->latest('tested_at')->limit(1),
            ])
                ->withCount('mentalHealthTests')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['nullable', 'string', 'min:6'],
            'nim' => ['required', 'string', 'max:30', 'unique:students,nim'],
        ]);

        $student = DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password'] ?? 'password'),
                'role' => 'mahasiswa',
            ]);

            return Student::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'nim' => $validated['nim'],
            ])->load('user');
        });

        return response()->json([
            'message' => 'Mahasiswa berhasil dibuat',
            'data' => $student,
        ], 201);
    }

    public function show(Student $student)
    {
        return response()->json([
            'data' => $student->load([
                'user',
                'heartRates' => fn ($query) => $query->latest()->limit(20),
                'mentalHealthTests' => fn ($query) => $query->latest('tested_at'),
            ]),
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:users,email,'.$student->user_id],
            'nim' => ['sometimes', 'required', 'string', 'max:30', 'unique:students,nim,'.$student->id],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+() -]+$/'],
            'birth_date' => ['nullable', 'date', 'before:today'],
            'faculty' => ['nullable', 'string', 'max:255'],
            'study_program' => ['nullable', 'string', 'max:255'],
            'semester' => ['nullable', 'integer', 'between:1,14'],
            'address' => ['nullable', 'string', 'max:1000'],
        ], [
            'phone.regex' => 'Format nomor telepon tidak valid.',
            'birth_date.before' => 'Tanggal lahir harus sebelum hari ini.',
            'semester.between' => 'Semester harus antara 1 sampai 14.',
        ]);

        DB::transaction(function () use ($validated, $student) {
            $student->update([
                'name' => $validated['name'] ?? $student->name,
                'nim' => $validated['nim'] ?? $student->nim,
                'phone' => array_key_exists('phone', $validated) ? $validated['phone'] : $student->phone,
                'birth_date' => array_key_exists('birth_date', $validated) ? $validated['birth_date'] : $student->birth_date,
                'faculty' => array_key_exists('faculty', $validated) ? $validated['faculty'] : $student->faculty,
                'study_program' => array_key_exists('study_program', $validated) ? $validated['study_program'] : $student->study_program,
                'semester' => array_key_exists('semester', $validated) ? $validated['semester'] : $student->semester,
                'address' => array_key_exists('address', $validated) ? $validated['address'] : $student->address,
            ]);

            $student->user?->update([
                'name' => $validated['name'] ?? $student->user->name,
                'email' => $validated['email'] ?? $student->user->email,
            ]);
        });

        return response()->json([
            'message' => 'Mahasiswa berhasil diperbarui',
            'data' => $student->refresh()->load('user'),
        ]);
    }

    public function destroy(Student $student)
    {
        $user = $student->user;
        $student->delete();
        $user?->delete();

        return response()->json([
            'message' => 'Mahasiswa berhasil dihapus',
        ]);
    }
}
