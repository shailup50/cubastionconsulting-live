<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PageData extends Model
{
    protected $table = 'mst_pagedata';
    protected $primaryKey = 'StaticPageID';
    public $timestamps = false;

    protected $fillable = [
        'StaticPageName',
        'StaticPageNameURL',
        'StaticPageImage',
        'SmallDescription',
        'Description',
        'ActiveStatus',
        'MetaTitle',
        'MetaKeywords',
        'MetaDescriptions',
        'MetaSchema',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];
}