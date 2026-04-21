<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\LogoData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Database\QueryException;

class LogoController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $logos = LogoData::orderBy('LogoID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $logos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch logos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function homeLogos(): JsonResponse
    {
        try {
            $logos = LogoData::where('ActiveStatus', 1)
                ->where('DisplayOnHome', 1)
                ->orderBy('DisplayOrder')
                ->get();

            return response()->json([
                'status' => true,
                'data' => $logos
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch home logos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $logo = LogoData::find($id);

            if (!$logo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Logo not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $logo
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showByURL($url): JsonResponse
    {
        try {
            $logo = LogoData::where('LogoNameURL', $url)
                ->where('ActiveStatus', 1)
                ->first();

            if (!$logo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Logo not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $logo
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'LogoName'     => 'required|string|max:500',
                'LogoNameURL'  => 'required|string|max:500|unique:mst_logodata,LogoNameURL',
                'LogoImage1'   => 'required|string|max:500',
                'DisplayOrder' => 'required|integer',
                'ActiveStatus' => 'required|integer'
            ], [
                'LogoName.required'    => 'Logo name is required',
                'LogoNameURL.unique'  => 'This logo URL already exists',
                'LogoImage1.required' => 'Logo image is required',
                'DisplayOrder.required' => 'Display order is required',
                'ActiveStatus.required' => 'Active status is required'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $logo = LogoData::create($validator->validated());

            return response()->json([
                'status' => true,
                'message' => 'Logo created successfully',
                'data' => $logo
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error occurred while creating logo',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while creating logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {

            $logo = LogoData::find($id);

            if (!$logo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Logo not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'LogoName' => 'sometimes|string|max:500',

                'LogoNameURL' => [
                    'sometimes',
                    'string',
                    'max:500',
                    Rule::unique('mst_logodata', 'LogoNameURL')->ignore($id, 'LogoID')
                ],

                'LogoImage1'   => 'sometimes|string|max:500',
                'DisplayOrder' => 'sometimes|integer',
                'ActiveStatus' => 'sometimes|integer',
            ], [
                'LogoNameURL.unique' => 'This logo URL already exists'
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

            $logo->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Logo updated successfully',
                'data' => $logo
            ]);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error occurred while updating logo',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while updating logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $logo = LogoData::find($id);

            if (!$logo) {
                return response()->json([
                    'status' => false,
                    'message' => 'Logo not found'
                ], 404);
            }

            $logo->delete();

            return response()->json([
                'status' => true,
                'message' => 'Logo deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete logo',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}