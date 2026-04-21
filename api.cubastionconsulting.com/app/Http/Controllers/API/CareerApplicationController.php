<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Career;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class CareerApplicationController extends Controller
{
    // GET /api/v1/career-applications
    // Admin only — view all submitted applications
    public function index(): JsonResponse
    {
        try {
            $applications = Career::orderBy('PostedDate', 'desc')->get();

            return response()->json([
                'status' => true,
                'total'  => $applications->count(),
                'data'   => $applications,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Failed to fetch applications',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // GET /api/v1/career-applications/{id}
    // Admin only — view single application
    public function show($id): JsonResponse
    {
        try {
            $application = Career::find($id);

            if (!$application) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Application not found',
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data'   => $application,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Error fetching application',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // POST /api/v1/career-applications
    // Public — submit a job application (supports resume file upload)
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'FullName'    => 'required|string|max:255',
                'Email'       => 'required|email|max:255',
                'PhoneNo'     => 'required|string|max:50',
                'Country'     => 'required|string|max:255',
                'City'        => 'required|string|max:255',
                'LinkedInLink'=> 'required|string|max:500',
                'Message'     => 'required|string|max:500',
                'JobName'     => 'required',
                'Resume'      => 'required',
            ], [
                'FullName.required'     => 'Full name is required',
                'Email.required'        => 'Email address is required',
                'Email.email'           => 'Please enter a valid email address',
                'PhoneNo.required'      => 'Phone number is required',
                'Country.required'      => 'Country is required',
                'City.required'         => 'City is required',
                'LinkedInLink.required' => 'LinkedIn profile link is required',
                'Message.required'      => 'Message is required',
                'JobName.required' => 'JobName is required',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => false,
                    'message' => $validator->errors()->first(),
                    'errors'  => $validator->errors(),
                ], 422);
            }

            $data = $validator->validated();

            // // Handle resume file upload
            // if ($request->hasFile('Resume')) {
            //     $file     = $request->file('Resume');
            //     $fileName = time() . '_' . str_replace(' ', '_', $file->getClientOriginalName());
            //     $file->move(public_path('uploads/resumes'), $fileName);
            //     $data['Resume'] = 'uploads/resumes/' . $fileName;
            // }

            $data['PostedDate'] = now();

            $application = Career::create($data);

            return response()->json([
                'status'  => true,
                'message' => 'Application submitted successfully',
                'data'    => $application,
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Database error occurred',
                'error'   => $e->getMessage(),
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }

    // DELETE /api/v1/career-applications/{id}
    // Admin only — delete an application
    public function destroy($id): JsonResponse
    {
        try {
            $application = Career::find($id);

            if (!$application) {
                return response()->json([
                    'status'  => false,
                    'message' => 'Application not found',
                ], 404);
            }

            // Delete resume file from server if exists
            if ($application->Resume && file_exists(public_path($application->Resume))) {
                unlink(public_path($application->Resume));
            }

            $application->delete();

            return response()->json([
                'status'  => true,
                'message' => 'Application deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Error deleting application',
                'error'   => $e->getMessage(),
            ], 500);
        }
    }
}