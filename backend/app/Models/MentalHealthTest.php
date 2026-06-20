<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MentalHealthTest extends Model
{
    protected $fillable = [
        'student_id',
        'score',
        'max_score',
        'category',
        'answers',
        'tested_at',
    ];

    protected function casts(): array
    {
        return [
            'answers' => 'array',
            'tested_at' => 'datetime',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}
