<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'UserName'  => 'required|string',
            'Passwords' => 'required|string',
        ]);

        $user = DB::table('mst_userdata')
            ->where('UserName', $request->UserName)
            ->where('Passwords', $request->Passwords)
            ->where('ActiveStatus', 1)
            ->first();

        // Update last login
        DB::table('mst_userdata')
            ->where('loginID', $user->loginID)
            ->update(['LastLoginDate' => now()]);

        $token = base64_encode($user->loginID . ':' . time() . ':' . \Illuminate\Support\Str::random(32));

        return response()->json([
            'status'  => true,
            'message' => 'Login successful',
            'token'   => $token,
            'user'    => [
                'loginID'  => $user->loginID,
                'UserName' => $user->UserName,
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // If using Sanctum: $request->user()->currentAccessToken()->delete();
        return response()->json(['status' => true, 'message' => 'Logged out successfully']);
    }
}