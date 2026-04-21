<?php



namespace App\Http\Controllers\API;



use App\Http\Controllers\Controller;

use App\Models\ServiceFaqData;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;



class ServiceFaqController extends Controller

{

    public function index(): JsonResponse

    {

        $faqs = ServiceFaqData::with('service')->get();

        return response()->json(['status' => true, 'data' => $faqs]);

    }



    public function byService($serviceId): JsonResponse

    {

        $faqs = ServiceFaqData::where('ServiceID', $serviceId)->get();

        return response()->json(['status' => true, 'data' => $faqs]);

    }



    public function show($id): JsonResponse

    {

        $faq = ServiceFaqData::find($id);

        if (!$faq) {

            return response()->json(['status' => false, 'message' => 'FAQ not found'], 404);

        }

        return response()->json(['status' => true, 'data' => $faq]);

    }



    public function store(Request $request): JsonResponse
    {
        try {

            // ✅ Validate only ServiceID
            $validator = Validator::make($request->all(), [
                'ServiceID' => 'required|integer|exists:mst_servicedata,ServiceID'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $serviceId = $request->ServiceID;

            // 🔥 STEP 1: DELETE OLD FAQs
            ServiceFaqData::where('ServiceID', $serviceId)->delete();

            // ✅ Safe input (important fix)
            $faqs = $request->input('FAQs', []);

            $insertData = [];

            foreach ($faqs as $faq) {

                // ✅ Skip empty rows
                if (
                    empty(trim($faq['Question'] ?? '')) &&
                    empty(trim($faq['Answer'] ?? ''))
                ) {
                    continue;
                }

                $insertData[] = [
                    'ServiceID' => $serviceId,
                    'Question'  => $faq['Question'],
                    'Answer'    => $faq['Answer']
                ];
            }

            // ✅ If nothing to insert → only delete
            if (empty($insertData)) {
                return response()->json([
                    'status' => true,
                    'message' => 'Old FAQs deleted. No valid FAQs to insert.'
                ]);
            }

            // 🔥 Bulk insert
            ServiceFaqData::insert($insertData);

            return response()->json([
                'status' => true,
                'message' => 'Service FAQs deleted and added successfully'
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

        $faq = ServiceFaqData::find($id);

        if (!$faq) {

            return response()->json(['status' => false, 'message' => 'FAQ not found'], 404);

        }

        $validated = $request->validate([

            'ServiceID' => 'sometimes|integer|exists:mst_servicedata,ServiceID',

            'Question'  => 'sometimes|string|max:500',

            'Answer'    => 'sometimes|string',

        ]);

        $faq->update($validated);

        return response()->json(['status' => true, 'message' => 'Service FAQ updated successfully', 'data' => $faq]);

    }



    public function destroy($id): JsonResponse

    {

        $faq = ServiceFaqData::find($id);

        if (!$faq) {

            return response()->json(['status' => false, 'message' => 'FAQ not found'], 404);

        }

        $faq->delete();

        return response()->json(['status' => true, 'message' => 'Service FAQ deleted successfully']);

    }

}