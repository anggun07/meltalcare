<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MentalHealthTest;
use App\Models\Student;
use Carbon\Carbon;
use Illuminate\Http\Request;

class MentalHealthTestController extends Controller
{
    private const CATEGORIES = ['Tidak Stres', 'Stres Ringan', 'Stres Berat'];

    public function index(Request $request)
    {
        $query = MentalHealthTest::with('student.user')->latest('tested_at');

        if ($request->filled('student_id')) {
            $query->where('student_id', $request->integer('student_id'));
        }

        if ($request->filled('category')) {
            $query->where('category', $request->string('category'));
        }

        if ($request->filled('month')) {
            $query->where('tested_at', 'like', $request->string('month').'%');
        }

        return response()->json(['data' => $query->get()]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => ['required', 'integer', 'exists:students,id'],
            'answers' => ['required', 'array', 'size:10'],
            'answers.*' => ['required', 'integer', 'between:0,3'],
        ]);

        $rawScore = array_sum($validated['answers']);
        $score = (int) round(($rawScore / 30) * 42);
        $category = $this->categoryForScore($score);

        $test = MentalHealthTest::create([
            'student_id' => $validated['student_id'],
            'score' => $score,
            'max_score' => 42,
            'category' => $category,
            'answers' => array_values($validated['answers']),
            'tested_at' => now(),
        ])->load('student.user');

        return response()->json([
            'message' => 'Hasil tes berhasil disimpan',
            'data' => $test,
        ], 201);
    }

    public function show(MentalHealthTest $mentalHealthTest)
    {
        return response()->json([
            'data' => $mentalHealthTest->load('student.user'),
        ]);
    }

    public function byStudent(Student $student)
    {
        return response()->json([
            'data' => $student->mentalHealthTests()->latest('tested_at')->get(),
        ]);
    }

    public function dashboard()
    {
        $jakartaToday = Carbon::now('Asia/Jakarta');
        $todayStart = $jakartaToday->copy()->startOfDay()->utc();
        $todayEnd = $jakartaToday->copy()->endOfDay()->utc();

        $latestTestIds = MentalHealthTest::query()
            ->selectRaw('MAX(id) as id')
            ->groupBy('student_id')
            ->pluck('id');

        $latestCounts = MentalHealthTest::query()
            ->whereIn('id', $latestTestIds)
            ->selectRaw('category, COUNT(*) as total')
            ->groupBy('category')
            ->pluck('total', 'category');

        $distribution = collect(self::CATEGORIES)->map(function (string $category) use ($latestCounts, $latestTestIds) {
            $count = (int) ($latestCounts[$category] ?? 0);
            $total = max($latestTestIds->count(), 1);

            return [
                'category' => $category,
                'count' => $count,
                'percentage' => (int) round(($count / $total) * 100),
            ];
        });

        $monthNames = [1 => 'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        $monthlyTrend = collect(range(6, 0))->map(function (int $monthsAgo) use ($monthNames) {
            $month = Carbon::now()->subMonths($monthsAgo);
            $counts = MentalHealthTest::query()
                ->whereYear('tested_at', $month->year)
                ->whereMonth('tested_at', $month->month)
                ->selectRaw('category, COUNT(*) as total')
                ->groupBy('category')
                ->pluck('total', 'category');

            return [
                'month' => $monthNames[$month->month],
                'tidak_stres' => (int) ($counts['Tidak Stres'] ?? 0),
                'stres_ringan' => (int) ($counts['Stres Ringan'] ?? 0),
                'stres_berat' => (int) ($counts['Stres Berat'] ?? 0),
            ];
        });

        return response()->json([
            'data' => [
                'total_students' => Student::count(),
                'total_tests' => MentalHealthTest::count(),
                'tests_today' => MentalHealthTest::whereBetween('tested_at', [$todayStart, $todayEnd])->count(),
                'tests_this_month' => MentalHealthTest::whereBetween('tested_at', [now()->startOfMonth(), now()->endOfMonth()])->count(),
                'distribution' => $distribution,
                'monthly_trend' => $monthlyTrend,
                'recent_tests' => MentalHealthTest::with('student.user')->latest('tested_at')->limit(6)->get(),
            ],
        ]);
    }

    private function categoryForScore(int $score): string
    {
        if ($score <= 15) {
            return 'Tidak Stres';
        }

        if ($score <= 25) {
            return 'Stres Ringan';
        }

        return 'Stres Berat';
    }
}
