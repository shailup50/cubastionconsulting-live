'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "@/components/backendcomponents/SunEditor";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetServiceByIdQuery,
  useCreateServiceMutation,
  useUpdateServiceMutation,
  useGetServiceCategoriesQuery,
  useSaveServiceCategoriesMutation,
} from "@/store/backendSlice/serviceAPISlice";
import { useGetAllCategoriesQuery } from "@/store/backendSlice/categoryAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";

const TAB_LIST = [
  { id: "tab-main", label: "Service Data" },
  // { id: "tab-categories", label: "Categories" },
];

export default function AddUpdateService() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ServiceID = searchParams.get("ID");
  const adminUser = useSelector((state: any) => state.adminAuth?.adminUser);

  const [activeTab, setActiveTab] = useState("tab-main");

  const { data: checkData, isAuthSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: serviceResponse, isSuccess, isLoading: isFetching } = useGetServiceByIdQuery(ServiceID, {
    skip: !ServiceID,
    refetchOnMountOrArgChange: true
  });

  const { data: categoriesResponse } = useGetAllCategoriesQuery();
  const { data: selectedCatsResponse } = useGetServiceCategoriesQuery(ServiceID, { skip: !ServiceID });

  const [createService, { isLoading: isCreating }] = useCreateServiceMutation();
  const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
  const [saveCategories] = useSaveServiceCategoriesMutation();

  const [formData, setFormData] = useState({
    ServiceName: "",
    ServiceNameURL: "",
    ServiceImage: "",
    ServiceBannerImage: "",
    ServiceBannerImage1: "",
    ServiceTagLine: "",
    ServicePunchline: "",
    DescriptionHeading: "",
    Description: "",
    OtherDescriptionHeading: "",
    OtherDescription: "",
    DisplayOrder: 1,
    ActiveStatus: 1,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "{}",
    MetaOgImage: "",
  });

  const [previews, setPreviews] = useState({ ServiceImage: "", ServiceBannerImage: "", ServiceBannerImage1: "" });
  const [selectedFiles, setSelectedFiles] = useState({ ServiceImage: null, ServiceBannerImage: null, ServiceBannerImage1: null });
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [selectedCategoryIDs, setSelectedCategoryIDs] = useState([]);

  useEffect(() => {
    if (isAuthSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && serviceResponse?.data) {
      const data = Array.isArray(serviceResponse.data) ? serviceResponse.data[0] : serviceResponse.data;
      setFormData({
        ServiceName: data.ServiceName || "",
        ServiceNameURL: data.ServiceNameURL || "",
        ServiceImage: data.ServiceImage || "",
        ServiceBannerImage: data.ServiceBannerImage || "",
        ServiceBannerImage1: data.ServiceBannerImage1 || "",
        ServiceTagLine: data.ServiceTagLine || "",
        ServicePunchline: data.ServicePunchline || "",
        DescriptionHeading: data.DescriptionHeading || "",
        Description: data.Description || "",
        OtherDescriptionHeading: data.OtherDescriptionHeading || "",
        OtherDescription: data.OtherDescription || "",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || "{}",
        MetaOgImage: data.MetaOgImage || "",
      });
      setPreviews({
        ServiceImage: data.ServiceImage ? `/uploads/onlineImages/ServiceImages/${data.ServiceImage}` : "",
        ServiceBannerImage: data.ServiceBannerImage ? `/uploads/onlineImages/ServiceImages/${data.ServiceBannerImage}` : "",
        ServiceBannerImage1: data.ServiceBannerImage1 ? `/uploads/onlineImages/ServiceImages/${data.ServiceBannerImage1}` : "",
      });
    }
  }, [isSuccess, serviceResponse]);

  useEffect(() => {
    if (selectedCatsResponse?.data) {
      setSelectedCategoryIDs(selectedCatsResponse.data.map(c => c.CategoryID));
    }
  }, [selectedCatsResponse]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleInput = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "ServiceName" && !ServiceID) {
        updated.ServiceNameURL = generateSlug(value);
        updated.MetaTitle = `${value} | Cubastion`;
      }
      return updated;
    });

    setFormErrors(prev => {
      const errors = { ...prev };
      if (errors[field]) delete errors[field];
      if (field === "ServiceName" && errors["ServiceNameURL"]) delete errors["ServiceNameURL"];
      return errors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const slug = formData.ServiceNameURL || generateSlug(formData.ServiceName) || 'service';
    const newFile = new File([file], `${slug}-${field.toLowerCase()}.${ext}`, { type: file.type });

    setSelectedFiles(prev => ({ ...prev, [field]: newFile }));
    setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(newFile) }));
    handleInput(field, newFile.name);
  };

  const validationRules = {
    ServiceName: { required: true, requiredMessage: "Please enter service name." },
    ServiceNameURL: { required: true, requiredMessage: "Please enter service URL." },
    ServiceImage: { required: true, requiredMessage: "Please upload a thumbnail image." },
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setActiveTab("tab-main");
      setFormErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const userName = adminUser?.UserFullName || "Admin";

    try {
      setIsUploading(true);
      const finalFileNames = {
        ServiceImage: formData.ServiceImage,
        ServiceBannerImage: formData.ServiceBannerImage,
        ServiceBannerImage1: formData.ServiceBannerImage1
      };

      for (const [field, file] of Object.entries(selectedFiles)) {
        if (file) {
          const ud = new FormData();
          ud.append('file', file);
          ud.append('folder', 'uploads/onlineImages/ServiceImages');
          ud.append('fileName', file.name);
          const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
          if (res.success) finalFileNames[field] = res.fileName;
          else throw new Error(`${field} upload failed`);
        }
      }

      const cleanEditorContent = (val) => (val === "<p><br></p>" || !val) ? "" : val;

      const payload = {
        ServiceName: formData.ServiceName,
        ServiceNameURL: formData.ServiceNameURL,
        ServiceImage: finalFileNames.ServiceImage,
        ServiceBannerImage: finalFileNames.ServiceBannerImage,
        ServiceBannerImage1: finalFileNames.ServiceBannerImage1,
        ServiceTagLine: formData.ServiceTagLine || "",
        ServicePunchline: formData.ServicePunchline || "",
        DescriptionHeading: formData.DescriptionHeading || "",
        Description: cleanEditorContent(formData.Description),
        OtherDescriptionHeading: formData.OtherDescriptionHeading || "",
        OtherDescription: cleanEditorContent(formData.OtherDescription),
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        ActiveStatus: parseInt(formData.ActiveStatus),
        MetaTitle: formData.MetaTitle || "",
        MetaKeywords: formData.MetaKeywords || "",
        MetaDescriptions: formData.MetaDescriptions || "",
        MetaSchema: formData.MetaSchema || "{}",
        MetaOgImage: formData.MetaOgImage || "",
        UpdatedBy: userName
      };

      let targetServiceID = ServiceID;
      if (ServiceID) {
        const res = await updateService({ id: parseInt(ServiceID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createService(payload).unwrap();
        if (res.status || res.success) {
          targetServiceID = res.ServiceID || res.data?.ServiceID;
        } else {
          throw new Error(res.message || "Creation failed");
        }
      }

      // Save categories if service save was successful and we have an ID
      if (targetServiceID) {
        await saveCategories({
          ServiceID: parseInt(targetServiceID),
          CategoryIDs: selectedCategoryIDs
        }).unwrap();
      }

      toast.success("Service saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-services");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  const handleToggleCategory = (catId: number) => {
    setSelectedCategoryIDs(prev =>
      prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
    );
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{ServiceID ? "Update" : "Add"} Service</h1>

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
                  <label>Service Name*</label>
                  <input type="text" placeholder="e.g. Logo Design" value={formData.ServiceName} onChange={(e) => handleInput("ServiceName", e.target.value)} className={formErrors.ServiceName ? "error-input" : ""} />
                  {formErrors.ServiceName && <p className="error">{formErrors.ServiceName}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Name URL / Slug*</label>
                  <input type="text" placeholder="logo-design" value={formData.ServiceNameURL} onChange={(e) => handleInput("ServiceNameURL", e.target.value)} className={formErrors.ServiceNameURL ? "error-input" : ""} />
                  {formErrors.ServiceNameURL && <p className="error">{formErrors.ServiceNameURL}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Tagline</label>
                  <input type="text" placeholder="Crafting Identities" value={formData.ServiceTagLine} onChange={(e) => handleInput("ServiceTagLine", e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Thumbnail Photo*</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "ServiceImage")} className={formErrors.ServiceImage ? "error-input" : ""} style={{ width: "100%" }} />
                      {formErrors.ServiceImage && <p className="error">{formErrors.ServiceImage}</p>}
                    </div>
                    {previews.ServiceImage && <img src={previews.ServiceImage} alt="preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />}
                  </div>
                </div>
                <div className="form-group-row" style={{ display: "flex", gap: "30px", marginTop: "20px", alignItems: "center" }}>
                  <div className="form-group" style={{ flex: "0 0 200px" }}>
                    <label>Display Order</label>
                    <input
                      type="number"
                      value={formData.DisplayOrder}
                      onChange={(e) => handleInput("DisplayOrder", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {/* All other fields hidden */}
              <div style={{ display: "none" }}>
                <div className="form-group" style={{ flex: "1 1 24%", display: "none" }}>
                  <label>Punchline</label>
                  <input type="text" value={formData.ServicePunchline} onChange={(e) => handleInput("ServicePunchline", e.target.value)} />
                </div>
                <input type="file" onChange={(e) => handleFileChange(e, "ServiceBannerImage")} />
                <input type="file" onChange={(e) => handleFileChange(e, "ServiceBannerImage1")} />
                <input type="number" value={formData.DisplayOrder} onChange={(e) => handleInput("DisplayOrder", e.target.value)} />
                <SunEditor value={formData.Description} onChange={(val) => handleInput("Description", val)} />
                <SunEditor value={formData.OtherDescription} onChange={(val) => handleInput("OtherDescription", val)} />
                <input type="checkbox" checked={formData.ActiveStatus === 1} onChange={(e) => handleInput("ActiveStatus", e.target.checked ? 1 : 0)} />
                <input type="text" value={formData.MetaTitle} onChange={(e) => handleInput("MetaTitle", e.target.value)} />
                <input type="text" value={formData.MetaKeywords} onChange={(e) => handleInput("MetaKeywords", e.target.value)} />
                <input type="text" value={formData.MetaDescriptions} onChange={(e) => handleInput("MetaDescriptions", e.target.value)} />
                <input type="text" value={formData.MetaOgImage} onChange={(e) => handleInput("MetaOgImage", e.target.value)} />
                <input type="text" value={formData.MetaSchema} onChange={(e) => handleInput("MetaSchema", e.target.value)} />
              </div>
            </div>

            <div className={`tabs ${activeTab === "tab-categories" ? "active" : ""}`}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: "600" }}>Assign Categories to this Service</h2>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "15px", background: "#f9f9f9", padding: "20px", borderRadius: "8px", border: "1px solid #eee" }}>
                {categoriesResponse?.data?.map(cat => (
                  <div
                    key={cat.CategoryID}
                    onClick={() => handleToggleCategory(cat.CategoryID)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px",
                      background: "#fff",
                      border: "1px solid #ddd",
                      borderRadius: "6px",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: selectedCategoryIDs.includes(cat.CategoryID) ? "0 0 0 2px #d56a0f" : "none"
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryIDs.includes(cat.CategoryID)}
                      onChange={() => { }}
                      style={{ cursor: "pointer" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#333" }}>{cat.CategoryName}</span>
                  </div>
                ))}
                {(!categoriesResponse || categoriesResponse.data?.length === 0) && <p style={{ color: "#999" }}>No categories available.</p>}
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
              <Link href="/cubastion-admin/manage-services" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
