<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('phone', 20)->nullable()->after('name');
            $table->date('birth_date')->nullable()->after('phone');
            $table->string('faculty')->nullable()->after('birth_date');
            $table->string('study_program')->nullable()->after('faculty');
            $table->unsignedTinyInteger('semester')->nullable()->after('study_program');
            $table->text('address')->nullable()->after('semester');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'phone',
                'birth_date',
                'faculty',
                'study_program',
                'semester',
                'address',
            ]);
        });
    }
};
