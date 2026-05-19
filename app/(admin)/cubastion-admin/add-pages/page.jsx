"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import dynamicImport from "next/dynamic";
const SunEditor = dynamicImport(() => import("suneditor-react"), {
  ssr: false,
});
import "suneditor/dist/css/suneditor.min.css";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetPageByIdQuery,
  useCreatePageMutation,
  useUpdatePageMutation,
} from "@/store/backendSlice/pageAPISlice";
import { useSelector } from "react-redux";

export default function AddUpdatePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const PageID = searchParams.get("ID");
  const adminUser = useSelector((state) => state.adminAuth?.adminUser);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(
    undefined,
    {
      refetchOnMountOrArgChange: true,
      pollingInterval: 10000,
    },
  );

  const {
    data: pageResponse,
    isSuccess,
    isLoading: isFetching,
  } = useGetPageByIdQuery(PageID, {
    skip: !PageID,
    refetchOnMountOrArgChange: true,
  });

  const [createPage, { isLoading: isCreating }] = useCreatePageMutation();
  const [updatePage, { isLoading: isUpdating }] = useUpdatePageMutation();

  const [formData, setFormData] = useState({
    StaticPageName: "",
    StaticPageNameURL: "",
    StaticPageImage: "",
    SmallDescription: "",
    Description: "",
    ActiveStatus: 1,
    MetaTitle: "",
    MetaKeywords: "",
    MetaDescriptions: "",
    MetaSchema: "",
  });

  const [preview, setPreview] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (isSuccess && pageResponse?.data) {
      const data = Array.isArray(pageResponse.data)
        ? pageResponse.data[0]
        : pageResponse.data;
      setFormData({
        StaticPageName: data.StaticPageName || "",
        StaticPageNameURL: data.StaticPageNameURL || "",
        StaticPageImage: data.StaticPageImage || "",
        SmallDescription: data.SmallDescription || "",
        Description: data.Description || "",
        ActiveStatus: data.ActiveStatus ?? 1,
        MetaTitle: data.MetaTitle || "",
        MetaKeywords: data.MetaKeywords || "",
        MetaDescriptions: data.MetaDescriptions || "",
        MetaSchema: data.MetaSchema || "",
      });
      if (data.StaticPageImage) {
        setPreview(`/uploads/onlineImages/PageImages/${data.StaticPageImage}`);
      }
    }
  }, [isSuccess, pageResponse]);

  const handleInput = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const ext = file.name.split(".").pop();
    const slug =
      formData.StaticPageNameURL ||
      formData.StaticPageName?.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") ||
      "page";
    const newFile = new File([file], `${slug}-poster.${ext}`, {
      type: file.type,
    });
    setSelectedFile(newFile);
    setPreview(URL.createObjectURL(newFile));
    handleInput("StaticPageImage", newFile.name);
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.StaticPageName?.trim())
      newErrors.StaticPageName = "Title is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    let finalImageName = formData.StaticPageImage;

    try {
      if (selectedFile) {
        setIsUploading(true);
        const uploadData = new FormData();
        uploadData.append("file", selectedFile);
        uploadData.append("folder", "uploads/onlineImages/PageImages");
        uploadData.append("fileName", selectedFile.name);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: uploadData,
        });
        const uploadResult = await uploadRes.json();

        if (!uploadResult.success) {
          toast.error(`Upload failed: ${uploadResult.message}`);
          setIsUploading(false);
          return;
        }
        finalImageName = uploadResult.fileName;
        setIsUploading(false);
      }

      const payload = {
        ...formData,
        StaticPageImage: finalImageName,
        UpdatedBy: adminUser?.UserName || "Admin",
      };

      if (PageID) {
        const res = await updatePage({
          id: parseInt(PageID),
          body: payload,
        }).unwrap();
        if (res.status || res.success) {
          toast.success(res.message || "Page updated successfully");
          router.push("/cubastion-admin/manage-pages");
        } else {
          toast.error(res.message || "Update failed");
        }
      } else {
        const res = await createPage(payload).unwrap();
        if (res.status || res.success) {
          toast.success(res.message || "Page created successfully");
          router.push("/cubastion-admin/manage-pages");
        } else {
          toast.error(res.message || "Creation failed");
        }
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
      setIsUploading(false);
    }
  };

  if (isFetching)
    return (
      <div className="container p-5">
        <div className="loader">Loading...</div>
      </div>
    );

  return (
    <main className="add_update container">
      <div className="form-box h-full rounded-none! overflow-y-auto">
        <h1>{PageID ? "Update" : "Add"} Static Data</h1>
        <div className="tabbing_sec">
          <div className="tab-nav-content">
            <div className="tabs active">
              <div className="form-group-row">
                <div className="form-group displayorder">
                  <label>Title*</label>
                  <input
                    type="text"
                    name="StaticPageName"
                    placeholder="About Company"
                    value={formData.StaticPageName}
                    onChange={(e) => {
                      const val = e.target.value;
                      handleInput("StaticPageName", val);
                      if (!PageID) {
                        const slug = val
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .trim()
                          .replace(/\s+/g, "-");
                        handleInput("StaticPageNameURL", slug);
                        handleInput("MetaTitle", `${val} | Cubastion`);
                      }
                    }}
                    className={errors.StaticPageName ? "error-input" : ""}
                  />
                  {errors.StaticPageName && (
                    <p className="error">{errors.StaticPageName}</p>
                  )}
                </div>
              </div>

              <div
                className="form-group-row"
                style={{
                  display: "none",
                  flexWrap: "wrap",
                  gap: "10px",
                  alignItems: "flex-start",
                }}
              >
                <div
                  className="form-group"
                  style={{ flex: "1 1 30%", minWidth: "250px" }}
                >
                  <label>Small Description*</label>
                  <input
                    type="text"
                    placeholder="Short summary for list views..."
                    value={formData.SmallDescription}
                    onChange={(e) =>
                      handleInput("SmallDescription", e.target.value)
                    }
                  />
                </div>

                <div
                  className="form-group"
                  style={{ flex: "1 1 30%", minWidth: "300px" }}
                >
                  <label>Poster Image*</label>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      style={{ flex: 1 }}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        height={40}
                        style={{
                          borderRadius: "4px",
                          border: "1px solid #ddd",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="form-group" style={{ display: "none" }}>
                <label>Title URL*</label>
                <input
                  type="text"
                  placeholder="About Us"
                  value={formData.StaticPageNameURL}
                  onChange={(e) =>
                    handleInput("StaticPageNameURL", e.target.value)
                  }
                />
              </div>

              <div
                className="form-group"
                style={{ marginTop: "15px", display: "none" }}
              >
                <label>Other Description</label>
                <SunEditor
                  height="300px"
                  setContents={formData.Description}
                  onChange={(val) => handleInput("Description", val)}
                  setOptions={{
                    buttonList: [
                      ["undo", "redo"],
                      ["font", "fontSize", "formatBlock"],
                      ["paragraphStyle", "blockquote"],
                      [
                        "bold",
                        "underline",
                        "italic",
                        "strike",
                        "subscript",
                        "superscript",
                      ],
                      ["fontColor", "hiliteColor", "textStyle"],
                      ["removeFormat"],
                      ["outdent", "indent"],
                      ["align", "horizontalRule", "list", "lineHeight"],
                      ["table", "link", "image", "video"],
                      ["fullScreen", "showBlocks", "codeView"],
                      ["preview", "print"],
                    ],
                  }}
                />
              </div>

              <div className="form-group-row statusac">
                <input
                  type="checkbox"
                  id="chkActiveStatus"
                  checked={formData.ActiveStatus === 1}
                  onChange={(e) =>
                    handleInput("ActiveStatus", e.target.checked ? 1 : 0)
                  }
                />
                <label htmlFor="chkActiveStatus">
                  Status (Active/Inactive)
                </label>
              </div>

              <h2>Only for SEO Purpose</h2>
              <hr />
              <div className="form-group">
                <label className="block-label">MetaTitle</label>
                <input
                  type="text"
                  value={formData.MetaTitle}
                  onChange={(e) => handleInput("MetaTitle", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="block-label">Meta Keywords</label>
                <input
                  type="text"
                  value={formData.MetaKeywords}
                  onChange={(e) => handleInput("MetaKeywords", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="block-label">Meta Descriptions</label>
                <input
                  type="text"
                  value={formData.MetaDescriptions}
                  onChange={(e) =>
                    handleInput("MetaDescriptions", e.target.value)
                  }
                />
              </div>
              <div className="form-group">
                <label className="block-label">Meta Schema</label>
                <input
                  type="text"
                  value={formData.MetaSchema}
                  onChange={(e) => handleInput("MetaSchema", e.target.value)}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
                <button
                  className="submit-btn"
                  onClick={handleSubmit}
                  disabled={isCreating || isUpdating || isUploading}
                  style={{ width: "auto", padding: "10px 25px" }}
                >
                  {isCreating || isUpdating || isUploading
                    ? isUploading
                      ? "Uploading..."
                      : "Saving..."
                    : "Submit"}
                </button>
                <Link
                  href="/cubastion-admin/manage-pages"
                  className="submit-btn"
                >
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
