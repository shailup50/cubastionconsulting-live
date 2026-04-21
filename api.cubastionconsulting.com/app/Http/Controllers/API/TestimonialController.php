<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TestimonialData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class TestimonialController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $testimonials = TestimonialData::orderBy('TestimonialID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $testimonials
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch testimonials',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $testimonial = TestimonialData::find($id);

            if (!$testimonial) {
                return response()->json([
                    'status' => false,
                    'message' => 'Testimonial not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $testimonial
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'TestimonialName'        => 'required|string|max:500',
                'TestimonialDescription' => 'nullable|string',
                'TestimonialImage'       => 'nullable|string|max:500',
                'TestimonialLogo'        => 'nullable|string|max:500',
                'TestimonialVideo'       => 'nullable|string|max:500',
                'DisplayOrder'           => 'required|integer',
                'ActiveStatus'           => 'required|integer',
            ], [
                'TestimonialName.required' => 'Testimonial name is required',
                'DisplayOrder.required'   => 'Display order is required',
                'ActiveStatus.required'   => 'Active status is required'
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

            $testimonial = TestimonialData::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Testimonial created successfully',
                'data' => $testimonial
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while creating testimonial',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while creating testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {

            $testimonial = TestimonialData::find($id);

            if (!$testimonial) {
                return response()->json([
                    'status' => false,
                    'message' => 'Testimonial not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'TestimonialName'        => 'sometimes|string|max:500',
                'TestimonialDescription' => 'nullable|string',
                'TestimonialImage'       => 'nullable|string|max:500',
                'TestimonialLogo'        => 'nullable|string|max:500',
                'TestimonialVideo'       => 'nullable|string|max:500',
                'DisplayOrder'           => 'sometimes|integer',
                'ActiveStatus'           => 'sometimes|integer',
                'UpdatedBy'              => 'nullable|string'
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

            $testimonial->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Testimonial updated successfully',
                'data' => $testimonial
            ]);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while updating testimonial',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while updating testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $testimonial = TestimonialData::find($id);

            if (!$testimonial) {
                return response()->json([
                    'status' => false,
                    'message' => 'Testimonial not found'
                ], 404);
            }

            $testimonial->delete();

            return response()->json([
                'status' => true,
                'message' => 'Testimonial deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete testimonial',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}