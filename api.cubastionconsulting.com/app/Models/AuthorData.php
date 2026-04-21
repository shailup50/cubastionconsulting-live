<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AuthorData extends Model
{
    protected $table = 'mst_authordata';
    protected $primaryKey = 'AuthorID';
    public $timestamps = false;

    protected $fillable = [
        'AuthorName',
        'AuthorTaglin',
        'AuthorImage',
        'DisplayOrder',
        'ActiveStatus',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];

    // Relationships
    public function portfolios()
    {
        return $this->hasMany(PortfolioData::class, 'AuthorID', 'AuthorID');
    }
}