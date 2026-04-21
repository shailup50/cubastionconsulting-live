<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ServiceData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $services = ServiceData::orderBy('ServiceID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $services
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch services',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $service = ServiceData::with(['faqs', 'categories'])->find($id);

            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Service not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showByURL($url): JsonResponse
    {
        try {
            $service = ServiceData::with(['faqs', 'categories'])
                ->where('ServiceNameURL', $url)
                ->where('ActiveStatus', 1)
                ->first();

            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Service not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $service
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching service by URL',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'ServiceName'        => 'required|string|max:255',
                'ServiceNameURL'     => 'required|string|max:255|unique:mst_servicedata,ServiceNameURL',
                'ServiceImage'       => 'required|string|max:255',
                'DisplayOrder'       => 'required|integer',
                'ActiveStatus'       => 'required|integer',

                
                'ServiceBannerImage' => 'nullable|string|max:500',
                'ServiceBannerImage1'     => 'nullable|string|max:500',
                'ServiceTagLine'          => 'nullable|string|max:500',
                'ServicePunchline'        => 'nullable|string|max:500',
                'DescriptionHeading'      => 'nullable|string|max:255',
                'Description'             => 'nullable|string',
                'OtherDescriptionHeading' => 'nullable|string|max:255',
                'OtherDescription'        => 'nullable|string',
                'MetaTitle'               => 'nullable|string|max:255',
                'MetaKeywords'            => 'nullable|string|max:255',
                'MetaDescriptions'        => 'nullable|string|max:2000',
                'MetaSchema'              => 'nullable|string',
                'MetaOgImage'             => 'nullable|string|max:500',
            ], [
                'ServiceName.required'        => 'Service name is required',
                'ServiceNameURL.required'     => 'Service URL is required',
                'ServiceNameURL.unique'       => 'This service URL already exists',
                'ServiceImage.required'       => 'Service image is required',
                'DisplayOrder.required'      => 'Display order is required',
                'ActiveStatus.required'      => 'Active status is required',
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

            $service = ServiceData::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Service created successfully',
                'data' => $service
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while creating service',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while creating service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {

            $service = ServiceData::find($id);

            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Service not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'ServiceName' => 'sometimes|string|max:255',

                'ServiceNameURL' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('mst_servicedata', 'ServiceNameURL')->ignore($id, 'ServiceID')
                ],
                'DisplayOrder'       => 'sometimes|integer',
                'ActiveStatus'       => 'sometimes|integer',

                

                'ServiceImage'       => 'nullable|string|max:255',
                'ServiceBannerImage' => 'nullable|string|max:255',
                'ServiceBannerImage1'     => 'nullable|string|max:500',
                'ServiceTagLine'          => 'nullable|string|max:500',
                'ServicePunchline'        => 'nullable|string|max:500',
                'DescriptionHeading'      => 'nullable|string|max:255',
                'Description'             => 'nullable|string',
                'OtherDescriptionHeading' => 'nullable|string|max:255',
                'OtherDescription'        => 'nullable|string',
                'MetaTitle'               => 'nullable|string|max:255',
                'MetaKeywords'            => 'nullable|string|max:255',
                'MetaDescriptions'        => 'nullable|string|max:2000',
                'MetaSchema'              => 'nullable|string',
                'MetaOgImage'             => 'nullable|string|max:500',
            ], [
                'ServiceNameURL.unique' => 'This service URL already exists'
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

            $service->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Service updated successfully',
                'data' => $service
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while updating service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $service = ServiceData::find($id);

            if (!$service) {
                return response()->json([
                    'status' => false,
                    'message' => 'Service not found'
                ], 404);
            }

            $service->delete();

            return response()->json([
                'status' => true,
                'message' => 'Service deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete service',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}