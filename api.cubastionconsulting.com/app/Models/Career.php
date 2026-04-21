<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    protected $table      = 'mst_career';
    protected $primaryKey = 'CareerID';
    public $timestamps    = false;

    protected $fillable = [
        'FullName',
        'Email',
        'PhoneNo',
        'Country',
        'City',
        'LinkedInLink',
        'Resume',
        'Message',
        'PostedDate',
    ];
}