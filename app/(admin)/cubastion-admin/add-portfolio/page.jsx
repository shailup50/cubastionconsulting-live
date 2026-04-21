'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "@/components/backendcomponents/SunEditor";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetPortfolioByIdQuery,
  useCreatePortfolioMutation,
  useUpdatePortfolioMutation,
  useGetPortfolioHighlightsQuery,
  useSavePortfolioHighlightsMutation,
} from "@/store/backendSlice/portfolioAPISlice";
import { useGetAllAuthorsQuery } from "@/store/backendSlice/authorAPISlice";
import { useGetAllIndustriesQuery } from "@/store/backendSlice/industryAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";

const tdStyle = { padding: "6px", border: "1px solid #ddd" };
const thStyle = { padding: "8px", border: "1px solid #ddd", background: "#f1f1f1", textAlign: "left", fontWeight: "600" };
const addRowBtnStyle = { marginLeft: "auto", display: "block", marginBottom: "15px", padding: "6px 14px", background: "#d56a0f", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" };

const TAB_LIST = [
  { id: "tab-main", label: "Portfolio Data" },
  { id: "tab-highlights", label: "Highlights" },
];

export default function AddUpdatePortfolio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const PortfolioID = searchParams.get("ID");
  const adminUser = useSelector((state) => state.adminAuth?.adminUser);

  const [activeTab, setActiveTab] = useState("tab-main");

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: authorsData } = useGetAllAuthorsQuery();
  const { data: industriesData } = useGetAllIndustriesQuery();

  const { data: portfolioResponse, isSuccess, isLoading: isFetching } = useGetPortfolioByIdQuery(PortfolioID, {
    skip: !PortfolioID,
    refetchOnMountOrArgChange: true
  });

  const { data: highlightsResponse } = useGetPortfolioHighlightsQuery(PortfolioID, { skip: !PortfolioID });

  const [createPortfolio, { isLoading: isCreating }] = useCreatePortfolioMutation();
  const [updatePortfolio, { isLoading: isUpdating }] = useUpdatePortfolioMutation();
  const [saveHighlights] = useSavePortfolioHighlightsMutation();

  const [formData, setFormData] = useState({
    AuthorID: "",
    IndustryID: "",
    PortfolioType: "",
    PortfolioName: "",
    PortfolioNameURL: "",
    PortfolioTopHeading: "",
    PortfolioImage: "",
    PortfolioBannerImage: "",
    PortfolioReelToReal: "",
    PortfolioProblemSolving: "",
    PortfolioPowerInnovation: "",
    PortfolioAIAndIndustry: "",
    DisplayOrder: 1,
    ActiveStatus: 1,
    DisplayOnHome: 1,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "{}",
  });

  const [previews, setPreviews] = useState({ PortfolioImage: "", PortfolioBannerImage: "" });
  const [selectedFiles, setSelectedFiles] = useState({ PortfolioImage: null, PortfolioBannerImage: null });
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const [highlightRows, setHighlightRows] = useState([{ Question: "" }]);

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && portfolioResponse?.data) {
      const data = Array.isArray(portfolioResponse.data) ? portfolioResponse.data[0] : portfolioResponse.data;
      setFormData({
        AuthorID: data.AuthorID || "",
        IndustryID: data.IndustryID || "",
        PortfolioType: data.PortfolioType || "",
        PortfolioName: data.PortfolioName || "",
        PortfolioNameURL: data.PortfolioNameURL || "",
        PortfolioTopHeading: data.PortfolioTopHeading || "",
        PortfolioImage: data.PortfolioImage || "",
        PortfolioBannerImage: data.PortfolioBannerImage || "",
        PortfolioReelToReal: data.PortfolioReelToReal || "",
        PortfolioProblemSolving: data.PortfolioProblemSolving || "",
        PortfolioPowerInnovation: data.PortfolioPowerInnovation || "",
        PortfolioAIAndIndustry: data.PortfolioAIAndIndustry || "",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
        DisplayOnHome: data.DisplayOnHome ?? 1,
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || "{}",
      });
      setPreviews({
        PortfolioImage: data.PortfolioImage ? `/uploads/onlineImages/PortfolioImages/${data.PortfolioImage}` : "",
        PortfolioBannerImage: data.PortfolioBannerImage ? `/uploads/onlineImages/PortfolioImages/${data.PortfolioBannerImage}` : "",
      });
    }
  }, [isSuccess, portfolioResponse]);

  useEffect(() => {
    if (highlightsResponse?.data?.length > 0) {
      setHighlightRows(highlightsResponse.data.map(h => ({ Question: h.Question || "" })));
    }
  }, [highlightsResponse]);

  const generateSlug = (text) => text.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");

  const handleInput = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "PortfolioName" && !PortfolioID) {
        updated.PortfolioNameURL = generateSlug(value);
        updated.MetaTitle = `${value} | Cubastion`;
      }
      return updated;
    });

    setFormErrors(prev => {
      const errors = { ...prev };
      if (errors[field]) delete errors[field];
      // Fix: when name is entered, slug is auto-filled so clear its error too
      if (field === "PortfolioName" && errors["PortfolioNameURL"]) {
        delete errors["PortfolioNameURL"];
      }
      return errors;
    });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const slug = formData.PortfolioNameURL || generateSlug(formData.PortfolioName) || 'portfolio';
    const newFile = new File([file], `${slug}-${field.toLowerCase()}.${ext}`, { type: file.type });

    setSelectedFiles(prev => ({ ...prev, [field]: newFile }));
    setPreviews(prev => ({ ...prev, [field]: URL.createObjectURL(newFile) }));
    handleInput(field, newFile.name);
  };

  const validationRules = {
    PortfolioName: { required: true, requiredMessage: "Please enter portfolio name." },
    PortfolioNameURL: { required: true, requiredMessage: "Please enter portfolio URL." },
    PortfolioType: { required: true, requiredMessage: "Please enter type/category." },
    PortfolioTopHeading: { required: true, requiredMessage: "Please enter top heading." },
    AuthorID: { required: true, requiredMessage: "Please select an author." },
    IndustryID: { required: true, requiredMessage: "Please select an industry." },
    PortfolioImage: { required: true, requiredMessage: "Please upload a thumbnail image." },
    PortfolioBannerImage: { required: true, requiredMessage: "Please upload a banner image." },
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
        PortfolioImage: formData.PortfolioImage,
        PortfolioBannerImage: formData.PortfolioBannerImage
      };

      for (const [field, file] of Object.entries(selectedFiles)) {
        if (file) {
          const ud = new FormData();
          ud.append('file', file);
          ud.append('folder', 'uploads/onlineImages/PortfolioImages');
          ud.append('fileName', file.name);
          const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
          if (res.success) finalFileNames[field] = res.fileName;
          else throw new Error(`${field} upload failed`);
        }
      }

      const cleanEditorContent = (val) => (val === "<p><br></p>" || !val) ? "" : val;

      const payload = {
        AuthorID: parseInt(formData.AuthorID),
        IndustryID: parseInt(formData.IndustryID),
        PortfolioType: formData.PortfolioType || "",
        PortfolioName: formData.PortfolioName,
        PortfolioNameURL: formData.PortfolioNameURL,
        PortfolioTopHeading: formData.PortfolioTopHeading || "",
        PortfolioImage: finalFileNames.PortfolioImage,
        PortfolioBannerImage: finalFileNames.PortfolioBannerImage,
        PortfolioReelToReal: cleanEditorContent(formData.PortfolioReelToReal),
        PortfolioProblemSolving: cleanEditorContent(formData.PortfolioProblemSolving),
        PortfolioPowerInnovation: cleanEditorContent(formData.PortfolioPowerInnovation),
        PortfolioAIAndIndustry: cleanEditorContent(formData.PortfolioAIAndIndustry),
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        ActiveStatus: parseInt(formData.ActiveStatus),
        DisplayOnHome: parseInt(formData.DisplayOnHome),
        MetaTitle: formData.MetaTitle || "",
        MetaKeywords: formData.MetaKeywords || "",
        MetaDescriptions: formData.MetaDescriptions || "",
        MetaSchema: formData.MetaSchema || "{}",
        UpdatedBy: userName
      };

      let targetID = PortfolioID;
      if (PortfolioID) {
        const res = await updatePortfolio({ id: parseInt(PortfolioID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createPortfolio(payload).unwrap();
        if (res.status || res.success) {
          targetID = res.PortfolioID || res.data?.PortfolioID;
        } else {
          throw new Error(res.message || "Creation failed");
        }
      }
      if (targetID) {
        const validHighlights = highlightRows.filter(r => r.Question.trim());
        const highlightsPayload = {
          PortfolioID: parseInt(targetID),
          Highlights: validHighlights.map(h => ({ Question: h.Question }))
        };
        await saveHighlights(highlightsPayload).unwrap();
      }
      toast.success("Portfolio saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-portfolio");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  const addRow = () => {
    if (highlightRows.length > 0) {
      const last = highlightRows[highlightRows.length - 1];
      if (!last.Question) return toast.error("Please fill the previous row item first.");
    }
    setHighlightRows(p => [...p, { Question: "" }]);
  };

  const removeRow = (i) => {
    if (!confirm("Remove highlight?")) return;
    setHighlightRows(p => p.filter((_, idx) => idx !== i));
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{PortfolioID ? "Update" : "Add"} Portfolio</h1>

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
                  <label>Portfolio Name*</label>
                  <input type="text" placeholder="e.g. Acme Identity" value={formData.PortfolioName} onChange={(e) => handleInput("PortfolioName", e.target.value)} className={formErrors.PortfolioName ? "error-input" : ""} />
                  {formErrors.PortfolioName && <p className="error">{formErrors.PortfolioName}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Name URL / Slug*</label>
                  <input type="text" placeholder="acme-identity" value={formData.PortfolioNameURL} onChange={(e) => handleInput("PortfolioNameURL", e.target.value)} className={formErrors.PortfolioNameURL ? "error-input" : ""} />
                  {formErrors.PortfolioNameURL && <p className="error">{formErrors.PortfolioNameURL}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Type / Category*</label>
                  <select
                    value={formData.PortfolioType}
                    onChange={(e) => handleInput("PortfolioType", e.target.value)}
                    className={formErrors.PortfolioType ? "error-input" : ""}
                  >
                    <option value="">Select Type / Category</option>
                    <option value="Blog">Blog</option>
                    <option value="CaseStudy">CaseStudy</option>
                  </select>
                  {formErrors.PortfolioType && <p className="error">{formErrors.PortfolioType}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Top Heading*</label>
                  <input type="text" placeholder="Transforming Acme's Brand" value={formData.PortfolioTopHeading} onChange={(e) => handleInput("PortfolioTopHeading", e.target.value)} className={formErrors.PortfolioTopHeading ? "error-input" : ""} />
                  {formErrors.PortfolioTopHeading && <p className="error">{formErrors.PortfolioTopHeading}</p>}
                </div>
              </div>

              <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Author*</label>
                  <select value={formData.AuthorID} onChange={(e) => handleInput("AuthorID", e.target.value)} className={formErrors.AuthorID ? "error-input" : ""}>
                    <option value="">Select Author</option>
                    {authorsData?.data?.map(a => <option key={a.AuthorID} value={a.AuthorID}>{a.AuthorName}</option>)}
                  </select>
                  {formErrors.AuthorID && <p className="error">{formErrors.AuthorID}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Industry*</label>
                  <select value={formData.IndustryID} onChange={(e) => handleInput("IndustryID", e.target.value)} className={formErrors.IndustryID ? "error-input" : ""}>
                    <option value="">Select Industry</option>
                    {industriesData?.data?.map(i => <option key={i.IndustryID} value={i.IndustryID}>{i.IndustryName}</option>)}
                  </select>
                  {formErrors.IndustryID && <p className="error">{formErrors.IndustryID}</p>}
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Thumbnail Photo*</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "PortfolioImage")} className={formErrors.PortfolioImage ? "error-input" : ""} style={{ width: "100%" }} />
                      {formErrors.PortfolioImage && <p className="error">{formErrors.PortfolioImage}</p>}
                    </div>
                    {previews.PortfolioImage && <img src={previews.PortfolioImage} alt="preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />}
                  </div>
                </div>
                <div className="form-group" style={{ flex: "1 1 24%" }}>
                  <label>Banner Image*</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "PortfolioBannerImage")} className={formErrors.PortfolioBannerImage ? "error-input" : ""} style={{ width: "100%" }} />
                      {formErrors.PortfolioBannerImage && <p className="error">{formErrors.PortfolioBannerImage}</p>}
                    </div>
                    {previews.PortfolioBannerImage && <img src={previews.PortfolioBannerImage} alt="preview" height={45} style={{ borderRadius: "4px", border: "1px solid #ddd" }} />}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: "20px" }}>
                <label>Reel to Real Content</label>
                <SunEditor value={formData.PortfolioReelToReal} onChange={(val) => handleInput("PortfolioReelToReal", val)} height={140} />
              </div>
              <div className="form-group" style={{ marginTop: "20px" }}>
                <label>Problem Solving Content</label>
                <SunEditor value={formData.PortfolioProblemSolving} onChange={(val) => handleInput("PortfolioProblemSolving", val)} height={140} />
              </div>
              <div className="form-group" style={{ marginTop: "20px" }}>
                <label>Power of Innovation Content</label>
                <SunEditor value={formData.PortfolioPowerInnovation} onChange={(val) => handleInput("PortfolioPowerInnovation", val)} height={140} />
              </div>
              <div className="form-group" style={{ marginTop: "20px" }}>
                <label>AI and Industry Impact Content</label>
                <SunEditor value={formData.PortfolioAIAndIndustry} onChange={(val) => handleInput("PortfolioAIAndIndustry", val)} height={140} />
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
                <input type="text" placeholder="Short SEO description" value={formData.MetaDescriptions} onChange={(e) => handleInput("MetaDescriptions", e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
              <div className="form-group" style={{ marginBottom: "30px" }}>
                <label>Meta Schema (JSON)</label>
                <input type="text" placeholder='{"@context": "https://schema.org", ...}' value={formData.MetaSchema} onChange={(e) => handleInput("MetaSchema", e.target.value)} style={{ width: "100%", padding: "10px", border: "1px solid #ddd", borderRadius: "4px" }} />
              </div>
            </div>

            <div className={`tabs ${activeTab === "tab-highlights" ? "active" : ""}`}>
              <button type="button" onClick={addRow} style={addRowBtnStyle}>+ Add Highlight</button>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ ...thStyle, width: "50px" }}>#</th>
                    <th style={thStyle}>Highlight Point*</th>
                    <th style={{ ...thStyle, width: "80px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {highlightRows.map((row, i) => (
                    <tr key={i}>
                      <td style={{ ...tdStyle, textAlign: "center" }}>{i + 1}</td>
                      <td style={tdStyle}>
                        <input
                          type="text"
                          style={{ width: "100%", border: "none", outline: "none" }}
                          placeholder="Enter highlight point..."
                          value={row.Question}
                          onChange={(e) => {
                            const newRows = [...highlightRows];
                            newRows[i].Question = e.target.value;
                            setHighlightRows(newRows);
                          }}
                        />
                      </td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        {i > 0 && <button type="button" onClick={() => removeRow(i)} style={{ color: "red", background: "none", border: "none", cursor: "pointer", fontSize: "16px" }}>✕</button>}
                      </td>
                    </tr>
                  ))}
                  {highlightRows.length === 0 && (
                    <tr><td colSpan="3" style={{ ...tdStyle, textAlign: "center", padding: "20px" }}>No highlights added yet.</td></tr>
                  )}
                </tbody>
              </table>
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
              <Link href="/cubastion-admin/manage-portfolio" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
