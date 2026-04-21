<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceData extends Model
{
    protected $table = 'mst_servicedata';
    protected $primaryKey = 'ServiceID';
    public $timestamps = false;

    protected $fillable = [
        'ServiceName',
        'ServiceNameURL',
        'ServiceImage',
        'ServiceBannerImage',
        'ServiceBannerImage1',
        'ServiceTagLine',
        'ServicePunchline',
        'DescriptionHeading',
        'Description',
        'OtherDescriptionHeading',
        'OtherDescription',
        'DisplayOrder',
        'ActiveStatus',
        'MetaTitle',
        'MetaKeywords',
        'MetaDescriptions',
        'MetaSchema',
        'MetaOgImage',
        'PostedDate',
        'UpdatedBy',
        'UpdatedOn',
    ];

    // Relationships
    public function faqs()
    {
        return $this->hasMany(ServiceFaqData::class, 'ServiceID', 'ServiceID');
    }

    public function categories()
    {
        return $this->belongsToMany(CategoryData::class, 'mst_servicecategorydata', 'ServiceID', 'CategoryID');
    }

    public function serviceCategories()
    {
        return $this->hasMany(ServiceCategoryData::class, 'ServiceID', 'ServiceID');
    }
}