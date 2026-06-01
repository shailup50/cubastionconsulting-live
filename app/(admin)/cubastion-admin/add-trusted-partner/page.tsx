'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetTrustedPartnerByIdQuery,
  useCreateTrustedPartnerMutation,
  useUpdateTrustedPartnerMutation,
} from "@/store/backendSlice/trustedPartnerAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdateTrustedPartner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const LogoID = searchParams.get("ID");
  const adminUser = useSelector((state: any) => state.adminAuth?.adminUser);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const { data: partnerResponse, isSuccess, isLoading: isFetching } = useGetTrustedPartnerByIdQuery(LogoID, {
    skip: !LogoID,
    refetchOnMountOrArgChange: true,
  });

  const [createPartner, { isLoading: isCreating }] = useCreateTrustedPartnerMutation();
  const [updatePartner, { isLoading: isUpdating }] = useUpdateTrustedPartnerMutation();

  const [formData, setFormData] = useState({
    LogoName: "",
    LogoNameURL: "",
    LogoImage1: "",
    DisplayOrder: 1,
  });

  const [previews, setPreviews] = useState({ LogoImage1: "" });
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && partnerResponse?.data) {
      const data = Array.isArray(partnerResponse.data) ? partnerResponse.data[0] : partnerResponse.data;
      setFormData({
        LogoName: data.LogoName || "",
        LogoNameURL: data.LogoNameURL || "",
        LogoImage1: data.LogoImage1 || "",
        DisplayOrder: data.DisplayOrder ?? 1,
      });
      if (data.LogoImage1) {
        setPreviews({ LogoImage1: `/uploads/onlineImages/LogoImages/${data.LogoImage1}` });
      }
    }
  }, [isSuccess, partnerResponse]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleInput = (field: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "LogoName" && !LogoID) {
        updated.LogoNameURL = generateSlug(value);
      }
      return updated;
    });
    setFormErrors((prev) => {
      const errors = { ...prev };
      if (errors[field]) delete errors[field];
      return errors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const slug = formData.LogoNameURL || generateSlug(formData.LogoName) || "trusted-partner";
    const newFile = new File([file], `${slug}-${Date.now()}.${ext}`, { type: file.type });

    setSelectedFiles((prev) => ({ ...prev, [field]: newFile }));
    setPreviews((prev) => ({ ...prev, [field]: URL.createObjectURL(newFile) }));
    handleInput(field, newFile.name);
  };

  const validationRules = {
    LogoName: { required: true, requiredMessage: "Please enter partner name." },
    LogoNameURL: { required: true, requiredMessage: "Please enter partner URL." },
    LogoImage1: { required: true, requiredMessage: "Partner logo image is required." },
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    let finalFileNames = { ...formData };
    const userName = adminUser?.UserFullName || "Admin";

    try {
      setIsUploading(true);
      if (selectedFiles.LogoImage1) {
        const file = selectedFiles.LogoImage1;
        const ud = new FormData();
        ud.append("file", file);
        ud.append("folder", "uploads/onlineImages/LogoImages");
        ud.append("fileName", file.name);
        const res = await fetch("/api/upload", { method: "POST", body: ud }).then((r) => r.json());
        if (res.success) finalFileNames.LogoImage1 = res.fileName;
        else throw new Error("Logo upload failed");
      }

      const payload = {
        LogoName: finalFileNames.LogoName,
        LogoNameURL: finalFileNames.LogoNameURL,
        LogoImage1: finalFileNames.LogoImage1,
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        UpdatedBy: userName,
      };

      if (LogoID) {
        const res = await updatePartner({ id: parseInt(LogoID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createPartner(payload).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Creation failed");
      }

      toast.success("Trusted partner saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-trusted-partners");
    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{LogoID ? "Update" : "Add"} Trusted Partner</h1>

        <div className="tabbing_sec">
          <div className="tab-nav-content" style={{ padding: "20px", border: "1px solid #eee", borderRadius: "8px" }}>
            <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Partner Name*</label>
                <input
                  type="text"
                  placeholder="e.g. Oracle Partner"
                  value={formData.LogoName}
                  onChange={(e) => handleInput("LogoName", e.target.value)}
                  className={formErrors.LogoName ? "error-input" : ""}
                />
                {formErrors.LogoName && <p className="error">{formErrors.LogoName}</p>}
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Partner URL*</label>
                <input
                  type="text"
                  placeholder="oracle-partner"
                  value={formData.LogoNameURL}
                  onChange={(e) => handleInput("LogoNameURL", e.target.value)}
                  className={formErrors.LogoNameURL ? "error-input" : ""}
                />
                {formErrors.LogoNameURL && <p className="error">{formErrors.LogoNameURL}</p>}
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Partner Logo*</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "LogoImage1")}
                      className={formErrors.LogoImage1 ? "error-input" : ""}
                      style={{ width: "100%" }}
                    />
                    {formErrors.LogoImage1 && <p className="error">{formErrors.LogoImage1}</p>}
                  </div>
                  {previews.LogoImage1 && (
                    <img
                      src={previews.LogoImage1}
                      alt="preview"
                      height={40}
                      style={{ borderRadius: "4px", border: "1px solid #ddd", background: "#f8f9fa", objectFit: "contain", padding: "2px" }}
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-group-row" style={{ display: "flex", gap: "30px", marginTop: "10px", alignItems: "flex-end" }}>
              <div className="form-group" style={{ flex: "0 0 120px" }}>
                <label>Display Order</label>
                <input
                  type="number"
                  value={formData.DisplayOrder}
                  onChange={(e) => handleInput("DisplayOrder", e.target.value)}
                />
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
              <Link href="/cubastion-admin/manage-trusted-partners" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
