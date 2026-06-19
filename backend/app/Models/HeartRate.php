<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeartRate extends Model
{
    protected $fillable = [
        'student_id',
        'bpm'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}