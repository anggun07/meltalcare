<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:6'],
            'role' => ['nullable', Rule::in(['admin', 'mahasiswa'])],
            'nim' => ['required_if:role,mahasiswa', 'nullable', 'string', 'max:30', 'unique:students,nim'],
        ]);

        $role = $validated['role'] ?? 'mahasiswa';

        $user = DB::transaction(function () use ($validated, $role) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $role,
            ]);

            if ($role === 'mahasiswa') {
                Student::create([
                    'user_id' => $user->id,
                    'name' => $validated['name'],
                    'nim' => $validated['nim'],
                ]);
            }

            return $user->load('student');
        });

        return response()->json([
            'message' => 'Registrasi berhasil',
            'data' => $user,
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
            'role' => ['required', Rule::in(['admin', 'mahasiswa'])],
        ]);

        $user = User::with('student')
            ->where('email', $validated['email'])
            ->where('role', $validated['role'])
            ->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Email, password, atau role tidak sesuai',
            ], 401);
        }

        return response()->json([
            'message' => 'Login berhasil',
            'data' => $user,
        ]);
    }
}
