<?php



namespace App\Http\Controllers\API;



use App\Http\Controllers\Controller;

use App\Models\CategoryData;

use Illuminate\Http\Request;

use Illuminate\Http\JsonResponse;



class CategoryController extends Controller

{

    public function index(): JsonResponse

    {

        $categories = CategoryData::orderBy('CategoryID', 'desc')->get();

        return response()->json(['status' => true, 'data' => $categories]);

    }



    public function show($id): JsonResponse

    {

        $category = CategoryData::with('services')->find($id);

        if (!$category) {

            return response()->json(['status' => false, 'message' => 'Category not found'], 404);

        }

        return response()->json(['status' => true, 'data' => $category]);

    }



    public function store(Request $request): JsonResponse

    {

        $validated = $request->validate([
            'CategoryType' => 'required|string|max:500',
            'CategoryName' => 'required|string|max:500',

            'DisplayOrder' => 'required|integer',

            'ActiveStatus' => 'required|integer',

        ]);

        $validated['PostedDate'] = now();

        $category = CategoryData::create($validated);

        return response()->json(['status' => true, 'message' => 'Category created successfully', 'data' => $category], 201);

    }



    public function update(Request $request, $id): JsonResponse

    {

        $category = CategoryData::find($id);

        if (!$category) {

            return response()->json(['status' => false, 'message' => 'Category not found'], 404);

        }

        $validated = $request->validate([
            'CategoryType' => 'sometimes|string|max:500',
            'CategoryName' => 'sometimes|string|max:500',

            'DisplayOrder' => 'sometimes|integer',

            'ActiveStatus' => 'sometimes|integer',

        ]);

        $validated['UpdatedBy'] = $request->input('UpdatedBy', 'admin');

        $category->update($validated);

        return response()->json(['status' => true, 'message' => 'Category updated successfully', 'data' => $category]);

    }



    public function destroy($id): JsonResponse

    {

        $category = CategoryData::find($id);

        if (!$category) {

            return response()->json(['status' => false, 'message' => 'Category not found'], 404);

        }

        $category->delete();

        return response()->json(['status' => true, 'message' => 'Category deleted successfully']);

    }

}