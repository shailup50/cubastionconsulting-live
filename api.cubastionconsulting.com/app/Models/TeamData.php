<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TeamData extends Model
{
    protected $table      = 'mst_teamdata';
    protected $primaryKey = 'TeamID';
    public $timestamps    = false;

    protected $fillable = [
        'TeamName',
        'TeamDesignation',
        'TeamBio',
        'TeamImage',
        'TeamType',
        'ActiveStatus',
        'DisplayOrder',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];
}