<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\AuthorData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class AuthorController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $authors = AuthorData::orderBy('AuthorID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $authors
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch authors',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $author = AuthorData::find($id);

            if (!$author) {
                return response()->json([
                    'status' => false,
                    'message' => 'Author not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $author
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching author',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'AuthorName'   => 'required|string|max:500',
                'AuthorTaglin' => 'required|string|max:500',
                'AuthorImage'  => 'required|string|max:500',
                'DisplayOrder' => 'required|integer',
                'ActiveStatus' => 'required|integer',
            ], [
                'AuthorName.required'   => 'Author name is required',
                'AuthorTaglin.required' => 'Author tagline is required',
                'AuthorImage.required'  => 'Author image is required',
                'DisplayOrder.required' => 'Display order is required',
                'ActiveStatus.required' => 'Active status is required',
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

            $author = AuthorData::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Author created successfully',
                'data' => $author
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while creating author',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while creating author',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {

            $author = AuthorData::find($id);

            if (!$author) {
                return response()->json([
                    'status' => false,
                    'message' => 'Author not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'AuthorName'   => 'sometimes|string|max:500',
                'AuthorTaglin' => 'sometimes|string|max:500',
                'AuthorImage'  => 'sometimes|string|max:500',
                'DisplayOrder' => 'sometimes|integer',
                'ActiveStatus' => 'sometimes|integer',
                'UpdatedBy'    => 'nullable|string'
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

            $author->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Author updated successfully',
                'data' => $author
            ]);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while updating author',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while updating author',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $author = AuthorData::find($id);

            if (!$author) {
                return response()->json([
                    'status' => false,
                    'message' => 'Author not found'
                ], 404);
            }

            $author->delete();

            return response()->json([
                'status' => true,
                'message' => 'Author deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete author',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}