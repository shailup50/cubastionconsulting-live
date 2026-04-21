<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\IndustryData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;

class IndustryController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $industries = IndustryData::orderBy('IndustryID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $industries
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch industries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function homeIndustries(): JsonResponse
    {
        try {
            $industries = IndustryData::where('ActiveStatus', 1)
                ->where('DisplayOnHome', 1)
                ->orderBy('DisplayOrder')
                ->get();

            return response()->json([
                'status' => true,
                'data' => $industries
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch home industries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $industry = IndustryData::with(['faqs', 'solutions'])->find($id);

            if (!$industry) {
                return response()->json([
                    'status' => false,
                    'message' => 'Industry not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $industry
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching industry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showByURL($url): JsonResponse
    {
        try {
            $industry = IndustryData::with(['faqs', 'solutions', 'portfolios.author'])
                ->where('IndustryNameURL', $url)
                ->first();

            if (!$industry) {
                return response()->json([
                    'status' => false,
                    'message' => 'Industry not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $industry
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching industry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'IndustryName'        => 'required|string|max:255',
                'IndustryNameURL'     => 'required|string|max:255|unique:mst_industrydata,IndustryNameURL',
                'IndustryImage'       => 'required|string|max:255',
                'IndustryBannerImage' => 'required|string|max:255',

                'ActiveStatus'        => 'required|integer',
                'DisplayOrder'        => 'required|integer',
                'DisplayOnHome'       => 'required|integer',

                'Description'         => 'nullable|string',
                'DescriptionHeading'  => 'nullable|string',
                'IndustryTagLine'     => 'nullable|string',
                'MetaTitle'           => 'nullable|string',
                'MetaKeywords'        => 'nullable|string',
                'MetaDescriptions'    => 'nullable|string',
                'MetaSchema'          => 'nullable|string',
                'OtherDescription'    => 'nullable|string',
                'UpdatedBy'           => 'nullable|string'
            ], [
                'IndustryNameURL.unique' => 'This Industry URL already exists.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['PostedDate'] = now();

            $industry = IndustryData::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Industry created successfully',
                'data' => $industry
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
        try {
            $industry = IndustryData::find($id);

            if (!$industry) {
                return response()->json([
                    'status' => false,
                    'message' => 'Industry not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'IndustryName' => 'sometimes|string|max:255',

                'IndustryNameURL' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('mst_industrydata', 'IndustryNameURL')->ignore($id, 'IndustryID')
                ],

                'IndustryImage'       => 'sometimes|string|max:255',
                'IndustryBannerImage' => 'sometimes|string|max:255',

                'DisplayOrder'  => 'sometimes|integer',
                'ActiveStatus'  => 'sometimes|integer',
                'DisplayOnHome' => 'sometimes|integer',

                'Description'         => 'nullable|string',
                'DescriptionHeading'  => 'nullable|string',
                'IndustryTagLine'     => 'nullable|string',
                'MetaTitle'           => 'nullable|string',
                'MetaKeywords'        => 'nullable|string',
                'MetaDescriptions'    => 'nullable|string',
                'MetaSchema'          => 'nullable|string',
                'OtherDescription'    => 'nullable|string',
                'UpdatedBy'           => 'nullable|string'
            ], [
                'IndustryNameURL.unique' => 'This Industry URL already exists.'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['UpdatedBy'] = $request->input('UpdatedBy', 'admin');
            $data['UpdatedOn'] = now();

            $industry->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Industry updated successfully',
                'data' => $industry
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

    public function destroy($id): JsonResponse
    {
        try {
            $industry = IndustryData::find($id);

            if (!$industry) {
                return response()->json([
                    'status' => false,
                    'message' => 'Industry not found'
                ], 404);
            }

            $industry->delete();

            return response()->json([
                'status' => true,
                'message' => 'Industry deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete industry',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}