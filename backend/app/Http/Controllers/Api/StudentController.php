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
            'data' => Student::with(['user', 'heartRates' => fn ($query) => $query->latest()->limit(1)])
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
            'data' => $student->load(['user', 'heartRates' => fn ($query) => $query->latest()->limit(20)]),
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'email' => ['sometimes', 'required', 'email', 'max:255', 'unique:users,email,'.$student->user_id],
            'nim' => ['sometimes', 'required', 'string', 'max:30', 'unique:students,nim,'.$student->id],
        ]);

        DB::transaction(function () use ($validated, $student) {
            $student->update([
                'name' => $validated['name'] ?? $student->name,
                'nim' => $validated['nim'] ?? $student->nim,
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
