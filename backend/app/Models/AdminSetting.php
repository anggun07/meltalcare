<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminSetting extends Model
{
    protected $fillable = [
        'user_id',
        'institution_name',
        'new_student_notification',
        'critical_alert',
        'system_update_notification',
        'daily_report',
        'last_backup_at',
    ];

    protected function casts(): array
    {
        return [
            'new_student_notification' => 'boolean',
            'critical_alert' => 'boolean',
            'system_update_notification' => 'boolean',
            'daily_report' => 'boolean',
            'last_backup_at' => 'datetime',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
