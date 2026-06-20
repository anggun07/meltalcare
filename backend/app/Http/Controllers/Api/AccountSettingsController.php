<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AccountSettingsController extends Controller
{
    public function show(User $user)
    {
        $settings = $user->settings()->firstOrCreate()->refresh();

        return response()->json(['data' => $settings]);
    }

    public function update(User $user, Request $request)
    {
        $validated = $request->validate([
            'test_reminder' => ['required', 'boolean'],
            'stress_alert' => ['required', 'boolean'],
        ]);

        $settings = $user->settings()->updateOrCreate([], $validated);

        return response()->json([
            'message' => 'Pengaturan berhasil disimpan.',
            'data' => $settings,
        ]);
    }

    public function updatePassword(User $user, Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:6', 'confirmed'],
        ], [
            'password.min' => 'Password baru minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password baru tidak sama.',
        ]);

        if (! Hash::check($validated['current_password'], $user->password)) {
            return response()->json(['message' => 'Password lama tidak sesuai.'], 422);
        }

        $user->update(['password' => $validated['password']]);

        return response()->json(['message' => 'Password berhasil diperbarui.']);
    }
}
