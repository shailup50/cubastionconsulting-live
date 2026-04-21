<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\AuthorController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\ContactUsController;
use App\Http\Controllers\API\IndustryController;
use App\Http\Controllers\API\IndustryFaqController;
use App\Http\Controllers\API\IndustrySolutionController;
use App\Http\Controllers\API\LogoController;
use App\Http\Controllers\API\PageController;
use App\Http\Controllers\API\PortfolioController;
use App\Http\Controllers\API\PortfolioHighlightController;
use App\Http\Controllers\API\ServiceController;
use App\Http\Controllers\API\ServiceFaqController;
use App\Http\Controllers\API\ServiceCategoryController;
use App\Http\Controllers\API\TestimonialController;
use App\Http\Controllers\API\MilestoneController;
use App\Http\Controllers\API\TeamController;
use App\Http\Controllers\API\CareerController;
use App\Http\Controllers\API\CareerApplicationController;

/*
|--------------------------------------------------------------------------
| CubastionWeb API Routes
| Base URL: /api/v1/
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {

    // ─── AUTH ────────────────────────────────────────────
    Route::post('auth/login',  [AuthController::class, 'login']);
    Route::post('auth/logout', [AuthController::class, 'logout']);

    // ─── AUTHORS ─────────────────────────────────────────
    Route::get('authors',      [AuthorController::class, 'index']);
    Route::get('authors/{id}', [AuthorController::class, 'show']);
    Route::post('authors',     [AuthorController::class, 'store']);
    Route::put('authors/{id}', [AuthorController::class, 'update']);
    Route::delete('authors/{id}', [AuthorController::class, 'destroy']);

    // ─── CATEGORIES ─────────────────────────────────────
    Route::get('categories',      [CategoryController::class, 'index']);
    Route::get('categories/{id}', [CategoryController::class, 'show']);
    Route::post('categories',     [CategoryController::class, 'store']);
    Route::put('categories/{id}', [CategoryController::class, 'update']);
    Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

    // ─── INDUSTRIES ─────────────────────────────────────
    Route::get('industries',           [IndustryController::class, 'index']);
    Route::get('industries/home',      [IndustryController::class, 'homeIndustries']);
    Route::get('industries/url/{url}', [IndustryController::class, 'showByURL']);
    Route::get('industries/{id}',      [IndustryController::class, 'show']);
    Route::post('industries',          [IndustryController::class, 'store']);
    Route::put('industries/{id}',      [IndustryController::class, 'update']);
    Route::delete('industries/{id}',   [IndustryController::class, 'destroy']);

    // ─── INDUSTRY FAQ ───────────────────────────────────
    Route::get('industry-faqs', [IndustryFaqController::class, 'index']);
    Route::get('industry-faqs/by-industry/{industryId}', [IndustryFaqController::class, 'byIndustry']);
    Route::get('industry-faqs/{id}', [IndustryFaqController::class, 'show']);
    Route::post('industry-faqs', [IndustryFaqController::class, 'store']);
    Route::put('industry-faqs/{id}', [IndustryFaqController::class, 'update']);
    Route::delete('industry-faqs/by-industry/{industryId}', [IndustryFaqController::class, 'deleteByIndustry']);

    // ─── INDUSTRY SOLUTIONS ─────────────────────────────
    Route::get('industry-solutions', [IndustrySolutionController::class, 'index']);
    Route::get('industry-solutions/by-industry/{industryId}', [IndustrySolutionController::class, 'byIndustry']);
    Route::get('industry-solutions/{id}', [IndustrySolutionController::class, 'show']);
    Route::post('industry-solutions', [IndustrySolutionController::class, 'store']);
    Route::put('industry-solutions/{id}', [IndustrySolutionController::class, 'update']);
    Route::delete('industry-solutions/by-industry/{industryId}', [IndustrySolutionController::class, 'deleteByIndustry']);

    // ─── LOGOS ─────────────────────────────────────────
    Route::get('logos', [LogoController::class, 'index']);
    Route::get('logos/home', [LogoController::class, 'homeLogos']);
    Route::get('logos/url/{url}', [LogoController::class, 'showByURL']);
    Route::get('logos/type/{type}', [LogoController::class, 'byType']);
    Route::get('logos/by-industry/{id}', [LogoController::class, 'byIndustry']);
    Route::get('logos/{id}', [LogoController::class, 'show']);
    Route::post('logos', [LogoController::class, 'store']);
    Route::put('logos/{id}', [LogoController::class, 'update']);
    Route::delete('logos/{id}', [LogoController::class, 'destroy']);

    // ─── PAGES ─────────────────────────────────────────
    Route::get('pages', [PageController::class, 'index']);
    Route::get('pages/url/{url}', [PageController::class, 'showByURL']);
    Route::get('pages/{id}', [PageController::class, 'show']);
    Route::post('pages', [PageController::class, 'store']);
    Route::put('pages/{id}', [PageController::class, 'update']);
    Route::delete('pages/{id}', [PageController::class, 'destroy']);

    // ─── PORTFOLIOS ────────────────────────────────────
    Route::get('portfolios', [PortfolioController::class, 'index']);
    Route::get('portfolios/home', [PortfolioController::class, 'homePortfolios']);
    Route::get('portfolios/url/{url}', [PortfolioController::class, 'showByURL']);
    Route::get('portfolios/type/{type}', [PortfolioController::class, 'byType']);
    Route::get('portfolios/by-industry/{id}', [PortfolioController::class, 'byIndustry']);
    Route::get('portfolios/{id}', [PortfolioController::class, 'show']);
    Route::post('portfolios', [PortfolioController::class, 'store']);
    Route::put('portfolios/{id}', [PortfolioController::class, 'update']);
    Route::delete('portfolios/{id}', [PortfolioController::class, 'destroy']);

    // ─── PORTFOLIO HIGHLIGHTS ──────────────────────────
    Route::get('portfolio-highlights', [PortfolioHighlightController::class, 'index']);
    Route::get('portfolio-highlights/by-portfolio/{portfolioId}', [PortfolioHighlightController::class, 'byPortfolio']);
    Route::get('portfolio-highlights/{id}', [PortfolioHighlightController::class, 'show']);
    Route::post('portfolio-highlights', [PortfolioHighlightController::class, 'store']);
    Route::put('portfolio-highlights/{id}', [PortfolioHighlightController::class, 'update']);
    Route::delete('portfolio-highlights/{id}', [PortfolioHighlightController::class, 'destroy']);

    // ─── SERVICES ──────────────────────────────────────
    Route::get('services', [ServiceController::class, 'index']);
    Route::get('services/url/{url}', [ServiceController::class, 'showByURL']);
    Route::get('services/{id}', [ServiceController::class, 'show']);
    Route::post('services', [ServiceController::class, 'store']);
    Route::put('services/{id}', [ServiceController::class, 'update']);
    Route::delete('services/{id}', [ServiceController::class, 'destroy']);

    // ─── SERVICE FAQ ───────────────────────────────────
    Route::get('service-faqs', [ServiceFaqController::class, 'index']);
    Route::get('service-faqs/by-service/{serviceId}', [ServiceFaqController::class, 'byService']);
    Route::get('service-faqs/{id}', [ServiceFaqController::class, 'show']);
    Route::post('service-faqs', [ServiceFaqController::class, 'store']);
    Route::put('service-faqs/{id}', [ServiceFaqController::class, 'update']);
    Route::delete('service-faqs/{id}', [ServiceFaqController::class, 'destroy']);

    // ─── SERVICE CATEGORY ───────────────────────────────────
    Route::get('service-categories', [ServiceCategoryController::class, 'index']);
    Route::get('service-categories/{serviceId}', [ServiceCategoryController::class, 'byService']);
    Route::post('service-categories',                          [ServiceCategoryController::class, 'store']);
    Route::post('service-categories/bulk',                     [ServiceCategoryController::class, 'bulkStore']);
    Route::put('service-categories/{id}',                      [ServiceCategoryController::class, 'update']);
    Route::delete('service-categories/{id}',                   [ServiceCategoryController::class, 'destroy']);
    Route::delete('service-categories/by-service/{serviceId}', [ServiceCategoryController::class, 'destroyByService']);

    // ─── TESTIMONIALS ──────────────────────────────────
    Route::get('testimonials', [TestimonialController::class, 'index']);
    Route::get('testimonials/{id}', [TestimonialController::class, 'show']);
    Route::post('testimonials', [TestimonialController::class, 'store']);
    Route::put('testimonials/{id}', [TestimonialController::class, 'update']);
    Route::delete('testimonials/{id}', [TestimonialController::class, 'destroy']);

    // ─── MILESTONES ────────────────────────────────────
    Route::get('milestones', [MilestoneController::class, 'index']);
    Route::get('milestones/{id}', [MilestoneController::class, 'show']);
    Route::post('milestones', [MilestoneController::class, 'store']);
    Route::put('milestones/{id}', [MilestoneController::class, 'update']);
    Route::delete('milestones/{id}', [MilestoneController::class, 'destroy']);

    // ─── TEAM ──────────────────────────────────────────
    Route::get('teams', [TeamController::class, 'index']);
    Route::get('teams/by-type/{type}', [TeamController::class, 'byType']);
    Route::get('teams/{id}', [TeamController::class, 'show']);
    Route::post('teams', [TeamController::class, 'store']);
    Route::put('teams/{id}', [TeamController::class, 'update']);
    Route::delete('teams/{id}', [TeamController::class, 'destroy']);

    // ─── CONTACT US ────────────────────────────────────
    Route::post('contact-us', [ContactUsController::class, 'store']);
    Route::get('contact-us', [ContactUsController::class, 'index']);
    Route::get('contact-us/{id}', [ContactUsController::class, 'show']);
    Route::delete('contact-us/{id}', [ContactUsController::class, 'destroy']);

    // ─── CAREERS ────────────────────────────────────
    Route::get('/careers', [CareerController::class, 'index']);
    Route::get('/careers/{id}', [CareerController::class, 'show']);
    Route::post('/careers', [CareerController::class, 'store']);
    Route::put('/careers/{id}', [CareerController::class, 'update']);
    Route::delete('/careers/{id}', [CareerController::class, 'destroy']);
    Route::get('/careers/url/{CareerNameURL}', [CareerController::class, 'showbyUrl']);

    // Career Applications
    Route::post('career-applications', [CareerApplicationController::class, 'store']);
    Route::get('career-applications',        [CareerApplicationController::class, 'index']);
    Route::get('career-applications/{id}',   [CareerApplicationController::class, 'show']);
    Route::delete('career-applications/{id}',[CareerApplicationController::class, 'destroy']);
    
    
    // ─── Front API ────────────────────────────────────
    Route::get('pages-meta/{id}', [PageController::class, 'metadata']);

    Route::get('header-data', [PageController::class, 'allheaderactivedata']);
    Route::get('home-data', [PageController::class, 'allhomeactivedata']);
    Route::get('about-us-data', [PageController::class, 'allaboutactivedata']);
    
});