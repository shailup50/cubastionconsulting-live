'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import {
  useGetAllCareerApplicationsQuery,
  useDeleteCareerApplicationMutation
} from "@/store/backendSlice/careerAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const PAGINATION_PREFIX = 'pagination_';

const getStorageKey = (pathname) => {
  const [path] = pathname.split('?');
  const match = path.match(/\/(cubastion-admin)\/([^\/]+)/);
  if (match) {
    return `${PAGINATION_PREFIX}${match[2]}`;
  }
  return null;
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

export default function ManageCareerApplications() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [selectedJob, setSelectedJob] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const { data: appResponse, isLoading, refetch } = useGetAllCareerApplicationsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteApp] = useDeleteCareerApplicationMutation();
  console.log(" the appResponse", appResponse)
  const openAppPopup = (app) => {
    setSelectedApp(app);
    setIsPopupOpen(true);
  };

  const [rowsPerPage, setRowsPerPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const storageKey = getStorageKey(currentPath);
      if (storageKey) {
        const stored = localStorage.getItem(storageKey);
        return stored ? parseInt(stored, 10) : 10;
      }
    }
    return 10;
  });

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  const handleDelete = async (id) => {
    console.log(" the id", id)
    const confirmed = confirm("Are you sure you want to delete this application?");
    if (!confirmed) return;
    try {
      const res = await deleteApp(id).unwrap();
      if (res.status || res.success) {
        toast.success("Application deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Error deleting Application.");
      }
    } catch (error) {
      toast.error(error.data?.message || "An unexpected error occurred.");
    }
  };

  const handlePerRowsChange = (newPerPage) => {
    setRowsPerPage(newPerPage);
    if (typeof window !== 'undefined') {
      const currentPath = window.location.pathname;
      const storageKey = getStorageKey(currentPath);
      if (storageKey) {
        localStorage.setItem(storageKey, newPerPage.toString());
      }
    }
  };

  const columns = [
    {
      name: "S.No.",
      cell: (row, index) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="user-image" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
            <div className="user-image-none" style={{ width: "100%", height: "100%" }}>{index + 1}</div>
          </div>
        </div>
      ),
      width: "80px",
    },
    {
      name: "Candidate Name",
      selector: (row) => row.FullName,
      sortable: true,
      cell: (row) => <span style={{ fontWeight: 600 }}>{row.FullName}</span>,
      width: "45%"
    },
    {
      name: "Applied For",
      selector: (row) => row.JobName,
      sortable: true,
      width: "120px",
      cell: (row) => row.JobName || "N/A"
    },
    {
      name: "Email",
      selector: (row) => row.Email,
      sortable: true,
      width: "170px"
    },
    {
      name: "Location",
      cell: (row) => `${row.City}, ${row.Country}`,
      width: "120px"
    },
    {
      name: "Resume",
      cell: (row) => row.Resume ? (
        <a href={`/uploads/onlineImages/CareerImages${row.Resume}`} target="_blank" rel="noopener noreferrer" className="approve-btn" style={{ fontSize: "12px", padding: "4px 10px", background: "#e8f0fe", color: "#1a73e8", borderRadius: "4px" }}>
          View
        </a>
      ) : "No File",
      width: "100px",
    },
    {
      name: "Message",
      cell: (row) => (
        <button onClick={() => openAppPopup(row)} className="approve-btn" style={{ padding: "4px 12px", background: "#f1f1f1", border: "1px solid #ddd", borderRadius: "4px" }}>
          Show
        </button>
      ),
      width: "100px",
    },
    {
      name: "Date",
      selector: (row) => row.PostedDate,
      sortable: true,
      cell: (row) => formatDate(row.PostedDate),
      width: "120px",
    },
    {
      name: "Delete",
      cell: (row) => (
        <button onClick={() => handleDelete(row.CareerID)} className="approve-btn" style={{ color: "#dc3545", padding: "0" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      ),
      width: "80px",
    },
  ];

  const filteredData = useMemo(() => {
    const data = appResponse?.data || [];
    return data.filter((item) => {
      const searchText = filterText.toLowerCase();
      const fullName = item.FullName?.toLowerCase() || "";
      const email = item.Email?.toLowerCase() || "";
      const matchesText =
        fullName.includes(searchText) ||
        email.includes(searchText) ||
        item.PhoneNo?.toLowerCase().includes(searchText) ||
        (item.JobName?.toLowerCase() || "").includes(searchText);

      const matchesJob = !selectedJob || item.JobName === selectedJob;
      return matchesText && matchesJob;
    });
  }, [appResponse, filterText, selectedJob]);

  const subHeaderComponent = (
    <div className="subheader-container">
      <div className="colA">
        <select
          value={selectedJob}
          onChange={(e) => setSelectedJob(e.target.value)}
          className="dropdown"
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", marginRight: "10px" }}
        >
          <option value="">Select Job</option>
          {Array.from(new Set((appResponse?.data || []).map(item => item.JobName || "")))
            .filter((job) => job)
            .sort()
            .map((job) => (
              <option key={job} value={job}>
                {job}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Search Applications"
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
          title="Manage Career Applications"
          columns={columns}
          data={filteredData}
          striped
          pagination
          highlightOnHover
          subHeader
          paginationRowsPerPageOptions={[10, 30, 50, 100]}
          paginationPerPage={rowsPerPage}
          onChangeRowsPerPage={handlePerRowsChange}
          subHeaderComponent={subHeaderComponent}
          responsive
          progressPending={isLoading}
          progressComponent={<SkeletonLoader />}
        />
      </main>

      {isPopupOpen && selectedApp && (
        <div className="popup-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="popup-box" style={{ background: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '600px', width: '90%', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <button className="close-btn" onClick={() => setIsPopupOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', paddingRight: '30px' }}>Application from {selectedApp.FullName}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p><strong>Job applied for:</strong> {selectedApp.JobName || "N/A"}</p>
              <p><strong>Email:</strong> {selectedApp.Email}</p>
              <p><strong>Phone:</strong> {selectedApp.PhoneNo}</p>
              <p><strong>Location:</strong> {selectedApp.City}, {selectedApp.Country}</p>
              <p><strong>LinkedIn:</strong> <a href={selectedApp.LinkedInLink} target="_blank" rel="noreferrer" style={{ color: "#0a66c2", textDecoration: "underline" }}>{selectedApp.LinkedInLink}</a></p>
              <p><strong>Posted Date:</strong> {formatDate(selectedApp.PostedDate)}</p>
              <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />
              <p><strong>Candidate Message:</strong></p>
              <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee', fontStyle: 'italic', maxHeight: '200px', overflowY: 'auto' }}>
                {selectedApp.Message || "No message provided."}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
