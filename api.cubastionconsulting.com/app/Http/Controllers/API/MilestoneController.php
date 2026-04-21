<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\MilestoneData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class MilestoneController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $milestones = MilestoneData::orderBy('MilestoneID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $milestones
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch milestones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $milestone = MilestoneData::find($id);

            if (!$milestone) {
                return response()->json([
                    'status' => false,
                    'message' => 'Milestone not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $milestone
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching milestone',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'Title'         => 'required|string|max:255',
                'Description'   => 'nullable|string',
                'MilestoneYear' => 'nullable|string|max:255',
                'ActiveStatus'  => 'required|integer',
                'DisplayOrder'  => 'nullable|integer',
            ], [
                'Title.required'        => 'Title is required',
                'ActiveStatus.required' => 'Active status is required'
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
            $data['UpdatedBy']  = $request->input('UpdatedBy', 'Admin');

            $milestone = MilestoneData::create($data);

            return response()->json([
                'status'  => true,
                'message' => 'Milestone created successfully',
                'data'    => $milestone,
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while creating milestone',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while creating milestone',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {

            $milestone = MilestoneData::find($id);

            if (!$milestone) {
                return response()->json([
                    'status' => false,
                    'message' => 'Milestone not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Title'         => 'sometimes|string|max:255',
                'Description'   => 'nullable|string',
                'MilestoneYear' => 'nullable|string|max:255',
                'ActiveStatus'  => 'sometimes|integer',
                'DisplayOrder'  => 'nullable|integer',
                'UpdatedBy'     => 'nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data['UpdatedBy'] = $request->input('UpdatedBy', 'Admin');
            $data['UpdatedOn'] = now();

            $milestone->update($data);

            return response()->json([
                'status'  => true,
                'message' => 'Milestone updated successfully',
                'data'    => $milestone,
            ]);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while updating milestone',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while updating milestone',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $milestone = MilestoneData::find($id);

            if (!$milestone) {
                return response()->json([
                    'status' => false,
                    'message' => 'Milestone not found'
                ], 404);
            }

            $milestone->delete();

            return response()->json([
                'status' => true,
                'message' => 'Milestone deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete milestone',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}