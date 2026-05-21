'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetAllSiebelExpertLeadsQuery,
  useDeleteSiebelExpertLeadMutation,
} from "@/store/backendSlice/siebelExpertAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

export default function ManageSiebelExpertLeads() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const { data: leadResponse, isLoading, refetch } = useGetAllSiebelExpertLeadsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteLead] = useDeleteSiebelExpertLeadMutation();

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  const openDetailsPopup = (row) => {
    setSelectedLead(row);
    setIsPopupOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this enquiry?")) return;
    try {
      const res = await deleteLead(id).unwrap();
      if (res.status || res.success) {
        toast.success(res.message || "Enquiry deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Error deleting enquiry.");
      }
    } catch (error) {
      toast.error(error?.data?.message || "An unexpected error occurred.");
    }
  };

  const formatDate = (value) => {
    if (!value) return "-";
    try {
      return new Date(value).toLocaleString();
    } catch {
      return value;
    }
  };

  const columns = [
    {
      name: "S.No.",
      cell: (row, index) => (
        <div className="user-image-none" style={{ minWidth: "30px", textAlign: "center" }}>{index + 1}</div>
      ),
      width: "70px",
    },
    {
      name: "Name",
      selector: (row) => `${row.first_name || ""} ${row.last_name || ""}`.trim(),
      sortable: true,
      width: "18%",
      cell: (row) => (
        <span style={{ fontWeight: 600 }}>
          {[row.first_name, row.last_name].filter(Boolean).join(" ") || "-"}
        </span>
      ),
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "18%",
    },
    {
      name: "Company",
      selector: (row) => row.company,
      sortable: true,
      width: "14%",
      cell: (row) => <span>{row.company || "-"}</span>,
    },
    {
      name: "Service",
      selector: (row) => row.service,
      sortable: true,
      width: "16%",
      cell: (row) => <span>{row.service || "-"}</span>,
    },
    {
      name: "Version",
      selector: (row) => row.version,
      sortable: true,
      width: "12%",
      cell: (row) => <span>{row.version || "-"}</span>,
    },
    {
      name: "View",
      cell: (row) => (
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
      name: "Submitted",
      selector: (row) => row.created_at,
      sortable: true,
      width: "150px",
      cell: (row) => <span>{formatDate(row.created_at)}</span>,
    },
    {
      name: "Delete",
      cell: (row) => (
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
    return data.filter((item) => {
      const name = `${item.first_name || ""} ${item.last_name || ""}`.toLowerCase();
      return (
        name.includes(search) ||
        item.email?.toLowerCase().includes(search) ||
        item.company?.toLowerCase().includes(search) ||
        item.service?.toLowerCase().includes(search) ||
        item.version?.toLowerCase().includes(search)
      );
    });
  }, [leadResponse, filterText]);

  const subHeaderComponent = (
    <div className="subheader-container">
      <div className="colA">
        <input
          type="text"
          placeholder="Search Siebel Expert Leads"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
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
          title="Contact Siebel Expert"
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
              maxWidth: "520px",
              width: "90%",
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
              Siebel Expert enquiry — {[selectedLead.first_name, selectedLead.last_name].filter(Boolean).join(" ")}
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <p><strong>Email:</strong> {selectedLead.email}</p>
              <p><strong>Company:</strong> {selectedLead.company || "-"}</p>
              <p><strong>Service of Interest:</strong> {selectedLead.service || "-"}</p>
              <p><strong>Current Siebel Version:</strong> {selectedLead.version || "-"}</p>
              <p><strong>Submitted:</strong> {formatDate(selectedLead.created_at)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
