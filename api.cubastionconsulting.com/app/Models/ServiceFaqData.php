<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ServiceFaqData extends Model
{
    protected $table = 'mst_servicefaqdata';
    protected $primaryKey = 'ServiceFaqID';
    public $timestamps = false;

    protected $fillable = [
        'ServiceID',
        'Question',
        'Answer',
    ];

    public function service()
    {
        return $this->belongsTo(ServiceData::class, 'ServiceID', 'ServiceID');
    }
}