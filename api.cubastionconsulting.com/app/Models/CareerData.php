<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CareerData extends Model
{
    protected $table = 'mst_careerdata';
    protected $primaryKey = 'CareerID';
    public $timestamps = false;

    protected $fillable = [
        'JobCategoryName',
        'CareerName',
        'CareerNameURL',
        'CareerPosition',
        'CareerLocation',
        'CareerImage',
        'CareerBannerImage',
        'Description',
        'DisplayOrder',
        'ActiveStatus',
        'MetaTitle',
        'MetaKeywords',
        'MetaDescriptions',
        'MetaSchema',
        'PostedDate',
        'UpdatedBy'
    ];
}