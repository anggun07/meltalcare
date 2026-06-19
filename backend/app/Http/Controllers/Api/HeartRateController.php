<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\HeartRate;
use App\Models\Student;
use Illuminate\Http\Request;

class HeartRateController extends Controller
{
    public function index(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'nullable|exists:students,id',
            'limit' => 'nullable|integer|min:1|max:200',
        ]);

        $heartRates = HeartRate::with('student.user')
            ->when($validated['student_id'] ?? null, fn ($query, $studentId) => $query->where('student_id', $studentId))
            ->latest()
            ->limit($validated['limit'] ?? 50)
            ->get();

        return response()->json([
            'data' => $heartRates,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'bpm' => 'required|integer|min:30|max:220'
        ]);

        $heartRate = HeartRate::create([
            'student_id' => $request->student_id,
            'bpm' => $request->bpm
        ])->load('student.user');

        return response()->json([
            'message' => 'Data berhasil disimpan',
            'data' => $heartRate
        ], 201);
    }

    public function byStudent(Student $student)
    {
        return response()->json([
            'data' => $student->heartRates()
                ->latest()
                ->limit(100)
                ->get(),
        ]);
    }

    public function latest()
    {
        $students = Student::with('user')->get();

        $data = $students->map(function (Student $student) {
            $latestHeartRate = $student->heartRates()->latest()->first();

            return [
                'student' => $student,
                'heart_rate' => $latestHeartRate,
            ];
        });

        return response()->json([
            'data' => $data,
        ]);
    }
}
