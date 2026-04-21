<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\ContactUs;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;

class ContactUsController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $contacts = ContactUs::orderBy('ContactID', 'desc')->get();

            return response()->json([
                'status' => true,
                'data' => $contacts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch enquiries',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $contact = ContactUs::find($id);

            if (!$contact) {
                return response()->json([
                    'status' => false,
                    'message' => 'Enquiry not found'
                ], 404);
            }

            return response()->json([
                'status' => true,
                'data' => $contact
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching enquiry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'FullName'    => 'required|string|max:500',
                'EmailID'     => 'required|email|max:500',
                'PhoneNo'     => 'nullable|string|max:50',
                'NoOfGuest'   => 'nullable|string|max:50',
                'Message'     => 'nullable|string|max:5000',
                'EnquiryType' => 'nullable|string|max:500',
                'EnquiryFor'  => 'nullable|string|max:500',
                'PageName'    => 'nullable|string|max:500',
            ], [
                'FullName.required' => 'Full name is required',
                'EmailID.required'  => 'Email address is required',
                'EmailID.email'     => 'Please enter a valid email address',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status'  => false,
                    'message' => $validator->errors()->first(),
                    'errors'  => $validator->errors()
                ], 422);
            }

            $contact = ContactUs::create($validator->validated());

            return response()->json([
                'status'  => true,
                'message' => 'Enquiry submitted successfully',
                'data'    => $contact
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Database error while saving enquiry',
                'error'   => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status'  => false,
                'message' => 'Something went wrong while submitting enquiry',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $contact = ContactUs::find($id);

            if (!$contact) {
                return response()->json([
                    'status' => false,
                    'message' => 'Enquiry not found'
                ], 404);
            }

            $contact->delete();

            return response()->json([
                'status' => true,
                'message' => 'Enquiry deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete enquiry',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}