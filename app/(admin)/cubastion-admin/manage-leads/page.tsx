'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import toast from "react-hot-toast";

import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetAllLeadsQuery, useDeleteEnquiryMutation } from "@/store/backendSlice/contactUsAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

const PAGE_STORAGE_KEY = 'current_page_name';
const PAGINATION_PREFIX = 'pagination_';

const getStorageKey = (pathname: string) => {
  const [path] = pathname.split('?');
  const match = path.match(/\/(cubastion-admin)\/(manage-[^\/]+|addupd-[^\/]+)/);
  if (match) {
    const pageIdentifier = match[1];
    const normalizedKey = pageIdentifier.replace('addupd-', 'manage-');
    return `${PAGINATION_PREFIX}${normalizedKey}`;
  }
  return null;
};

export default function ManageVisitorEnquiry() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const { data: leadResponse, isLoading, refetch } = useGetAllLeadsQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteEnquiry] = useDeleteEnquiryMutation();

  const openMessagePopup = (user: any) => {
    setSelectedUser(user);
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

  const handleDelete = async (ContactID: any) => {
    const confirmed = confirm("Are you sure you want to delete this enquiry?");
    if (!confirmed) return;
    try {
      const res = await deleteEnquiry(ContactID).unwrap();
      if (res.status || res.success) {
        toast.success("Visitor Enquiry deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Error deleting Enquiry.");
      }
    } catch (error: any) {
      toast.error(error.data?.message || "An unexpected error occurred.");
    }
  };

  const handlePerRowsChange = (newPerPage: number) => {
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
      sortable: false,
      cell: (row: any, index: number) => (
        <div className="user-image-none" style={{ minWidth: "30px", textAlign: "center" }}>{index + 1}</div>
      ),
      width: "70px",
    },
    {
      name: "Name",
      selector: (row: any) => row.FullName,
      sortable: true,
      width: "35%",
      cell: (row: any) => <span style={{ fontWeight: 600 }}>{row.FullName}</span>
    },
    {
      name: "Phone",
      selector: (row: any) => row.PhoneNo,
      sortable: true,
      width: "150px"
    },
    {
      name: "Email",
      selector: (row: any) => row.EmailID,
      sortable: true,
      width: "180px"
    },
    {
      name: "Enquiry Type",
      selector: (row: any) => row.EnquiryType,
      sortable: true,
      width: "150px",
    },
    {
      name: "Enquiry For",
      selector: (row: any) => row.EnquiryFor,
      sortable: true,
      width: "200px",
      cell: (row: any) => <span>{row.EnquiryFor || "-"}</span>,
    },
    {
      name: "Message",
      cell: (row: any) => (
        <button onClick={() => openMessagePopup(row)} className="approve-btn" style={{ padding: "4px 12px", background: "#f1f1f1", border: "1px solid #ddd", borderRadius: "4px" }}>
          Show
        </button>
      ),
      width: "100px",
    },
    {
      name: "Date",
      selector: (row: any) => row.PostedDate,
      sortable: true,
      width: "150px",
    },
    {
      name: "Delete",
      cell: (row: any) => (
        <button onClick={() => handleDelete(row.ContactID)} className="approve-btn" style={{ color: "#dc3545", padding: "0" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
        </button>
      ),
      width: "80px",
    },
  ];

  const filteredData = useMemo(() => {
    const data = leadResponse?.data || [];
    return data.filter((item: any) => {
      const searchText = filterText.toLowerCase();
      const fullName = item.FullName?.toLowerCase() || "";
      const matchesText =
        fullName.includes(searchText) ||
        item.EmailID?.toLowerCase().includes(searchText) ||
        item.PhoneNo?.toLowerCase().includes(searchText);
      const matchesOption = !selectedOption || item.EnquiryType === selectedOption;
      return matchesText && matchesOption;
    });
  }, [leadResponse, filterText, selectedOption]);

  const subHeaderComponent = (
    <div className="subheader-container">
      <div className="colA">
        <select
          value={selectedOption}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedOption(e.target.value)}
          className="dropdown"
          style={{ padding: "8px", borderRadius: "4px", border: "1px solid #ddd", marginRight: "10px" }}
        >
          <option value="">Select Type</option>
          {Array.from(new Set((leadResponse?.data || []).map((item: any) => item.EnquiryType || "")))
            .filter((type) => type)
            .sort()
            .map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
        </select>
        <input
          type="text"
          placeholder="Search Leads"
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
          title="Manage Visitor Enquiry"
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
      {isPopupOpen && selectedUser && (
        <div className="popup-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
          <div className="popup-box" style={{ background: '#fff', padding: '30px', borderRadius: '8px', maxWidth: '500px', width: '90%', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
            <button className="close-btn" onClick={() => setIsPopupOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', paddingRight: '30px' }}>{selectedUser.EnquiryType} enquiry from {selectedUser.FullName}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <p><strong>Phone No:</strong> {selectedUser.PhoneNo}</p>
              <p><strong>Email:</strong> {selectedUser.EmailID}</p>
              <p><strong>Enquiry For:</strong> {selectedUser.EnquiryFor}</p>
              <p><strong>Posted Date:</strong> {selectedUser.PostedDate}</p>
              <hr style={{ border: '0', borderTop: '1px solid #eee', margin: '10px 0' }} />
              <p><strong>Message:</strong></p>
              <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px', border: '1px solid #eee', fontStyle: 'italic' }}>
                {selectedUser.Message || "No message provided."}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
