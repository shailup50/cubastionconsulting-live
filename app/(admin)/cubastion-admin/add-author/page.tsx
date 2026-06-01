'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetAuthorByIdQuery,
  useCreateAuthorMutation,
  useUpdateAuthorMutation,
} from "@/store/backendSlice/authorAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";

export default function AddUpdateAuthor() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const AuthorID = searchParams.get("ID");
  const adminUser = useSelector((state: any) => state.adminAuth?.adminUser);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: authorResponse, isSuccess, isLoading: isFetching } = useGetAuthorByIdQuery(AuthorID, {
    skip: !AuthorID,
    refetchOnMountOrArgChange: true
  });

  const [createAuthor, { isLoading: isCreating }] = useCreateAuthorMutation();
  const [updateAuthor, { isLoading: isUpdating }] = useUpdateAuthorMutation();

  const [formData, setFormData] = useState({
    AuthorName: "",
    AuthorTaglin: "",
    AuthorImage: "",
    DisplayOrder: 1,
    ActiveStatus: 1,
  });

  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && authorResponse?.data) {
      const data = Array.isArray(authorResponse.data) ? authorResponse.data[0] : authorResponse.data;
      setFormData({
        AuthorName: data.AuthorName || "",
        AuthorTaglin: data.AuthorTaglin || "",
        AuthorImage: data.AuthorImage || "",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
      });
      if (data.AuthorImage) {
        setPreview(`/uploads/onlineImages/AuthorImages/${data.AuthorImage}`);
      }
    }
  }, [isSuccess, authorResponse]);

  const handleInput = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => {
      const errors = { ...prev };
      if (errors[field]) delete errors[field];
      return errors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split('.').pop();
    const slug = formData.AuthorName?.toLowerCase().replace(/\s+/g, "-") || 'author';
    const newFile = new File([file], `${slug}-${Date.now()}.${ext}`, { type: file.type });
    setSelectedFile(newFile);
    setPreview(URL.createObjectURL(newFile));
    handleInput("AuthorImage", newFile.name);
  };

  const validationRules = {
    AuthorName: { required: true, requiredMessage: "Please enter author name." },
    AuthorTaglin: { required: true, requiredMessage: "Please enter a tagline." },
    AuthorImage: { required: true, requiredMessage: "Please upload an author photo." },
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    let finalImage = formData.AuthorImage;
    const userName = adminUser?.UserFullName || "Admin";

    try {
      setIsUploading(true);

      if (selectedFile) {
        const ud = new FormData();
        ud.append('file', selectedFile);
        ud.append('folder', 'uploads/onlineImages/AuthorImages');
        ud.append('fileName', selectedFile.name);
        const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
        if (res.success) finalImage = res.fileName;
        else throw new Error("Image upload failed");
      }

      const payload = {
        AuthorName: formData.AuthorName,
        AuthorTaglin: formData.AuthorTaglin || "",
        AuthorImage: finalImage,
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        ActiveStatus: parseInt(formData.ActiveStatus),
        UpdatedBy: userName
      };

      if (AuthorID) {
        const res = await updateAuthor({ id: parseInt(AuthorID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createAuthor(payload).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Creation failed");
      }

      toast.success("Author saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-authors");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{AuthorID ? "Update" : "Add"} Author</h1>
        <div className="tabbing_sec">
          <div className="tab-nav-content" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>
            <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px", maxWidth: "70%" }}>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Author Name*</label>
                <input type="text" placeholder="e.g. John Doe" value={formData.AuthorName} onChange={(e) => handleInput("AuthorName", e.target.value)} className={formErrors.AuthorName ? "error-input" : ""} />
                {formErrors.AuthorName && <p className="error">{formErrors.AuthorName}</p>}
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Tagline*</label>
                <input type="text" placeholder="e.g. Tech Writer & Blogger" value={formData.AuthorTaglin} onChange={(e) => handleInput("AuthorTaglin", e.target.value)} className={formErrors.AuthorTaglin ? "error-input" : ""} />
                {formErrors.AuthorTaglin && <p className="error">{formErrors.AuthorTaglin}</p>}
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Author Photo*</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} className={formErrors.AuthorImage ? "error-input" : ""} style={{ width: "100%" }} />
                    {formErrors.AuthorImage && <p className="error">{formErrors.AuthorImage}</p>}
                  </div>
                  {preview && <img src={preview} alt="preview" height={40} />}
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
              <Link href="/cubastion-admin/manage-authors" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
