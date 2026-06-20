<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'nim',
        'name',
        'phone',
        'birth_date',
        'faculty',
        'study_program',
        'semester',
        'address',
    ];

    protected function casts(): array
    {
        return [
            'birth_date' => 'date:Y-m-d',
            'semester' => 'integer',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function heartRates()
    {
        return $this->hasMany(HeartRate::class);
    }

    public function mentalHealthTests()
    {
        return $this->hasMany(MentalHealthTest::class);
    }
}
