<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('mental_health_tests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->unsignedTinyInteger('score');
            $table->unsignedTinyInteger('max_score')->default(42);
            $table->string('category', 30);
            $table->json('answers')->nullable();
            $table->timestamp('tested_at');
            $table->timestamps();

            $table->index(['student_id', 'tested_at']);
            $table->index(['category', 'tested_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('mental_health_tests');
    }
};
