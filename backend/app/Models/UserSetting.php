<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $fillable = [
        'user_id',
        'test_reminder',
        'stress_alert',
    ];

    protected function casts(): array
    {
        return [
            'test_reminder' => 'boolean',
            'stress_alert' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
