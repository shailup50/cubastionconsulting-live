<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    protected $table = 'mst_contact_us';
    protected $primaryKey = 'ContactID';
    public $timestamps = false;

    protected $fillable = [
        'FullName',
        'EmailID',
        'PhoneNo',
        'NoOfGuest',
        'Message',
        'EnquiryType',
        'EnquiryFor',
        'PageName',
        'PostedDate',
    ];
}