<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\TeamData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class TeamController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $teams = TeamData::orderBy('TeamID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $teams
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch team data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byType($type): JsonResponse
    {
        try {
            $teams = TeamData::where('TeamType', $type)
                ->where('ActiveStatus', 1)
                ->orderBy('DisplayOrder')
                ->get();

            return response()->json([
                'status' => true,
                'data' => $teams
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch team by type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $team = TeamData::find($id);

            if (!$team) {
                return response()->json([
                    'status' => false,
                    'message' => 'Team member not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $team
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching team member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'TeamName'        => 'required|string|max:150',
                'TeamDesignation' => 'required|string|max:150',
                'TeamBio'         => 'required|string',
                'TeamImage'       => 'nullable|string|max:255',
                'TeamType'        => 'nullable|string|max:100',
                'TeamLinkedInLink'        => 'nullable|string|max:100',
                'ActiveStatus'    => 'required|integer',
                'DisplayOrder'    => 'nullable|integer',
            ], [
                'TeamName.required'        => 'Team name is required',
                'TeamDesignation.required'=> 'Designation is required',
                'TeamBio.required'        => 'Team bio is required',
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
            $data['UpdatedBy']  = $request->input('UpdatedBy', 'Admin');

            $team = TeamData::create($data);

            return response()->json([
                'status'  => true,
                'message' => 'Team member created successfully',
                'data'    => $team,
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while creating team member',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while creating team member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {

            $team = TeamData::find($id);

            if (!$team) {
                return response()->json([
                    'status' => false,
                    'message' => 'Team member not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'TeamName'        => 'sometimes|string|max:150',
                'TeamDesignation' => 'sometimes|string|max:150',
                'TeamBio'         => 'sometimes|string',
                'TeamImage'       => 'nullable|string|max:255',
                'TeamType'        => 'nullable|string|max:100',
                'TeamLinkedInLink'        => 'nullable|string|max:100',
                'ActiveStatus'    => 'sometimes|integer',
                'DisplayOrder'    => 'nullable|integer',
                'UpdatedBy'       => 'nullable|string'
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

            $team->update($data);

            return response()->json([
                'status'  => true,
                'message' => 'Team member updated successfully',
                'data'    => $team,
            ]);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while updating team member',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while updating team member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $team = TeamData::find($id);

            if (!$team) {
                return response()->json([
                    'status' => false,
                    'message' => 'Team member not found'
                ], 404);
            }

            $team->delete();

            return response()->json([
                'status' => true,
                'message' => 'Team member deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete team member',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}