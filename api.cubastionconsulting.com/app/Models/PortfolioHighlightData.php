<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioHighlightData extends Model
{
    protected $table = 'mst_portfoliohighlightdata';
    protected $primaryKey = 'PortfolioHighlightID';
    public $timestamps = false;

    protected $fillable = [
        'PortfolioID',
        'Question',
    ];

    public function portfolio()
    {
        return $this->belongsTo(PortfolioData::class, 'PortfolioID', 'PortfolioID');
    }
}