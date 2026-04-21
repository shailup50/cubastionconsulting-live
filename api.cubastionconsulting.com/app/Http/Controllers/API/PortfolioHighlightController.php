<?php



namespace App\Http\Controllers\API;



use App\Http\Controllers\Controller;

use App\Models\PortfolioHighlightData;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;


class PortfolioHighlightController extends Controller

{

    public function index(): JsonResponse

    {

        $highlights = PortfolioHighlightData::with('portfolio')->get();

        return response()->json(['status' => true, 'data' => $highlights]);

    }



    public function byPortfolio($portfolioId): JsonResponse

    {

        $highlights = PortfolioHighlightData::where('PortfolioID', $portfolioId)->get();

        return response()->json(['status' => true, 'data' => $highlights]);

    }



    public function show($id): JsonResponse

    {

        $highlight = PortfolioHighlightData::find($id);

        if (!$highlight) {

            return response()->json(['status' => false, 'message' => 'Highlight not found'], 404);

        }

        return response()->json(['status' => true, 'data' => $highlight]);

    }




    public function store(Request $request): JsonResponse
    {
        try {

            // ✅ Validate only PortfolioID
            $validator = Validator::make($request->all(), [
                'PortfolioID' => 'required|integer|exists:mst_portfoliodata,PortfolioID'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $portfolioId = $request->PortfolioID;

            // 🔥 STEP 1: DELETE OLD HIGHLIGHTS
            PortfolioHighlightData::where('PortfolioID', $portfolioId)->delete();

            // ✅ SAFE INPUT (like FAQ)
            $highlights = $request->input('Highlights', []);

            $insertData = [];

            foreach ($highlights as $highlight) {

                // ✅ Skip empty
                if (empty(trim($highlight['Question'] ?? ''))) {
                    continue;
                }

                $insertData[] = [
                    'PortfolioID' => $portfolioId,
                    'Question'    => $highlight['Question']
                ];
            }

            // ✅ No valid data → only delete
            if (empty($insertData)) {
                return response()->json([
                    'status' => true,
                    'message' => 'Old highlights deleted. No valid highlights to insert.'
                ]);
            }

            // 🔥 Bulk insert
            PortfolioHighlightData::insert($insertData);

            return response()->json([
                'status' => true,
                'message' => 'Highlights deleted and added successfully'
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error occurred',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    public function update(Request $request, $id): JsonResponse

    {

        $highlight = PortfolioHighlightData::find($id);

        if (!$highlight) {

            return response()->json(['status' => false, 'message' => 'Highlight not found'], 404);

        }

        $validated = $request->validate([

            'PortfolioID' => 'sometimes|integer|exists:mst_portfoliodata,PortfolioID',

            'Question'    => 'sometimes|string',

        ]);

        $highlight->update($validated);

        return response()->json(['status' => true, 'message' => 'Highlight updated successfully', 'data' => $highlight]);

    }



    public function destroy($id): JsonResponse

    {

        $highlight = PortfolioHighlightData::find($id);

        if (!$highlight) {

            return response()->json(['status' => false, 'message' => 'Highlight not found'], 404);

        }

        $highlight->delete();

        return response()->json(['status' => true, 'message' => 'Highlight deleted successfully']);

    }

}