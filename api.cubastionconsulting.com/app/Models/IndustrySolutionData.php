<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndustrySolutionData extends Model
{
    protected $table = 'mst_industrysolutiondata';
    protected $primaryKey = 'IndustrySolutionID';
    public $timestamps = false;

    protected $fillable = [
        'IndustryID',
        'IndustrySolutionHeading',
        'IndustrySolutionTagline',
        'IndustrySolutionImage',
    ];

    public function industry()
    {
        return $this->belongsTo(IndustryData::class, 'IndustryID', 'IndustryID');
    }
}