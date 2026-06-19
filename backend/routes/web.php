<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response('Meltalcare backend aktif');
});
