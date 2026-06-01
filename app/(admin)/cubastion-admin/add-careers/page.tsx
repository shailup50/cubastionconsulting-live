'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "@/components/backendcomponents/SunEditor";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetCareerByIdQuery,
  useCreateCareerMutation,
  useUpdateCareerMutation,
} from "@/store/backendSlice/careerAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";


const TAB_LIST = [
  { id: "tab-main", label: "Career Data" },
];

export default function AddUpdateCareer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const CareerID = searchParams.get("ID");
  const adminUser = useSelector((state: any) => state.adminAuth?.adminUser);

  const [activeTab, setActiveTab] = useState("tab-main");

  const { data: checkData, isAuthSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: careerResponse, isSuccess, isLoading: isFetching } = useGetCareerByIdQuery(CareerID, {
    skip: !CareerID,
    refetchOnMountOrArgChange: true
  });

  const [createCareer, { isLoading: isCreating }] = useCreateCareerMutation();
  const [updateCareer, { isLoading: isUpdating }] = useUpdateCareerMutation();

  const [formData, setFormData] = useState({
    JobCategoryName: "",
    CareerName: "",
    CareerNameURL: "",
    CareerPosition: "",
    CareerLocation: "",
    CareerImage: "",
    CareerBannerImage: "",
    Description: "",
    DisplayOrder: 1,
    ActiveStatus: 1,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "{}",
    UpdatedBy: "Admin",
  });

  const [previews, setPreviews] = useState({ CareerImage: "", CareerBannerImage: "" });
  const [selectedFiles, setSelectedFiles] = useState({ CareerImage: null, CareerBannerImage: null });
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && careerResponse?.data) {
      const data = Array.isArray(careerResponse.data) ? careerResponse.data[0] : careerResponse.data;
      setFormData({
        JobCategoryName: data.JobCategoryName || "",
        CareerName: data.CareerName || "",
        CareerNameURL: data.CareerNameURL || "",
        CareerPosition: data.CareerPosition || "",
        CareerLocation: data.CareerLocation || "",
        CareerImage: data.CareerImage || "",
        CareerBannerImage: data.CareerBannerImage || "",
        Description: data.Description || "",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || "{}",
        UpdatedBy: data.UpdatedBy || "Admin",
      });
      setPreviews({
        CareerImage: data.CareerImage ? `/uploads/onlineImages/CareerImages/${data.CareerImage}` : "",
        CareerBannerImage: data.CareerBannerImage ? `/uploads/onlineImages/CareerImages/${data.CareerBannerImage}` : "",
      });
    }
  }, [isSuccess, careerResponse]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleInput = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "CareerName" && !CareerID) {
        updated.CareerNameURL = generateSlug(value);
        updated.MetaTitle = `${value} | Cubastion`;
      }
      return updated;
    });

    setFormErrors(prev => {
      const errors = { ...prev };
      if (errors[field]) delete errors[field];
      if (field === "CareerName" && errors["CareerNameURL"]) delete errors["CareerNameURL"];
      return errors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const slug = formData.CareerNameURL || generateSlug(formData.CareerName) || 'career';
    const newFile = new File([file], `${slug}-${field.toLowerCase()}.${ext}`, { type: file.type });

    setSelectedFiles(prev => ({ ...prev, [field]: newFile }));
    setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(newFile) }));
    handleInput(field, newFile.name);
  };

  const validationRules = {
    JobCategoryName: { required: true, requiredMessage: "Please enter job category." },
    CareerName: { required: true, requiredMessage: "Please enter career name." },
    CareerNameURL: { required: true, requiredMessage: "Please enter career URL." },
    CareerPosition: { required: true, requiredMessage: "Please enter career position." },
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      if (activeTab !== "tab-main") setActiveTab("tab-main");
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const userName = adminUser?.UserFullName || "Admin";

    try {
      setIsUploading(true);
      const finalFileNames = {
        CareerImage: formData.CareerImage,
        CareerBannerImage: formData.CareerBannerImage
      };

      for (const [field, file] of Object.entries(selectedFiles)) {
        if (file) {
          const ud = new FormData();
          ud.append('file', file);
          ud.append('folder', 'uploads/onlineImages/CareerImages');
          ud.append('fileName', file.name);
          const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
          if (res.success) finalFileNames[field] = res.fileName;
          else throw new Error(`${field} upload failed`);
        }
      }

      const payload = {
        ...formData,
        CareerImage: finalFileNames.CareerImage,
        CareerBannerImage: finalFileNames.CareerBannerImage,
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        ActiveStatus: parseInt(formData.ActiveStatus),
        UpdatedBy: userName
      };

      if (CareerID) {
        const res = await updateCareer({ id: parseInt(CareerID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createCareer(payload).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Creation failed");
      }

      toast.success("Career saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-careers");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{CareerID ? "Update" : "Add"} Career</h1>

        <div className="tabbing_sec">
          <div style={{ display: "flex", alignItems: "center" }}>
            <ul className="tab-nav">
              {TAB_LIST.map(t => (
                <li key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? "active" : ""}>
                  {t.label}
                </li>
              ))}
            </ul>
            <div style={{ marginLeft: "auto" }}>
              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={isCreating || isUpdating || isUploading}
                style={{ padding: "10px 20px", marginTop: "0" }}
              >
                {isCreating || isUpdating || isUploading ? "Saving..." : "Submit"}
              </button>
            </div>
          </div>

          <div className="tab-nav-content" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '0 0 8px 8px', background: '#fff' }}>

            <div className={`tabs ${activeTab === "tab-main" ? "active" : ""}`}>
              <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Job Category*</label>
                  <input type="text" placeholder="e.g. Technology" value={formData.JobCategoryName} onChange={(e) => handleInput("JobCategoryName", e.target.value)} className={formErrors.JobCategoryName ? "error-input" : ""} />
                  {formErrors.JobCategoryName && <p className="error">{formErrors.JobCategoryName}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Career Name*</label>
                  <input type="text" placeholder="e.g. Senior Frontend Developer" value={formData.CareerName} onChange={(e) => handleInput("CareerName", e.target.value)} className={formErrors.CareerName ? "error-input" : ""} />
                  {formErrors.CareerName && <p className="error">{formErrors.CareerName}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Slug / URL*</label>
                  <input type="text" placeholder="senior-frontend-developer" value={formData.CareerNameURL} onChange={(e) => handleInput("CareerNameURL", e.target.value)} className={formErrors.CareerNameURL ? "error-input" : ""} />
                  {formErrors.CareerNameURL && <p className="error">{formErrors.CareerNameURL}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Position Type*</label>
                  <input type="text" placeholder="e.g. Full Time" value={formData.CareerPosition} onChange={(e) => handleInput("CareerPosition", e.target.value)} className={formErrors.CareerPosition ? "error-input" : ""} />
                  {formErrors.CareerPosition && <p className="error">{formErrors.CareerPosition}</p>}
                </div>
              </div>

              <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Location</label>
                  <input type="text" placeholder="e.g. Mumbai, India" value={formData.CareerLocation} onChange={(e) => handleInput("CareerLocation", e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Thumbnail Photo</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "CareerImage")} style={{ width: "100%" }} />
                    </div>
                    {previews.CareerImage && <img src={previews.CareerImage} alt="preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />}
                  </div>
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Banner Image</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "CareerBannerImage")} style={{ width: "100%" }} />
                    </div>
                    {previews.CareerBannerImage && <img src={previews.CareerBannerImage} alt="preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "20px" }}>
                <label>Job Description</label>
                <SunEditor value={formData.Description} onChange={(val) => handleInput("Description", val)} height={200} />
              </div>

              <div className="form-group-row statusac" style={{ display: "flex", gap: "30px", marginTop: "20px", alignItems: "flex-end" }}>
                <div className="form-group" style={{ flex: "0 0 120px" }}>
                  <label>Display Order</label>
                  <input type="number" value={formData.DisplayOrder} onChange={(e) => handleInput("DisplayOrder", e.target.value)} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px" }}>
                  <input type="checkbox" id="chkActive" checked={formData.ActiveStatus === 1} onChange={(e) => handleInput("ActiveStatus", e.target.checked ? 1 : 0)} />
                  <label htmlFor="chkActive" style={{ fontWeight: "600", cursor: "pointer" }}>Active Status</label>
                </div>
              </div>
              <h2 style={{ marginTop: "40px", fontSize: "1.2rem", fontWeight: "600" }}>Only for SEO Purpose</h2>
              <hr />
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Meta Title</label>
                <input type="text" placeholder="Browser Tab Title" value={formData.MetaTitle} onChange={(e) => handleInput("MetaTitle", e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Meta Keywords</label>
                <input type="text" placeholder="Keywords (comma separated)" value={formData.MetaKeywords} onChange={(e) => handleInput("MetaKeywords", e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: "15px" }}>
                <label>Meta Description</label>
                <input
                  type="text"
                  placeholder="Short SEO description"
                  value={formData.MetaDescriptions}
                  onChange={(e) => handleInput("MetaDescriptions", e.target.value)}
                  style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }}
                />
              </div>
              <div className="form-group" style={{ marginBottom: "30px" }}>
                <label>Meta Schema (JSON)</label>
                <input type="text" placeholder='{"@context": "https://schema.org", ...}' value={formData.MetaSchema} onChange={(e) => handleInput("MetaSchema", e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />
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
              <Link href="/cubastion-admin/manage-careers" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}