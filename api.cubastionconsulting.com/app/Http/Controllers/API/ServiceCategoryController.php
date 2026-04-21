<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ServiceCategoryData;
use App\Models\CategoryData;
use App\Models\ServiceData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;


class ServiceCategoryController extends Controller
{
    public function index(): JsonResponse
    {
        try {

            //
            // Get categories only (clean data)
            $categories = CategoryData::where('ActiveStatus', 1)
                ->with('services')
                ->orderBy('DisplayOrder', 'asc')
                ->select('CategoryID', 'CategoryName', 'CategoryType')
                ->get();

            // Group by Question Type
            $groupedCategories = $categories->groupBy('CategoryType')->map(function ($items) {
                return $items->values();
            });
            

            // Optional: Industries / Services
            $industries = ServiceData::where('ActiveStatus', 1)
                ->orderBy('DisplayOrder', 'asc')
                ->select('ServiceID', 'ServiceName', 'ServiceNameURL', 'ServiceImage')
                ->get();

            // Get categories only (clean data)
            $servicecategory = ServiceCategoryData::with(['service', 'category'])->get();


            return response()->json([
                'status' => true,

                // ✅ MAIN DATA (what your UI needs)
                'questions' => $groupedCategories,

                // ✅ OPTIONAL (if needed)
                'industries' => $industries,
                'servicecategory' => $servicecategory

            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $data = ServiceCategoryData::with(['service', 'category'])->find($id);

            if (!$data) {
                return response()->json([
                    'status' => false,
                    'message' => 'Requested service-category mapping not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching service category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byService($serviceId): JsonResponse
    {
        try {
            $data = ServiceCategoryData::with('category')
                ->where('ServiceID', $serviceId)
                ->get();

            return response()->json([
                'status' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching categories for service',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byCategory($categoryId): JsonResponse
    {
        try {
            $data = ServiceCategoryData::with('service')
                ->where('CategoryID', $categoryId)
                ->get();

            return response()->json([
                'status' => true,
                'data' => $data
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching services for category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔥 STORE (FAQ STYLE)
    public function store(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            $validator = Validator::make($request->all(), [
                'ServiceID'   => 'required|integer|exists:mst_servicedata,ServiceID',
                'CategoryIDs' => 'nullable|array',
                'CategoryIDs.*' => 'integer|exists:mst_categorydata,CategoryID',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first()
                ], 422);
            }

            $serviceId   = $request->ServiceID;
            $categoryIds = array_unique(array_filter($request->input('CategoryIDs', [])));

            // 🔥 STEP 1: DELETE OLD
            ServiceCategoryData::where('ServiceID', $serviceId)->delete();

            // 🔥 STEP 2: INSERT NEW (ONLY IF EXISTS)
            if (!empty($categoryIds)) {

                $insertData = [];

                foreach ($categoryIds as $categoryId) {
                    $insertData[] = [
                        'ServiceID'  => $serviceId,
                        'CategoryID' => $categoryId,
                    ];
                }

                ServiceCategoryData::insert($insertData);
            }

            DB::commit(); // ✅ SAVE BOTH DELETE + INSERT

            return response()->json([
                'status' => true,
                'message' => 'Service categories updated successfully'
            ]);

        } catch (\Exception $e) {

            DB::rollBack(); // ❌ UNDO DELETE if insert fails

            return response()->json([
                'status' => false,
                'message' => 'Failed to update categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // 🔥 BULK STORE
    public function bulkStore(Request $request): JsonResponse
    {
        DB::beginTransaction();

        try {

            $validator = Validator::make($request->all(), [
                'ServiceID'     => 'required|integer|exists:mst_servicedata,ServiceID',
                'CategoryIDs'   => 'required|array|min:1',
                'CategoryIDs.*' => 'integer|exists:mst_categorydata,CategoryID',
            ], [
                'ServiceID.required' => 'Service ID is required',
                'CategoryIDs.required' => 'At least one category is required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $serviceId = $request->ServiceID;

            // ✅ Clean input
            $newCategoryIds = array_unique(array_filter($request->CategoryIDs));

            // ✅ Get existing categories
            $existingCategoryIds = ServiceCategoryData::where('ServiceID', $serviceId)
                ->pluck('CategoryID')
                ->toArray();

            // ✅ Find categories to DELETE
            $toDelete = array_diff($existingCategoryIds, $newCategoryIds);

            if (!empty($toDelete)) {
                ServiceCategoryData::where('ServiceID', $serviceId)
                    ->whereIn('CategoryID', $toDelete)
                    ->delete();
            }

            // ✅ Find categories to INSERT
            $toInsert = array_diff($newCategoryIds, $existingCategoryIds);

            $insertData = [];

            foreach ($toInsert as $categoryId) {
                $insertData[] = [
                    'ServiceID'  => $serviceId,
                    'CategoryID' => $categoryId,
                ];
            }

            if (!empty($insertData)) {
                ServiceCategoryData::insert($insertData);
            }

            DB::commit();

            return response()->json([
                'status' => true,
                'message' => 'Categories synced successfully',
                'added' => array_values($toInsert),
                'removed' => array_values($toDelete),
                'final' => $newCategoryIds
            ], 200);

        } catch (QueryException $e) {

            DB::rollBack();

            return response()->json([
                'status' => false,
                'message' => 'Database error occurred',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {

            DB::rollBack();

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

            $data = ServiceCategoryData::find($id);

            if (!$data) {
                return response()->json([
                    'status' => false,
                    'message' => 'Requested service-category mapping not found'
                ], 404);
            }

            $validated = $request->validate([
                'ServiceID'  => 'sometimes|integer|exists:mst_servicedata,ServiceID',
                'CategoryID' => 'sometimes|integer|exists:mst_categorydata,CategoryID',
            ]);

            $exists = ServiceCategoryData::where('ServiceID', $validated['ServiceID'] ?? $data->ServiceID)
                ->where('CategoryID', $validated['CategoryID'] ?? $data->CategoryID)
                ->where('ServiceCategoryID', '!=', $id)
                ->exists();

            if ($exists) {
                return response()->json([
                    'status' => false,
                    'message' => 'This service is already linked with the selected category'
                ], 409);
            }

            $data->update($validated);

            return response()->json([
                'status' => true,
                'message' => 'Service category updated successfully',
                'data' => $data->load(['service', 'category'])
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error updating service category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $data = ServiceCategoryData::find($id);

            if (!$data) {
                return response()->json([
                    'status' => false,
                    'message' => 'Requested service-category mapping not found'
                ], 404);
            }

            $data->delete();

            return response()->json([
                'status' => true,
                'message' => 'Service category removed successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting service category',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroyByService($serviceId): JsonResponse
    {
        try {

            $deleted = ServiceCategoryData::where('ServiceID', $serviceId)->delete();

            return response()->json([
                'status' => true,
                'message' => $deleted > 0
                    ? $deleted . ' category mapping(s) removed successfully'
                    : 'No categories found for this service'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error deleting service categories',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}