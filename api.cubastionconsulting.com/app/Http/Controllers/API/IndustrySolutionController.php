<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\IndustrySolutionData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;


class IndustrySolutionController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $solutions = IndustrySolutionData::with('industry')->get();

            return response()->json([
                'status' => true,
                'data' => $solutions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch solutions',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byIndustry($industryId): JsonResponse
    {
        try {
            $solutions = IndustrySolutionData::where('IndustryID', $industryId)->get();

            return response()->json([
                'status' => true,
                'data' => $solutions
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch solutions by industry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $solution = IndustrySolutionData::with('industry')->find($id);

            if (!$solution) {
                return response()->json([
                    'status' => false,
                    'message' => 'Solution not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $solution
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching solution',
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

            // 🔥 STEP 1: DELETE OLD SOLUTIONS
            IndustrySolutionData::where('IndustryID', $industryId)->delete();

            // ✅ FIX: safely get Solutions
            $solutions = $request->input('Solutions', []);

            $insertData = [];

            foreach ($solutions as $solution) {

                if (
                    empty(trim($solution['IndustrySolutionHeading'] ?? '')) &&
                    empty(trim($solution['IndustrySolutionTagline'] ?? '')) &&
                    empty(trim($solution['IndustrySolutionImage'] ?? ''))
                ) {
                    continue;
                }

                $insertData[] = [
                    'IndustryID'              => $industryId,
                    'IndustrySolutionHeading' => $solution['IndustrySolutionHeading'],
                    'IndustrySolutionTagline'=> $solution['IndustrySolutionTagline'],
                    'IndustrySolutionImage'  => $solution['IndustrySolutionImage'],
                ];
            }

            // ✅ No valid data → only delete
            if (empty($insertData)) {
                return response()->json([
                    'status' => true,
                    'message' => 'Old solutions deleted. No valid solutions to insert.'
                ]);
            }

            IndustrySolutionData::insert($insertData);

            return response()->json([
                'status' => true,
                'message' => 'Solutions deleted and added successfully'
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
            $solution = IndustrySolutionData::find($id);

            if (!$solution) {
                return response()->json([
                    'status' => false,
                    'message' => 'Solution not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'IndustryID'              => 'sometimes|integer|exists:mst_industrydata,IndustryID',
                'IndustrySolutionHeading' => 'sometimes|string|max:500',
                'IndustrySolutionTagline'=> 'sometimes|string',
                'IndustrySolutionImage'  => 'sometimes|string|max:500',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            $solution->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Solution updated successfully',
                'data' => $solution
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
            $faqs = IndustrySolutionData::where('IndustryID', $industryId)->get();

            // ❌ No records found
            if ($faqs->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No FAQs found for this Industry'
                ], 404);
            }

            // ✅ Delete all
            IndustrySolutionData::where('IndustryID', $industryId)->delete();

            return response()->json([
                'status' => true,
                'message' => 'All Solutions deleted successfully for this Industry'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete Solutions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}