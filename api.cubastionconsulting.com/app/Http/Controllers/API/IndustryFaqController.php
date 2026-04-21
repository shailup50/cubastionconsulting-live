<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\IndustryFaqData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class IndustryFaqController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $faqs = IndustryFaqData::with('industry')->get();

            return response()->json([
                'status' => true,
                'data' => $faqs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch FAQs',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byIndustry($industryId): JsonResponse
    {
        try {
            $faqs = IndustryFaqData::where('IndustryID', $industryId)->get();

            return response()->json([
                'status' => true,
                'data' => $faqs
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch FAQs by industry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $faq = IndustryFaqData::find($id);

            if (!$faq) {
                return response()->json([
                    'status' => false,
                    'message' => 'FAQ not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $faq
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching FAQ',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            // ✅ Validate only IndustryID
            $validator = Validator::make($request->all(), [
                'IndustryID' => 'required|integer|exists:mst_industrydata,IndustryID'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $industryId = $request->IndustryID;

            // 🔥 STEP 1: DELETE OLD FAQs
            IndustryFaqData::where('IndustryID', $industryId)->delete();

            // ✅ FIX: safely get FAQs
            $faqs = $request->input('FAQs', []);

            $insertData = [];

            foreach ($faqs as $faq) {

                if (
                    empty(trim($faq['Question'] ?? '')) &&
                    empty(trim($faq['Answer'] ?? ''))
                ) {
                    continue;
                }

                $insertData[] = [
                    'IndustryID' => $industryId,
                    'Question'   => $faq['Question'],
                    'Answer'     => $faq['Answer']
                ];
            }

            // ✅ No valid data → only delete
            if (empty($insertData)) {
                return response()->json([
                    'status' => true,
                    'message' => 'Old FAQs deleted. No valid FAQs to insert.'
                ]);
            }

            IndustryFaqData::insert($insertData);

            return response()->json([
                'status' => true,
                'message' => 'FAQs deleted and added successfully'
            ], 201);

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
        try {
            $faq = IndustryFaqData::find($id);

            if (!$faq) {
                return response()->json([
                    'status' => false,
                    'message' => 'FAQ not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'IndustryID' => 'sometimes|integer|exists:mst_industrydata,IndustryID',
                'Question'   => 'sometimes|string|max:500',
                'Answer'     => 'sometimes|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            $faq->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Industry FAQ updated successfully',
                'data' => $faq
            ]);

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

    public function deleteByIndustry($industryId): JsonResponse
    {
        try {
            $faqs = IndustryFaqData::where('IndustryID', $industryId)->get();

            // ❌ No records found
            if ($faqs->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No FAQs found for this Industry'
                ], 404);
            }

            // ✅ Delete all
            IndustryFaqData::where('IndustryID', $industryId)->delete();

            return response()->json([
                'status' => true,
                'message' => 'All FAQs deleted successfully for this Industry'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete FAQs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}