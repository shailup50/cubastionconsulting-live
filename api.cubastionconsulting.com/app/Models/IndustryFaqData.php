<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class IndustryFaqData extends Model
{
    protected $table = 'mst_industryfaqdata';
    protected $primaryKey = 'IndustryFaqID';
    public $timestamps = false;

    protected $fillable = [
        'IndustryID',
        'Question',
        'Answer',
    ];

    public function industry()
    {
        return $this->belongsTo(IndustryData::class, 'IndustryID', 'IndustryID');
    }
}