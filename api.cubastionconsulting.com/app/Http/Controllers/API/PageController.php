<?php
namespace App\Http\Controllers\API;
use App\Http\Controllers\Controller;
use App\Models\PageData;
use App\Models\LogoData;
use App\Models\IndustryData;
use App\Models\PortfolioData;
use App\Models\ServiceData;
use App\Models\TestimonialData;
use App\Models\CategoryData;
use App\Models\TeamData;
use App\Models\MilestoneData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
class PageController extends Controller
{
    public function index(): JsonResponse
    {
        $pages = PageData::orderBy('StaticPageID', 'desc')->get();
        return response()->json(['status' => true, 'data' => $pages]);
    }

    public function show($id): JsonResponse
    {
        $page = PageData::find($id);
        if (!$page) {
            return response()->json(['status' => false, 'message' => 'Page not found'], 404);
        }
        return response()->json(['status' => true, 'data' => $page]);
    }

    public function showByURL($url): JsonResponse
    {
        $page = PageData::where('StaticPageNameURL', $url)
            ->where('ActiveStatus', 1)
            ->first();
        if (!$page) {
            return response()->json(['status' => false, 'message' => 'Page not found'], 404);
        }
        return response()->json(['status' => true, 'data' => $page]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'StaticPageName'    => 'required|string|max:255',
            'StaticPageNameURL' => 'nullable|string|max:255|unique:mst_pagedata,StaticPageNameURL',
            'StaticPageImage'   => 'nullable|string|max:255',
            'SmallDescription'  => 'nullable|string|max:5000',
            'Description'       => 'nullable|string',
            'ActiveStatus'      => 'required|integer',
            'MetaTitle'         => 'nullable|string|max:255',
            'MetaKeywords'      => 'nullable|string|max:500',
            'MetaDescriptions'  => 'nullable|string|max:2000',
            'MetaSchema'        => 'nullable|string',
        ]);
        $page = PageData::create($validated);
        return response()->json(['status' => true, 'message' => 'Page created successfully', 'data' => $page], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $page = PageData::find($id);
        if (!$page) {
            return response()->json(['status' => false, 'message' => 'Page not found'], 404);
        }
        $validated = $request->validate([
            'StaticPageName'    => 'sometimes|string|max:255',
            'StaticPageNameURL' => 'sometimes|string|max:255|unique:mst_pagedata,StaticPageNameURL,' . $id . ',StaticPageID',
            'StaticPageImage'   => 'nullable|string|max:255',
            'SmallDescription'  => 'nullable|string|max:5000',
            'Description'       => 'nullable|string',
            'ActiveStatus'      => 'sometimes|integer',
            'MetaTitle'         => 'nullable|string|max:255',
            'MetaKeywords'      => 'nullable|string|max:500',
            'MetaDescriptions'  => 'nullable|string|max:2000',
            'MetaSchema'        => 'nullable|string',
        ]);
        $validated['UpdatedBy'] = $request->input('UpdatedBy', 'admin');
        $page->update($validated);
        return response()->json(['status' => true, 'message' => 'Page updated successfully', 'data' => $page]);
    }

    public function destroy($id): JsonResponse
    {
        $page = PageData::find($id);
        if (!$page) {
            return response()->json(['status' => false, 'message' => 'Page not found'], 404);
        }
        $page->delete();
        return response()->json(['status' => true, 'message' => 'Page deleted successfully']);
    }

    public function metadata($id): JsonResponse
    {
        $page = PageData::find($id);
        if (!$page) {
            return response()->json(['status' => false, 'message' => 'Page not found'], 404);
        }
        return response()->json(['status' => true, 'data' => $page]);
    }

    public function allhomeactivedata(): JsonResponse
    {
        try {

            $categorys = CategoryData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('CategoryName', 'CategoryType')
                ->get();

            $industries = IndustryData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('IndustryName', 'IndustryNameURL', 'IndustryImage', 'IndustryTagLine', 'Description')
                ->get();

            $logos = LogoData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('LogoName', 'LogoNameURL', 'LogoImage1')
                ->get();

            $blogs = PortfolioData::where('ActiveStatus', 1)
                ->where('PortfolioType', 'CaseStudy')
                ->orderBy('DisplayOrder', 'asc')
                ->select('PortfolioName', 'PortfolioNameURL', 'PortfolioImage', 'PortfolioTopHeading')
                ->get();

            $testimonials = TestimonialData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('TestimonialName', 'TestimonialImage', 'TestimonialLogo', 'TestimonialVideo', 'TestimonialDescription')
                ->get();

             $Awardlogos = LogoData::where('ActiveStatus', 0)
                ->orderBy('DisplayOrder', 'asc')
                ->select('LogoName', 'LogoNameURL', 'LogoImage1')
                ->get();

            return response()->json([
                'status' => true,
                'data' => [
                    'industries'   => $industries,
                    'logos'        => $logos,
                    'blogs'        => $blogs,
                    'testimonials' => $testimonials,
                    'awardlogos' => $Awardlogos
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch home data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function allaboutactivedata(): JsonResponse
    {
        try {
            
            $teams = TeamData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('TeamName', 'TeamDesignation', 'TeamBio', 'TeamImage', 'TeamLinkedInLink')
                ->get();

            $milestones = MilestoneData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('MilestoneYear', 'Title', 'Description')
                ->get();

            return response()->json([
                'status' => true,
                'data' => [
                    'teams'   => $teams,
                    'milestones'  => $milestones
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch home data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function allheaderactivedata(): JsonResponse
    {
        try {

            $industries = IndustryData::where('ActiveStatus', 1)
                ->with('solutions')
                ->orderBy('DisplayOrder', 'asc')
                ->select('IndustryID', 'IndustryName', 'IndustryNameURL') // add primary key
                ->get();

            $service = ServiceData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('ServiceName')
                ->get();

            $logos = LogoData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('LogoName', 'LogoNameURL', 'LogoImage1')
                ->get();

            return response()->json([
                'status' => true,
                'data' => [
                    'industries'   => $industries,
                    'service'  => $service,
                    'logos'  => $logos
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch home data',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}