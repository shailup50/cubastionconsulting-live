<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CareerData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;

class CareerController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $data = CareerData::orderBy('CareerID', 'desc')->get();

            return response()->json(['status' => true, 'data' => $data]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch careers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $data = CareerData::find($id);

            if (!$data) {
                return response()->json([
                    'status' => false,
                    'message' => 'Career not found'
                ], 404);
            }

            return response()->json(['status' => true, 'data' => $data]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching career',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'JobCategoryName' => 'required|string|max:500',
                'CareerName'      => 'required|string|max:500',
                'CareerNameURL'   => 'required|string|max:500|unique:mst_careerdata,CareerNameURL',
                'CareerPosition'  => 'required|string|max:500',
                'DisplayOrder'    => 'required|integer',
                'ActiveStatus'    => 'required|integer',
            ], [
                'CareerNameURL.unique' => 'This career URL already exists'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data += $request->only([
                'CareerLocation','CareerImage','CareerBannerImage','Description',
                'MetaTitle','MetaKeywords','MetaDescriptions','MetaSchema'
            ]);

            $data['PostedDate'] = now();

            $career = CareerData::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Career created successfully',
                'data' => $career
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

            $career = CareerData::find($id);

            if (!$career) {
                return response()->json([
                    'status' => false,
                    'message' => 'Career not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'CareerName' => 'sometimes|string|max:500',
                'CareerNameURL' => [
                    'sometimes',
                    'string',
                    'max:500',
                    Rule::unique('mst_careerdata', 'CareerNameURL')->ignore($id, 'CareerID')
                ],
                'DisplayOrder' => 'sometimes|integer',
                'ActiveStatus' => 'sometimes|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            $data['UpdatedBy'] = $request->input('UpdatedBy', 'Admin');
            $data['UpdatedOn'] = now();

            $career->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Career updated successfully',
                'data' => $career
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error updating career',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $career = CareerData::find($id);

            if (!$career) {
                return response()->json([
                    'status' => false,
                    'message' => 'Career not found'
                ], 404);
            }

            $career->delete();

            return response()->json([
                'status' => true,
                'message' => 'Career deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting career',
                'error' => $e->getMessage()
            ], 500);
        }
    }

        public function showbyUrl($CareerNameURL): JsonResponse
    {
        try {
            $data = CareerData::where("CareerNameURL", '=', $CareerNameURL)->get();

            if (!$data) {
                return response()->json([
                    'status' => false,
                    'message' => 'Career not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching career',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}