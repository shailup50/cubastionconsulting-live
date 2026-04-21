'use client';
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation
} from "@/store/backendSlice/categoryAPISlice";

export default function AddUpdateCategory() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const CategoryID = searchParams.get("ID");

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: categoryData, isLoading: isFetching } = useGetCategoryByIdQuery(CategoryID, {
    skip: !CategoryID,
    refetchOnMountOrArgChange: true
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();

  const [formData, setFormData] = useState({
    CategoryName: "",
    CategoryType: "",
    DisplayOrder: 1,
    ActiveStatus: 1
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (categoryData?.data) {
      const data = Array.isArray(categoryData.data) ? categoryData.data[0] : categoryData.data;
      setFormData({
        CategoryName: data.CategoryName || "",
        CategoryType: data.CategoryType || "",
        DisplayOrder: data.DisplayOrder || 1,
        ActiveStatus: data.ActiveStatus || 0
      });
    }
  }, [categoryData]);

  const handleInput = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.CategoryName?.trim()) newErrors.CategoryName = "Category Name is required";
    if (!formData.CategoryType) newErrors.CategoryType = "Category Type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!validate()) return;
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const user = userStr ? JSON.parse(userStr) : null;
    const adminUserName = user?.UserName || user?.UserFullName || "Admin";
    const payload = {
      ...formData,
      DisplayOrder: parseInt(formData.DisplayOrder, 10) || 1,
      UpdatedBy: adminUserName
    };

    try {
      let res;
      if (CategoryID) {
        res = await updateCategory({ id: CategoryID, ...payload }).unwrap();
      } else {
        res = await createCategory(payload).unwrap();
      }

      if (res.status || res.success) {
        toast.success(res.message || `Category ${CategoryID ? "updated" : "created"} successfully`);
        router.push("/cubastion-admin/manage-category");
      } else {
        toast.error(res.message || "Operation failed");
      }
    } catch (err) {
      console.error("Submit error:", err);
      toast.error(err?.data?.message || "An unexpected error occurred");
    }
  };

  if (isFetching) return <div className="container p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{CategoryID ? "Update" : "Add"} Category</h1>
        <div className="tabbing_sec">
          <div className="tab-nav-content">
            <div className="tabs active">
              <div className="form-group-row" style={{ display: "flex", gap: "20px" }}>
                <div className="form-group displayorder" style={{ flex: "1" }}>
                  <label>Category Type*</label>
                  <select
                    value={formData.CategoryType}
                    onChange={(e) => handleInput("CategoryType", e.target.value)}
                    className={errors.CategoryType ? "error-input" : ""}
                    style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
                  >
                    <option value="">Select Category Type</option>
                    <option value="What outcome are you solving for?">What outcome are you solving for?</option>
                    <option value="What best describes the current state of your outcome journey?">What best describes the current state of your outcome journey?</option>
                  </select>
                  {errors.CategoryType && <p className="error">{errors.CategoryType}</p>}
                </div>
                <div className="form-group displayorder" style={{ flex: "1" }}>
                  <label>Category Name*</label>
                  <input
                    type="text"
                    placeholder="e.g. Logo Design"
                    value={formData.CategoryName}
                    onChange={(e) => handleInput("CategoryName", e.target.value)}
                    className={errors.CategoryName ? "error-input" : ""}
                    style={{ width: "100%" }}
                  />
                  {errors.CategoryName && <p className="error">{errors.CategoryName}</p>}
                </div>
              </div>

              {/* Row 2: Display Order and Active Status */}
              <div className="form-group-row" style={{ display: "flex", gap: "30px", marginTop: "20px", alignItems: "center" }}>
                <div className="form-group" style={{ flex: "0 0 200px" }}>
                  <label>Display Order</label>
                  <input
                    type="number"
                    value={formData.DisplayOrder}
                    onChange={(e) => handleInput("DisplayOrder", e.target.value)}
                  />
                </div>
                <div className="form-group-row statusac" style={{ display: "flex", alignItems: "center", gap: "8px", margin: 0, marginTop: "25px" }}>
                  <input
                    type="checkbox"
                    id="chkActiveStatus"
                    checked={formData.ActiveStatus === 1}
                    onChange={(e) => handleInput("ActiveStatus", e.target.checked ? 1 : 0)}
                  />
                  <label htmlFor="chkActiveStatus" style={{ margin: 0 }}>Status (Active/Inactive)</label>
                </div>
              </div>

              {/* Bottom Buttons: Submit to the left of Back */}
              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={isCreating || isUpdating}
                  style={{ width: "auto", padding: "10px 25px" }}
                >
                  {isCreating || isUpdating ? "Saving..." : "Submit"}
                </button>
                <Link href="/cubastion-admin/manage-category" className="submit-btn" >
                  Back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
