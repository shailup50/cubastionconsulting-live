<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MilestoneData extends Model
{
    protected $table      = 'mst_milestonedata';
    protected $primaryKey = 'MilestoneID';
    public $timestamps    = false;

    protected $fillable = [
        'Title',
        'Description',
        'MilestoneYear',
        'ActiveStatus',
        'DisplayOrder',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];
}