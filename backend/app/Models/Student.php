<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    protected $fillable = [
        'user_id',
        'nim',
        'name'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function heartRates()
    {
        return $this->hasMany(HeartRate::class);
    }
}