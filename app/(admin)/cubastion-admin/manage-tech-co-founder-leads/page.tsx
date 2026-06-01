'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetAllTechCoFounderLeadsQuery,
  useDeleteTechCoFounderLeadMutation,
} from "@/store/backendSlice/techCoFounderAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

export default function ManageTechCoFounderLeads() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const { data: leadResponse, isLoading, refetch } = useGetAllTechCoFounderLeadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteLead] = useDeleteTechCoFounderLeadMutation();

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  const openDetailsPopup = (row: any) => {
    setSelectedLead(row);
    setIsPopupOpen(true);
  };

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      const res = await deleteLead(id).unwrap();
      if (res.status || res.success) {
        toast.success(res.message || "Submission deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Error deleting submission.");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "An unexpected error occurred.");
    }
  };

  const truncate = (text: string, max = 80) => {
    if (!text) return "-";
    return text.length > max ? `${text.slice(0, max)}…` : text;
  };

  const columns = [
    {
      name: "S.No.",
      cell: (row: any, index: number) => (
        <div className="user-image-none" style={{ minWidth: "30px", textAlign: "center" }}>{index + 1}</div>
      ),
      width: "70px",
    },
    {
      name: "Name",
      selector: (row: any) => row.name,
      sortable: true,
      width: "20%",
      cell: (row: any) => <span style={{ fontWeight: 600 }}>{row.name || "-"}</span>,
    },
    {
      name: "Email",
      selector: (row: any) => row.email,
      sortable: true,
      width: "22%",
    },
    {
      name: "Idea (preview)",
      selector: (row: any) => row.idea_description,
      sortable: true,
      width: "30%",
      cell: (row: any) => <span title={row.idea_description}>{truncate(row.idea_description)}</span>,
    },
    {
      name: "View",
      cell: (row: any) => (
        <button
          onClick={() => openDetailsPopup(row)}
          className="approve-btn"
          style={{ padding: "4px 12px", background: "#f1f1f1", border: "1px solid #ddd", borderRadius: "4px" }}
        >
          View
        </button>
      ),
      width: "90px",
    },
    {
      name: "Delete",
      cell: (row: any) => (
        <button onClick={() => handleDelete(row.id)} className="approve-btn" style={{ color: "#dc3545", padding: "0" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      ),
      width: "80px",
    },
  ];

  const filteredData = useMemo(() => {
    const data = leadResponse?.data || [];
    const search = filterText.toLowerCase();
    return data.filter((item: any) =>
      item.name?.toLowerCase().includes(search) ||
      item.email?.toLowerCase().includes(search) ||
      item.idea_description?.toLowerCase().includes(search),
    );
  }, [leadResponse, filterText]);

  const subHeaderComponent = (
    <div className="subheader-container">
      <div className="colA">
        <input
          type="text"
          placeholder="Search Tech Co-Founder Leads"
          value={filterText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
          className="searchinput"
        />
      </div>
    </div>
  );

  const SkeletonLoader = () => (
    <div>
      {[...Array(10)].map((_, i) => (
        <ServiceSkeleton key={i} />
      ))}
    </div>
  );

  return (
    <>
      <main>
        <DataTable
          title="Contact Tech Co-Founder"
          columns={columns}
          data={filteredData}
          striped
          pagination
          highlightOnHover
          subHeader
          subHeaderComponent={subHeaderComponent}
          responsive
          progressPending={isLoading}
          progressComponent={<SkeletonLoader />}
        />
      </main>
      {isPopupOpen && selectedLead && (
        <div
          className="popup-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            className="popup-box"
            style={{
              background: "#fff",
              padding: "30px",
              borderRadius: "8px",
              maxWidth: "560px",
              width: "90%",
              maxHeight: "85vh",
              overflowY: "auto",
              position: "relative",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <button
              className="close-btn"
              onClick={() => setIsPopupOpen(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                border: "none",
                background: "none",
                fontSize: "24px",
                cursor: "pointer",
              }}
            >
              ×
            </button>
            <h2 style={{ fontSize: "1.2rem", marginBottom: "20px", paddingRight: "30px" }}>
              Tech Co-Founder submission — {selectedLead.name}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Idea description:</strong></p>
              <div
                style={{
                  background: "#f9f9f9",
                  padding: "15px",
                  borderRadius: "4px",
                  border: "1px solid #eee",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {selectedLead.idea_description || "—"}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
