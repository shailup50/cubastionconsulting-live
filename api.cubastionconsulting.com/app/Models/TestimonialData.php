<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TestimonialData extends Model
{
    protected $table = 'mst_testimonialdata';
    protected $primaryKey = 'TestimonialID';
    public $timestamps = false;

    protected $fillable = [
        'TestimonialName',
        'TestimonialImage',
        'TestimonialLogo',
        'TestimonialVideo',
        'TestimonialDescription',
        'DisplayOrder',
        'ActiveStatus',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];
}