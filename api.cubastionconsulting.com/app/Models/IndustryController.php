<?php



namespace App\Http\Controllers\API;



use App\Http\Controllers\Controller;

use App\Models\IndustryData;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;



class IndustryController extends Controller

{

    public function index(): JsonResponse

    {

        $industries = IndustryData::orderBy('IndustryID', 'desc')->get();

        return response()->json(['status' => true, 'data' => $industries]);

    }



    public function homeIndustries(): JsonResponse

    {

        $industries = IndustryData::where('ActiveStatus', 1)

            ->where('DisplayOnHome', 1)

            ->orderBy('DisplayOrder')

            ->get();

        return response()->json(['status' => true, 'data' => $industries]);

    }



    public function show($id): JsonResponse

    {

        $industry = IndustryData::with(['faqs', 'solutions', 'logos'])->find($id);

        if (!$industry) {

            return response()->json(['status' => false, 'message' => 'Industry not found'], 404);

        }

        return response()->json(['status' => true, 'data' => $industry]);

    }



    public function showByURL($url): JsonResponse

    {

        $industry = IndustryData::with(['faqs', 'solutions', 'logos'])

            ->where('IndustryNameURL', $url)

            ->where('ActiveStatus', 1)

            ->first();

        if (!$industry) {

            return response()->json(['status' => false, 'message' => 'Industry not found'], 404);

        }

        return response()->json(['status' => true, 'data' => $industry]);

    }



    public function store(Request $request): JsonResponse

    {

        $validated = $request->validate([

            'IndustryName'        => 'required',
            'IndustryNameURL'     => 'required',
            'IndustryImage'       => 'required',
            'IndustryBannerImage' => 'required'
        ]);

        $validated['PostedDate'] = now();

        $industry = IndustryData::create($validated);

        return response()->json(['status' => true, 'message' => 'Industry created successfully', 'data' => $industry], 201);

    }



    public function update(Request $request, $id): JsonResponse

    {

        $industry = IndustryData::find($id);

        if (!$industry) {

            return response()->json(['status' => false, 'message' => 'Industry not found'], 404);

        }

        $validated = $request->validate([

            'IndustryName'        => 'sometimes|string|max:255',

            'IndustryNameURL'     => 'sometimes|string|max:255|unique:mst_industrydata,IndustryNameURL,' . $id . ',IndustryID',

            'IndustryImage'       => 'sometimes|string|max:255',

            'IndustryBannerImage' => 'sometimes|string|max:255',

            'DisplayOrder'        => 'sometimes|integer',

            'ActiveStatus'        => 'sometimes|integer',

            'DisplayOnHome'       => 'sometimes|integer',

        ]);

        $validated['UpdatedBy'] = $request->input('UpdatedBy', 'admin');

        $industry->update($validated);

        return response()->json(['status' => true, 'message' => 'Industry updated successfully', 'data' => $industry]);

    }



    public function destroy($id): JsonResponse

    {

        $industry = IndustryData::find($id);

        if (!$industry) {

            return response()->json(['status' => false, 'message' => 'Industry not found'], 404);

        }

        $industry->delete();

        return response()->json(['status' => true, 'message' => 'Industry deleted successfully']);

    }

}