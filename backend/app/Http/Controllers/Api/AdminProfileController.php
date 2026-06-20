<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminProfileController extends Controller
{
    public function show(User $user)
    {
        $this->ensureAdmin($user);
        $user->adminProfile()->firstOrCreate();

        return response()->json(['data' => $this->profileData($user->refresh())]);
    }

    public function update(User $user, Request $request)
    {
        $this->ensureAdmin($user);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['nullable', 'string', 'max:20', 'regex:/^[0-9+() -]+$/'],
            'department' => ['nullable', 'string', 'max:255'],
        ], [
            'email.unique' => 'Email sudah digunakan oleh akun lain.',
            'phone.regex' => 'Format nomor telepon tidak valid.',
        ]);

        DB::transaction(function () use ($user, $validated) {
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            $user->adminProfile()->updateOrCreate([], [
                'phone' => $validated['phone'] ?? null,
                'department' => $validated['department'] ?? null,
            ]);
        });

        return response()->json([
            'message' => 'Profil admin berhasil disimpan.',
            'data' => $this->profileData($user->refresh()),
        ]);
    }

    private function ensureAdmin(User $user): void
    {
        abort_unless($user->role === 'admin', 404, 'Profil admin tidak ditemukan.');
    }

    private function profileData(User $user): array
    {
        $user->load('adminProfile');

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'phone' => $user->adminProfile?->phone,
            'department' => $user->adminProfile?->department,
            'joined_at' => $user->created_at,
        ];
    }
}
