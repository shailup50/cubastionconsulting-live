<?php



namespace App\Models;



use Illuminate\Database\Eloquent\Model;



class IndustryData extends Model

{

    protected $table = 'mst_industrydata';

    protected $primaryKey = 'IndustryID';

    public $timestamps = false;



    protected $fillable = [

        'IndustryName',

        'IndustryNameURL',

        'IndustryImage',

        'IndustryBannerImage',

        'IndustryTagLine',

        'DescriptionHeading',

        'Description',

        'OtherDescription',

        'DisplayOrder',

        'ActiveStatus',

        'DisplayOnHome',

        'MetaTitle',

        'MetaKeywords',

        'MetaDescriptions',

        'MetaSchema',

        'PostedDate',

        'UpdatedBy',

        'UpdatedOn',

    ];



    // Relationships

    public function faqs()

    {

        return $this->hasMany(IndustryFaqData::class, 'IndustryID', 'IndustryID');

    }



    public function solutions()

    {

        return $this->hasMany(IndustrySolutionData::class, 'IndustryID', 'IndustryID');

    }



    public function portfolios()

    {

        return $this->hasMany(PortfolioData::class, 'IndustryID', 'IndustryID');

    }

}