<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceCategoryData extends Model
{
    protected $table = 'mst_servicecategorydata';
    protected $primaryKey = 'ServiceCategoryID';
    public $timestamps = false;

    protected $fillable = [
        'ServiceID',
        'CategoryID',
    ];

    public function service()
    {
        return $this->belongsTo(ServiceData::class, 'ServiceID', 'ServiceID');
    }

    public function category()
    {
        return $this->belongsTo(CategoryData::class, 'CategoryID', 'CategoryID');
    }
}