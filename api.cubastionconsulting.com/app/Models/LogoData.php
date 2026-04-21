<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogoData extends Model
{
    protected $table = 'mst_logodata';
    protected $primaryKey = 'LogoID';
    public $timestamps = false;

    protected $fillable = [
        'LogoName',
        'LogoNameURL',
        'LogoImage1',
        'DisplayOrder',
        'ActiveStatus',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];
}