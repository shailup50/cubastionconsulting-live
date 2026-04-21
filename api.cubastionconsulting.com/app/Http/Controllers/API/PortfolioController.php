<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\PortfolioData;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\QueryException;
use Illuminate\Validation\Rule;

class PortfolioController extends Controller
{
    public function index(): JsonResponse
    {
        try {
            $portfolios = PortfolioData::with(['author', 'industry'])
                ->orderBy('PortfolioID', 'desc')
                ->get();

            return response()->json(['status' => true, 'data' => $portfolios]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch portfolios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function homePortfolios(): JsonResponse
    {
        try {
            $portfolios = PortfolioData::with(['author', 'industry'])
                ->where('ActiveStatus', 1)
                ->where('DisplayOnHome', 1)
                ->orderBy('DisplayOrder')
                ->get();

            return response()->json(['status' => true, 'data' => $portfolios]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch home portfolios',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byIndustry($industryId): JsonResponse
    {
        try {
            $portfolios = PortfolioData::with(['author', 'industry', 'highlights'])
                ->where('IndustryID', $industryId)
                ->where('ActiveStatus', 1)
                ->orderBy('DisplayOrder')
                ->get();

            return response()->json(['status' => true, 'data' => $portfolios]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch portfolios by industry',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function byType($type): JsonResponse
    {
        try {
            $portfolios = PortfolioData::with(['author', 'industry'])
                ->where('PortfolioType', $type)
                ->where('ActiveStatus', 1)
                ->orderBy('DisplayOrder')
                ->get();

            return response()->json(['status' => true, 'data' => $portfolios]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to fetch portfolios by type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $portfolio = PortfolioData::with(['author', 'industry', 'highlights'])->find($id);

            if (!$portfolio) {
                return response()->json(['status' => false, 'message' => 'Portfolio not found'], 404);
            }

            return response()->json(['status' => true, 'data' => $portfolio]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function showByURL($url): JsonResponse
    {
        try {
            $portfolio = PortfolioData::with(['author', 'industry', 'highlights'])
                ->where('PortfolioNameURL', $url)
                ->first();

            if (!$portfolio) {
                return response()->json(['status' => false, 'message' => 'Portfolio not found'], 404);
            }

            return response()->json(['status' => true, 'data' => $portfolio]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error fetching portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function store(Request $request): JsonResponse
    {
        try {

            $validator = Validator::make($request->all(), [
                'AuthorID'         => 'required|integer|exists:mst_authordata,AuthorID',
                'IndustryID'       => 'required|integer|exists:mst_industrydata,IndustryID',
                'PortfolioName'    => 'required|string|max:255',
                'PortfolioNameURL' => 'required|string|max:255|unique:mst_portfoliodata,PortfolioNameURL',
                'PortfolioTopHeading' => 'required|string|max:500',
                'PortfolioImage'   => 'required|string|max:255',
                'PortfolioBannerImage' => 'required|string|max:255',
                'DisplayOrder'     => 'required|integer',
                'ActiveStatus'     => 'required|integer',
                'DisplayOnHome'    => 'required|integer',
            ], [
                'PortfolioName.required' => 'Portfolio name is required',
                'PortfolioNameURL.unique' => 'This portfolio URL already exists',
                'AuthorID.exists' => 'Invalid author selected',
                'IndustryID.exists' => 'Invalid industry selected'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();
            $data += $request->only([
                'PortfolioType','PortfolioReelToReal','PortfolioProblemSolving',
                'PortfolioPowerInnovation','PortfolioAIAndIndustry',
                'MetaTitle','MetaKeywords','MetaDescriptions','MetaSchema'
            ]);

            $data['PostedDate'] = now();

            $portfolio = PortfolioData::create($data);

            return response()->json([
                'status' => true,
                'message' => 'Portfolio created successfully',
                'data' => $portfolio
            ], 201);

        } catch (QueryException $e) {
            return response()->json([
                'status' => false,
                'message' => 'Database error while creating portfolio',
                'error' => $e->getMessage()
            ], 500);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while creating portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        try {

            $portfolio = PortfolioData::find($id);

            if (!$portfolio) {
                return response()->json(['status' => false, 'message' => 'Portfolio not found'], 404);
            }

            $validator = Validator::make($request->all(), [
                'PortfolioName' => 'sometimes|string|max:255',
                'PortfolioNameURL' => [
                    'sometimes',
                    'string',
                    'max:255',
                    Rule::unique('mst_portfoliodata', 'PortfolioNameURL')->ignore($id, 'PortfolioID')
                ],
                'DisplayOrder' => 'sometimes|integer',
                'ActiveStatus' => 'sometimes|integer',
                'DisplayOnHome'=> 'sometimes|integer',
            ], [
                'PortfolioNameURL.unique' => 'This portfolio URL already exists'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => false,
                    'message' => $validator->errors()->first(),
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            $data['UpdatedBy'] = $request->input('UpdatedBy', 'admin');
            $data['UpdatedOn'] = now();

            $portfolio->update($data);

            return response()->json([
                'status' => true,
                'message' => 'Portfolio updated successfully',
                'data' => $portfolio
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Something went wrong while updating portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {

            $portfolio = PortfolioData::find($id);

            if (!$portfolio) {
                return response()->json(['status' => false, 'message' => 'Portfolio not found'], 404);
            }

            $portfolio->delete();

            return response()->json([
                'status' => true,
                'message' => 'Portfolio deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Failed to delete portfolio',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}