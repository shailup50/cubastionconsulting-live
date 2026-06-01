'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "@/components/backendcomponents/SunEditor";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetIndustryByIdQuery,
  useCreateIndustryMutation,
  useUpdateIndustryMutation,
  useGetIndustryFaqsQuery,
  useSaveIndustryFaqsMutation,
  useGetIndustrySolutionsQuery,
  useSaveIndustrySolutionsMutation,
} from "@/store/backendSlice/industryAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";

const tdStyle = { padding: "6px", border: "1px solid #ddd" };
const thStyle = { padding: "8px", border: "1px solid #ddd", background: "#f1f1f1", textAlign: "left", fontWeight: "600" };
const addRowBtnStyle = { marginLeft: "auto", display: "block", marginBottom: "15px", padding: "6px 14px", background: "#d56a0f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };

const TAB_LIST = [
  { id: "tab-main", label: "Industry Data" },
  { id: "tab-faqs", label: "FAQs" },
  { id: "tab-solutions", label: "Solutions" },
];

export default function AddUpdateIndustry() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const IndustryID = searchParams.get("ID");
  const adminUser = useSelector((state: any) => state.adminAuth?.adminUser);

  const [activeTab, setActiveTab] = useState("tab-main");

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: industryResponse, isSuccess, isLoading: isFetching } = useGetIndustryByIdQuery(IndustryID, {
    skip: !IndustryID,
    refetchOnMountOrArgChange: true
  });

  const { data: faqsResponse } = useGetIndustryFaqsQuery(IndustryID, { skip: !IndustryID });
  const { data: solutionsResponse } = useGetIndustrySolutionsQuery(IndustryID, { skip: !IndustryID });

  const [createIndustry, { isLoading: isCreating }] = useCreateIndustryMutation();
  const [updateIndustry, { isLoading: isUpdating }] = useUpdateIndustryMutation();
  const [saveFaqs] = useSaveIndustryFaqsMutation();
  const [saveSolutions] = useSaveIndustrySolutionsMutation();

  const [formData, setFormData] = useState({
    IndustryName: "",
    IndustryNameURL: "",
    IndustryImage: "",
    IndustryBannerImage: "",
    IndustryTagLine: "",
    DescriptionHeading: "",
    Description: "",
    OtherDescription: "",
    DisplayOrder: 1,
    ActiveStatus: 1,
    DisplayOnHome: 0,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "",
  });

  const [previews, setPreviews] = useState({ IndustryImage: "", IndustryBannerImage: "" });
  const [selectedFiles, setSelectedFiles] = useState({ IndustryImage: null, IndustryBannerImage: null });
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [faqRows, setFaqRows] = useState([{ Question: "", Answer: "" }]);
  const [solutionRows, setSolutionRows] = useState([{ IndustrySolutionHeading: "", IndustrySolutionTagline: "", IndustrySolutionImage: "" }]);
  const [solutionPreviews, setSolutionPreviews] = useState({});
  const [solutionFiles, setSolutionFiles] = useState({});

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && industryResponse?.data) {
      const data = Array.isArray(industryResponse.data) ? industryResponse.data[0] : industryResponse.data;
      setFormData({
        IndustryName: data.IndustryName || "",
        IndustryNameURL: data.IndustryNameURL || "",
        IndustryImage: data.IndustryImage || "",
        IndustryBannerImage: data.IndustryBannerImage || "",
        IndustryTagLine: data.IndustryTagLine || "",
        DescriptionHeading: data.DescriptionHeading || "",
        Description: data.Description || "",
        OtherDescription: data.OtherDescription || "",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
        DisplayOnHome: data.DisplayOnHome ?? 0,
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || "",
      });
      setPreviews({
        IndustryImage: data.IndustryImage ? `/uploads/onlineImages/IndustryImages/${data.IndustryImage}` : "",
        IndustryBannerImage: data.IndustryBannerImage ? `/uploads/onlineImages/IndustryImages/${data.IndustryBannerImage}` : "",
      });
    }
  }, [isSuccess, industryResponse]);

  useEffect(() => {
    if (faqsResponse?.data?.length > 0) {
      setFaqRows(faqsResponse.data.map(f => ({ Question: f.Question || "", Answer: f.Answer || "" })));
    }
  }, [faqsResponse]);

  useEffect(() => {
    if (solutionsResponse?.data?.length > 0) {
      setSolutionRows(solutionsResponse.data.map(s => ({
        IndustrySolutionHeading: s.IndustrySolutionHeading || "",
        IndustrySolutionTagline: s.IndustrySolutionTagline || "",
        IndustrySolutionImage: s.IndustrySolutionImage || ""
      })));
      const existingPreviews = {};
      solutionsResponse.data.forEach((s, i) => {
        if (s.IndustrySolutionImage) existingPreviews[i] = `/uploads/onlineImages/SolutionImages/${s.IndustrySolutionImage}`;
      });
      setSolutionPreviews(existingPreviews);
    }
  }, [solutionsResponse]);

  const generateSlug = (text: string) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleInput = (field: string, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "IndustryName" && !IndustryID) {
        updated.IndustryNameURL = generateSlug(value);
        updated.MetaTitle = `${value} | Cubastion`;
      }
      return updated;
    });
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
    const slug = formData.IndustryNameURL || generateSlug(formData.IndustryName) || 'industry';
    const newFile = new File([file], `${slug}-${field.toLowerCase()}.${ext}`, { type: file.type });

    setSelectedFiles(prev => ({ ...prev, [field]: newFile }));
    setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(newFile) }));
    handleInput(field, newFile.name);
  };

  const validationRules = {
    IndustryName: { required: true, requiredMessage: "Please enter industry name." },
    IndustryNameURL: { required: true, requiredMessage: "Please enter industry URL." },
    IndustryImage: { required: true, requiredMessage: "Please upload a poster image." },
    IndustryBannerImage: { required: true, requiredMessage: "Please upload a banner image." },
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      if (activeTab !== "tab-main") setActiveTab("tab-main");
      setFormErrors(errors);
      return;
    }
    const filledFaqs = faqRows.filter(r => r.Question || r.Answer);
    if (filledFaqs.some(r => !r.Question || !r.Answer)) {
      setActiveTab("tab-faqs");
      return toast.error("Please provide both Question and Answer for all FAQ items.");
    }
    const userName = adminUser?.UserFullName || "Admin";
    try {
      setIsUploading(true);
      const finalFileNames = {
        IndustryImage: formData.IndustryImage,
        IndustryBannerImage: formData.IndustryBannerImage
      };
      for (const [field, file] of Object.entries(selectedFiles)) {
        if (file) {
          const ud = new FormData();
          ud.append('file', file);
          ud.append('folder', 'uploads/onlineImages/IndustryImages');
          ud.append('fileName', file.name);
          const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
          if (res.success) finalFileNames[field] = res.fileName;
          else throw new Error(`${field} upload failed`);
        }
      }
      const payload = {
        ActiveStatus: parseInt(formData.ActiveStatus),
        Description: (formData.Description === "<p><br></p>" || !formData.Description) ? "" : formData.Description,
        DescriptionHeading: formData.DescriptionHeading || "",
        DisplayOnHome: parseInt(formData.DisplayOnHome),
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        IndustryBannerImage: finalFileNames.IndustryBannerImage,
        IndustryImage: finalFileNames.IndustryImage,
        IndustryName: formData.IndustryName,
        IndustryNameURL: formData.IndustryNameURL,
        IndustryTagLine: formData.IndustryTagLine || "",
        MetaDescriptions: formData.MetaDescriptions || "",
        MetaKeywords: formData.MetaKeywords || "",
        MetaSchema: formData.MetaSchema || "",
        MetaTitle: formData.MetaTitle || "",
        OtherDescription: (formData.OtherDescription === "<p><br></p>" || !formData.OtherDescription) ? "" : formData.OtherDescription,
        UpdatedBy: userName
      };

      let targetID = IndustryID;
      try {
        if (IndustryID) {
          const res = await updateIndustry({ id: parseInt(IndustryID), body: payload }).unwrap();
          if (!res.success && !res.status) throw new Error(res.message || "Update failed");
        } else {
          const res = await createIndustry(payload).unwrap();
          if (res.success || res.status) {
            targetID = res.IndustryID || res.data?.IndustryID;
          } else {
            throw new Error(res.message || "Creation failed");
          }
        }
      } catch (mutationErr) {
        const errMsg = mutationErr.data?.message || mutationErr.message || "An error occurred while saving the industry.";
        throw new Error(errMsg);
      }
      if (targetID) {
        const validFaqs = faqRows.filter(r => r.Question.trim() && r.Answer.trim());
        const faqsPayload = {
          IndustryID: parseInt(targetID),
          FAQs: validFaqs.map(f => ({ Question: f.Question, Answer: f.Answer }))
        };
        await saveFaqs(faqsPayload).unwrap();
        const processedSolutions = [];
        for (let i = 0; i < solutionRows.length; i++) {
          const row = solutionRows[i];
          let fileName = row.IndustrySolutionImage;
          const file = solutionFiles[i];
          if (file) {
            const ud = new FormData();
            ud.append('file', file);
            ud.append('folder', 'uploads/onlineImages/SolutionImages');
            ud.append('fileName', file.name);
            const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
            if (res.success) fileName = res.fileName;
          }
          if (row.IndustrySolutionHeading.trim()) {
            processedSolutions.push({
              IndustrySolutionHeading: row.IndustrySolutionHeading,
              IndustrySolutionTagline: row.IndustrySolutionTagline || "",
              IndustrySolutionImage: fileName || ""
            });
          }
        }
        const solutionsPayload = {
          IndustryID: parseInt(targetID),
          Solutions: processedSolutions
        };
        await saveSolutions(solutionsPayload).unwrap();
      }
      toast.success("Industry configuration saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-industries");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  const addRow = (setter: any, rows: any[], reqFields: string[]) => {
    if (rows.length > 0) {
      const last = rows[rows.length - 1];
      if (reqFields.some(f => !last[f])) return toast.error("Please fill the previous row items first.");
    }
    setter(p => [...p, { Question: "", Answer: "", IndustrySolutionHeading: "", IndustrySolutionTagline: "", IndustrySolutionImage: "" }]);
  };

  const removeRow = (setter: any, i: number) => {
    if (!confirm("Are you sure to remove this row?")) return;
    setter(p => p.filter((_, idx) => idx !== i));
  };

  const updateRow = (setter: any, index: number, field: string, value: any) => {
    setter(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  const handleSolutionFile = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const newFile = new File([file], `solution-${Date.now()}-${i}.${ext}`, { type: file.type });

    setSolutionFiles(prev => ({ ...prev, [i]: newFile }));
    setSolutionPreviews(prev => ({ ...prev, [i]: URL.createObjectURL(newFile) }));
    updateRow(setSolutionRows, i, "IndustrySolutionImage", newFile.name);
  };

  const TabNavigation = ({ currentIdx }: { currentIdx: number }) => (
    <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginTop: "20px" }}>
      {currentIdx > 0 && (
        <button className="back-btn" onClick={() => { setActiveTab(TAB_LIST[currentIdx - 1].id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          Previous
        </button>
      )}
      {currentIdx < TAB_LIST.length - 1 && (
        <button className="submit-btn" style={{ width: "auto", margin: "0" }} onClick={() => { setActiveTab(TAB_LIST[currentIdx + 1].id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          Next
        </button>
      )}
    </div>
  );

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{IndustryID ? "Update" : "Add"} Industry</h1>

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

          <div className="tab-nav-content" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '0 0 8px 8px' }}>
            <div className={`tabs ${activeTab === "tab-main" ? "active" : ""}`}>
              <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Industry Name*</label>
                  <input type="text" placeholder="e.g. Healthcare, Finance" value={formData.IndustryName} onChange={(e) => handleInput("IndustryName", e.target.value)} className={formErrors.IndustryName ? "error-input" : ""} />
                  {formErrors.IndustryName && <p className="error">{formErrors.IndustryName}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Industry URL*</label>
                  <input type="text" placeholder="industry-name-slug" value={formData.IndustryNameURL} onChange={(e) => handleInput("IndustryNameURL", e.target.value)} className={formErrors.IndustryNameURL ? "error-input" : ""} />
                  {formErrors.IndustryNameURL && <p className="error">{formErrors.IndustryNameURL}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Industry Tagline</label>
                  <input type="text" placeholder="Brief tagline descriptive" value={formData.IndustryTagLine} onChange={(e) => handleInput("IndustryTagLine", e.target.value)} />
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Description Heading</label>
                  <input type="text" placeholder="Title for description section" value={formData.DescriptionHeading} onChange={(e) => handleInput("DescriptionHeading", e.target.value)} />
                </div>
              </div>
              <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div className="form-group" style={{ marginTop: "15px" }}>
                  <label>Main Description</label>
                  <input
                    type="text"
                    value={formData.Description}
                    onChange={(e) => handleInput("Description", e.target.value)}
                    style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
                  />
                </div>
                <div className="form-group" style={{ flex: "0 0 30%" }}>
                  <label>Poster Image*</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "IndustryImage")} className={formErrors.IndustryImage ? "error-input" : ""} style={{ width: "100%" }} />
                      {formErrors.IndustryImage && <p className="error">{formErrors.IndustryImage}</p>}
                    </div>
                    {previews.IndustryImage && <img src={previews.IndustryImage} alt="Preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />}
                  </div>
                </div>
                <div className="form-group" style={{ flex: "0 0 30%" }}>
                  <label>Banner Image*</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "IndustryBannerImage")} className={formErrors.IndustryBannerImage ? "error-input" : ""} style={{ width: "100%" }} />
                      {formErrors.IndustryBannerImage && <p className="error">{formErrors.IndustryBannerImage}</p>}
                    </div>
                    {previews.IndustryBannerImage && <img src={previews.IndustryBannerImage} alt="Preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />}
                  </div>
                </div>
              </div>



              <div className="form-group" style={{ marginTop: "15px", display: "none" }}>
                <label>Other Description</label>
                <SunEditor value={formData.OtherDescription} onChange={(val) => handleInput("OtherDescription", val)} />
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
                <div style={{ display: "flex", alignItems: "center", gap: "8px", paddingBottom: "10px" }}>
                  <input type="checkbox" id="chkHome" checked={formData.DisplayOnHome === 1} onChange={(e) => handleInput("DisplayOnHome", e.target.checked ? 1 : 0)} />
                  <label htmlFor="chkHome" style={{ fontWeight: "600", cursor: "pointer" }}>Display on Home</label>
                </div>
              </div>

              <h2 style={{ marginTop: "30px" }}>Only for SEO Purpose</h2>
              <hr />
              <div className="form-group">
                <label>Meta Title</label>
                <input type="text" placeholder="Browser Tab Title" value={formData.MetaTitle} onChange={(e) => handleInput("MetaTitle", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Meta Keywords</label>
                <input type="text" placeholder="Keywords (comma separated)" value={formData.MetaKeywords} onChange={(e) => handleInput("MetaKeywords", e.target.value)} />
              </div>
              <div className="form-group">
                <label>Meta Description</label>
                <input type="text" placeholder="Short SEO description" value={formData.MetaDescriptions} onChange={(e) => handleInput("MetaDescriptions", e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div className="form-group">
                <label>Meta Schema (JSON)</label>
                <input type="text" placeholder='{"@context": "https://schema.org", ...}' value={formData.MetaSchema} onChange={(e) => handleInput("MetaSchema", e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <TabNavigation currentIdx={0} />
            </div>

            <div className={`tabs ${activeTab === "tab-faqs" ? "active" : ""}`}>
              <h2 style={{ fontSize: "18px", margin: "0" }}> Industry FAQS</h2>
              <hr />
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Question*</th>
                    <th style={thStyle}>Answer*</th>
                    <th style={{ ...thStyle, width: "100px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {faqRows.map((row, i) => (
                    <tr key={i}>
                      <td style={tdStyle}><input type="text" placeholder="Enter Question" value={row.Question} onChange={(e) => updateRow(setFaqRows, i, "Question", e.target.value)} style={{ width: "100%" }} /></td>
                      <td style={tdStyle}><input type="text" placeholder="Enter Answer" value={row.Answer} onChange={(e) => updateRow(setFaqRows, i, "Answer", e.target.value)} style={{ width: "100%" }} /></td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {i > 0 && <button onClick={() => removeRow(setFaqRows, i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>✕</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="addnew-btn" onClick={() => addRow(setFaqRows, faqRows, ["Question", "Answer"])} style={addRowBtnStyle}>+ Add FAQ</button>
              <TabNavigation currentIdx={1} />
            </div>

            <div className={`tabs ${activeTab === "tab-solutions" ? "active" : ""}`}>
              <h2 style={{ fontSize: "18px", margin: "0" }}> Industry Solutions</h2>
              <hr />
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "15px" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Heading*</th>
                    <th style={thStyle}>Tagline</th>
                    <th style={thStyle}>Solution Image</th>
                    <th style={{ ...thStyle, width: "100px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {solutionRows.map((row, i) => (
                    <tr key={i}>
                      <td style={tdStyle}><input type="text" placeholder="Solution Heading" value={row.IndustrySolutionHeading} onChange={(e) => updateRow(setSolutionRows, i, "IndustrySolutionHeading", e.target.value)} style={{ width: "100%" }} /></td>
                      <td style={tdStyle}><input type="text" placeholder="Solution Tagline" value={row.IndustrySolutionTagline} onChange={(e) => updateRow(setSolutionRows, i, "IndustrySolutionTagline", e.target.value)} style={{ width: "100%" }} /></td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <input type="file" accept="image/*" onChange={(e) => handleSolutionFile(e, i)} style={{ width: "100%" }} />
                          {solutionPreviews[i] && <img src={solutionPreviews[i]} alt="Preview" height={35} />}
                        </div>
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {i > 0 && <button onClick={() => removeRow(setSolutionRows, i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>✕</button>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="addnew-btn" onClick={() => addRow(setSolutionRows, solutionRows, ["IndustrySolutionHeading"])} style={addRowBtnStyle}>+ Add Solution</button>
              <TabNavigation currentIdx={2} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
