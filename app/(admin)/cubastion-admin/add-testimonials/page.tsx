'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetTestimonialByIdQuery,
  useCreateTestimonialMutation,
  useUpdateTestimonialMutation,
} from "@/store/backendSlice/testimonialAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdateTestimonial() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const TestimonialID = searchParams.get("ID");
  const adminUser = useSelector((state: any) => state.adminAuth?.adminUser);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: testimonialResponse, isSuccess, isLoading: isFetching } = useGetTestimonialByIdQuery(TestimonialID, {
    skip: !TestimonialID,
    refetchOnMountOrArgChange: true
  });
  const [createTestimonial, { isLoading: isCreating }] = useCreateTestimonialMutation();
  const [updateTestimonial, { isLoading: isUpdating }] = useUpdateTestimonialMutation();

  const [formData, setFormData] = useState({
    TestimonialName: "",
    TestimonialDescription: "",
    TestimonialImage: "",
    TestimonialLogo: "",
    TestimonialVideo: "",
    DisplayOrder: 1,
    ActiveStatus: 1,
  });

  const [previews, setPreviews] = useState({ TestimonialImage: "", TestimonialLogo: "" });
  const [selectedFiles, setSelectedFiles] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && testimonialResponse?.data) {
      const data = Array.isArray(testimonialResponse.data) ? testimonialResponse.data[0] : testimonialResponse.data;
      setFormData({
        TestimonialName: data.TestimonialName || "",
        TestimonialDescription: data.TestimonialDescription || "",
        TestimonialImage: data.TestimonialImage || "",
        TestimonialLogo: data.TestimonialLogo || "",
        TestimonialVideo: data.TestimonialVideo || "",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
      });
      setPreviews({
        TestimonialImage: data.TestimonialImage ? `/uploads/onlineImages/TestimonialImages/${data.TestimonialImage}` : "",
        TestimonialLogo: data.TestimonialLogo ? `/uploads/onlineImages/TestimonialImages/${data.TestimonialLogo}` : "",
      });
    }
  }, [isSuccess, testimonialResponse]);

  const handleInput = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => {
      const errors = { ...prev };
      if (errors[field]) delete errors[field];
      return errors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const slug = formData.TestimonialName?.toLowerCase().replace(/\s+/g, "-") || 'testimonial';
    const newFile = new File([file], `${slug}-${field.toLowerCase()}-${Date.now()}.${ext}`, { type: file.type });

    setSelectedFiles(prev => ({ ...prev, [field]: newFile }));
    if (['TestimonialImage', 'TestimonialLogo'].includes(field)) {
      setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(newFile) }));
    }
    handleInput(field, newFile.name);
  };

  const validationRules = {
    TestimonialName: { required: true, requiredMessage: "Please enter client name." },
    TestimonialImage: { required: true, requiredMessage: "Please upload a client photo." },
    TestimonialLogo: { required: true, requiredMessage: "Please upload a client logo." },
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

      for (const [field, file] of Object.entries(selectedFiles)) {
        if (file) {
          const ud = new FormData();
          ud.append('file', file);
          ud.append('folder', 'uploads/onlineImages/TestimonialImages');
          ud.append('fileName', file.name);
          const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
          if (res.success) finalFileNames[field] = res.fileName;
          else throw new Error(`${field} upload failed`);
        }
      }

      const payload = {
        TestimonialName: finalFileNames.TestimonialName,
        TestimonialDescription: finalFileNames.TestimonialDescription || "",
        TestimonialImage: finalFileNames.TestimonialImage || "",
        TestimonialLogo: finalFileNames.TestimonialLogo || "",
        TestimonialVideo: finalFileNames.TestimonialVideo || "",
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        ActiveStatus: parseInt(formData.ActiveStatus),
        UpdatedBy: userName
      };

      if (TestimonialID) {
        const res = await updateTestimonial({ id: parseInt(TestimonialID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createTestimonial(payload).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Creation failed");
      }

      toast.success("Testimonial saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-testimonials");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{TestimonialID ? "Update" : "Add"} Testimonial</h1>

        <div className="tabbing_sec">
          <div className="tab-nav-content" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>

            <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Client Name*</label>
                <input type="text" placeholder="e.g. Amit Sharma" value={formData.TestimonialName} onChange={(e) => handleInput("TestimonialName", e.target.value)} className={formErrors.TestimonialName ? "error-input" : ""} />
                {formErrors.TestimonialName && <p className="error">{formErrors.TestimonialName}</p>}
              </div>
              <div className="form-group" style={{ flex: "2" }}>
                <label>Description</label>
                <input
                  type="text"
                  value={formData.TestimonialDescription}
                  onChange={(e) => handleInput("TestimonialDescription", e.target.value)}
                  placeholder="Enter client testimonial description..."
                />
              </div>
            </div>
            <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Video Upload</label>
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => handleFileChange(e, "TestimonialVideo")}
                />
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Client Photo*</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "TestimonialImage")} className={formErrors.TestimonialImage ? "error-input" : ""} style={{ width: "100%" }} />
                    {formErrors.TestimonialImage && <p className="error">{formErrors.TestimonialImage}</p>}
                  </div>
                  {previews.TestimonialImage && <img src={previews.TestimonialImage} alt="preview" height={40} style={{ borderRadius: "4px", border: "1px solid #ddd", objectFit: "contain", padding: "2px" }} />}
                </div>
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Client Logo*</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "TestimonialLogo")} className={formErrors.TestimonialLogo ? "error-input" : ""} style={{ width: "100%" }} />
                    {formErrors.TestimonialLogo && <p className="error">{formErrors.TestimonialLogo}</p>}
                  </div>
                  {previews.TestimonialLogo && <img src={previews.TestimonialLogo} alt="preview" height={40} style={{ borderRadius: "4px", border: "1px solid #ddd", objectFit: "contain", padding: "2px" }} />}
                </div>
              </div>
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
              <Link href="/cubastion-admin/manage-testimonials" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
