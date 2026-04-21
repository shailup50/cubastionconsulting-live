<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategoryData extends Model
{
    protected $table = 'mst_categorydata';
    protected $primaryKey = 'CategoryID';
    public $timestamps = false;

    protected $fillable = [
        'CategoryName',
        'DisplayOrder',
        'ActiveStatus',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];

    // Relationships
    public function serviceCategories()
    {
        return $this->hasMany(ServiceCategoryData::class, 'CategoryID', 'CategoryID');
    }

    public function services()
    {
        return $this->belongsToMany(ServiceData::class, 'mst_servicecategorydata', 'CategoryID', 'ServiceID');
    }
}