'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import SunEditor from "@/components/backendcomponents/SunEditor";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetTeamByIdQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "@/store/backendSlice/teamAPISlice";
import { useSelector } from "react-redux";
import { validateFields } from "@/utils/validateFields";


export default function AddUpdateTeam() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const TeamID = searchParams.get("ID");
  const adminUser = useSelector((state: any) => state.adminAuth?.adminUser);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: teamResponse, isSuccess, isLoading: isFetching } = useGetTeamByIdQuery(TeamID, {
    skip: !TeamID,
    refetchOnMountOrArgChange: true
  });

  const [createTeam, { isLoading: isCreating }] = useCreateTeamMutation();
  const [updateTeam, { isLoading: isUpdating }] = useUpdateTeamMutation();

  const [formData, setFormData] = useState({
    TeamName: "",
    TeamDesignation: "",
    TeamLinkedInLink: "",
    TeamBio: "",
    TeamImage: "",
    TeamType: "Leadership",
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
    if (isSuccess && teamResponse?.data) {
      const data = Array.isArray(teamResponse.data) ? teamResponse.data[0] : teamResponse.data;
      setFormData({
        TeamName: data.TeamName || "",
        TeamDesignation: data.TeamDesignation || "",
        TeamLinkedInLink: data.TeamLinkedInLink || "",
        TeamBio: data.TeamBio || "",
        TeamImage: data.TeamImage || "",
        TeamType: data.TeamType || "Leadership",
        DisplayOrder: data.DisplayOrder ?? 1,
        ActiveStatus: data.ActiveStatus ?? 1,
      });
      if (data.TeamImage) {
        setPreview(`/uploads/onlineImages/TeamImages/${data.TeamImage}`);
      }
    }
  }, [isSuccess, teamResponse]);

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
    const slug = formData.TeamName?.toLowerCase().replace(/\s+/g, "-") || 'team';
    const newFile = new File([file], `${slug}-${Date.now()}.${ext}`, { type: file.type });
    setSelectedFile(newFile);
    setPreview(URL.createObjectURL(newFile));
    handleInput("TeamImage", newFile.name);
  };

  const validationRules = {
    TeamName: { required: true, requiredMessage: "Please enter team member name." },
    TeamDesignation: { required: true, requiredMessage: "Please enter designation." },
    TeamImage: { required: true, requiredMessage: "Please upload a team member photo." },
  };

  const handleSubmit = async () => {
    const errors = validateFields(formData, validationRules);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    let finalImage = formData.TeamImage;
    const userName = adminUser?.UserFullName || "Admin";
    try {
      setIsUploading(true);

      if (selectedFile) {
        const ud = new FormData();
        ud.append('file', selectedFile);
        ud.append('folder', 'uploads/onlineImages/TeamImages');
        ud.append('fileName', selectedFile.name);
        const res = await fetch('/api/upload', { method: 'POST', body: ud }).then(r => r.json());
        if (res.success) finalImage = res.fileName;
        else throw new Error("Image upload failed");
      }

      const payload = {
        TeamName: formData.TeamName,
        TeamDesignation: formData.TeamDesignation,
        TeamLinkedInLink: formData.TeamLinkedInLink,
        TeamBio: (formData.TeamBio === "<p><br></p>" || !formData.TeamBio) ? "" : formData.TeamBio,
        TeamImage: finalImage,
        TeamType: formData.TeamType,
        DisplayOrder: parseInt(formData.DisplayOrder) || 0,
        ActiveStatus: parseInt(formData.ActiveStatus),
        UpdatedBy: userName
      };

      if (TeamID) {
        const res = await updateTeam({ id: parseInt(TeamID), body: payload }).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Update failed");
      } else {
        const res = await createTeam(payload).unwrap();
        if (!res.status && !res.success) throw new Error(res.message || "Creation failed");
      }

      toast.success("Team member saved successfully");
      setIsUploading(false);
      router.push("/cubastion-admin/manage-team");

    } catch (err) {
      toast.error(err.message || "An error occurred");
      setIsUploading(false);
    }
  };

  if (isFetching) return <div className="p-5">Loading...</div>;

  return (
    <main className="add_update container">
      <div className="form-box">
        <h1>{TeamID ? "Update" : "Add"} Team Member</h1>

        <div className="tabbing_sec">
          <div className="tab-nav-content" style={{ padding: '20px', border: '1px solid #eee', borderRadius: '8px' }}>

            <div className="form-group-row" style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Full Name*</label>
                <input type="text" placeholder="e.g. Neha Gupta" value={formData.TeamName} onChange={(e) => handleInput("TeamName", e.target.value)} className={formErrors.TeamName ? "error-input" : ""} />
                {formErrors.TeamName && <p className="error">{formErrors.TeamName}</p>}
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Designation*</label>
                <input type="text" placeholder="e.g. UI/UX Designer" value={formData.TeamDesignation} onChange={(e) => handleInput("TeamDesignation", e.target.value)} className={formErrors.TeamDesignation ? "error-input" : ""} />
                {formErrors.TeamDesignation && <p className="error">{formErrors.TeamDesignation}</p>}
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>LinkedIn Link</label>
                <input type="text" placeholder="e.g. https://linkedin.com/..." value={formData.TeamLinkedInLink} onChange={(e) => handleInput("TeamLinkedInLink", e.target.value)} />
              </div>
              <div className="form-group" style={{ flex: "1" }}>
                <label>Photo*</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ flex: 1 }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} className={formErrors.TeamImage ? "error-input" : ""} style={{ width: "100%" }} />
                    {formErrors.TeamImage && <p className="error">{formErrors.TeamImage}</p>}
                  </div>
                  {preview && <img src={preview} alt="preview" height={40} style={{ border: "1px solid #ddd", objectFit: "cover", width: "40px" }} />}
                </div>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: "15px" }}>
              <label>Bio</label>
              <SunEditor value={formData.TeamBio} onChange={(val) => handleInput("TeamBio", val)} height={140} />
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
              <Link href="/cubastion-admin/manage-team" className="back-btn" style={{ padding: "10px 30px" }}>
                Back
              </Link>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
