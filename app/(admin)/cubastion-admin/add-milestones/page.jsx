'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "@/components/backendcomponents/SunEditor";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetMilestoneByIdQuery,
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
} from "@/store/backendSlice/milestoneAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdateMilestone() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const MilestoneID = searchParams.get("ID");
  const adminUser = useSelector((state) => state.adminAuth?.adminUser);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: milestoneResponse, isSuccess, isLoading: isFetching } = useGetMilestoneByIdQuery(MilestoneID, {
    skip: !MilestoneID,
    refetchOnMountOrArgChange: true
  });

  const [createMilestone, { isLoading: isCreating }] = useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: isUpdating }] = useUpdateMilestoneMutation();

  const [formData, setFormData] = useState({
    Title: "",
    Description: "",
    MilestoneYear: "",
    DisplayOrder: 1,
    ActiveStatus: 1,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && milestoneResponse?.data) {
      const data = Array.isArray(milestoneResponse.data) ? milestoneResponse.data[0] : milestoneResponse.data;
      setFormData({
        Title: data.Title || "",
        Description: data.Description || "",
        MilestoneYear: data.MilestoneYear || "",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
      });
    }
  }, [isSuccess, milestoneResponse]);

  const handleInput = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => {
      const errors = { ...prev };
      if (errors[field]) delete errors[field];
      return errors;
    });
  };

  const validationRules = {
    Title: { required: true, requiredMessage: "Please enter a milestone title." },
    MilestoneYear: { required: true, requiredMessage: "Please enter the milestone year." },
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const userName = adminUser?.UserFullName || "Admin";

    try {
      setIsUploading(true);

      const payload = {
        Title: formData.Title,
        Description: (formData.Description === "<p><br></p>" || !formData.Description) ? "" : formData.Description,
        MilestoneYear: formData.MilestoneYear,
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        ActiveStatus: parseInt(formData.ActiveStatus),
        UpdatedBy: userName
      };

      if (MilestoneID) {
        const res = await updateMilestone({ id: parseInt(MilestoneID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createMilestone(payload).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Creation failed");
      }

      toast.success("Milestone saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-milestones");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{MilestoneID ? "Update" : "Add"} Milestone</h1>

        <div className="tabbing_sec">
          <div className="tab-nav-content" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>

            <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px", maxWidth: "70%" }}>
              <div className="form-group displayorder" style={{ flex: "2" }}>
                <label>Title*</label>
                <input type="text" placeholder="e.g. Reached 100 Clients" value={formData.Title} onChange={(e) => handleInput("Title", e.target.value)} className={formErrors.Title ? "error-input" : ""} />
                {formErrors.Title && <p className="error">{formErrors.Title}</p>}
              </div>
              <div className="form-group displayorder" style={{ flex: "1" }}>
                <label>Year*</label>
                <input type="text" placeholder="e.g. 2023" value={formData.MilestoneYear} onChange={(e) => handleInput("MilestoneYear", e.target.value)} className={formErrors.MilestoneYear ? "error-input" : ""} />
                {formErrors.MilestoneYear && <p className="error">{formErrors.MilestoneYear}</p>}
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Description</label>
              <SunEditor value={formData.Description} onChange={(val) => handleInput("Description", val)} height={140} />
            </div>
            <div className="form-group-row statusac" style={{ display: "flex", gap: "30px", marginTop: "10px", alignItems: "flex-end" }}>
              <div className="form-group" style={{ flex: "0 0 120px" }}>
                <label>Display Order</label>
                <input type="number" value={formData.DisplayOrder} onChange={(e) => handleInput("DisplayOrder", e.target.value)} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px" }}>
                <input type="checkbox" id="chkActive" checked={formData.ActiveStatus === 1} onChange={(e) => handleInput("ActiveStatus", e.target.checked ? 1 : 0)} />
                <label htmlFor="chkActive" style={{ fontWeight: "600", cursor: "pointer" }}>Active Status</label>
              </div>
            </div>
            <div style={{ display: "flex", gap: "15px", marginTop: "30px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isCreating || isUpdating || isUploading}
                style={{ padding: "10px 30px", margin: "0" }}
              >
                {isCreating || isUpdating || isUploading ? "Saving..." : "Submit"}
              </button>
              <Link href="/cubastion-admin/manage-milestones" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
