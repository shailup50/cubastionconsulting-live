<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PortfolioData extends Model
{
    protected $table = 'mst_portfoliodata';
    protected $primaryKey = 'PortfolioID';
    public $timestamps = false;

    protected $fillable = [
        'AuthorID',
        'IndustryID',
        'PortfolioType',
        'PortfolioName',
        'PortfolioNameURL',
        'PortfolioTopHeading',
        'PortfolioImage',
        'PortfolioBannerImage',
        'PortfolioReelToReal',
        'PortfolioProblemSolving',
        'PortfolioPowerInnovation',
        'PortfolioAIAndIndustry',
        'DisplayOrder',
        'ActiveStatus',
        'DisplayOnHome',
        'MetaTitle',
        'MetaKeywords',
        'MetaDescriptions',
        'MetaSchema',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];

    // Relationships
    public function author()
    {
        return $this->belongsTo(AuthorData::class, 'AuthorID', 'AuthorID');
    }

    public function industry()
    {
        return $this->belongsTo(IndustryData::class, 'IndustryID', 'IndustryID');
    }

    public function highlights()
    {
        return $this->hasMany(PortfolioHighlightData::class, 'PortfolioID', 'PortfolioID');
    }
}