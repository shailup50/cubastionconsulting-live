'use client';
import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from 'next/navigation';
import { useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  useGetAllCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation
} from "@/store/backendSlice/categoryAPISlice";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

const PAGINATION_PREFIX = 'pagination_';

const getStorageKey = (pathname) => {
  const [path] = pathname.split('?');
  const match = path.match(/\/cubastion-admin\/(manage-[^\/]+|add-[^\/]+)/);
  if (match) {
    const pageIdentifier = match[1];
    const normalizedKey = pageIdentifier.replace('add-', 'manage-');
    return `${PAGINATION_PREFIX}${normalizedKey}`;
  }
  return null;
};

const customStyles = {
  header: { style: { minHeight: '56px' } },
  headRow: {
    style: {
      borderTopStyle: 'solid',
      borderTopWidth: '1px',
      borderTopColor: '#f1f1f1',
    },
  },
  rows: {
    style: {
      minHeight: '45px',
      paddingTop: '9px',
      paddingBottom: '9px',
    },
  },
  noData: {
    style: {
      padding: '28px',
      textAlign: 'center',
    },
  },
  contextMenu: { style: { display: 'none' } },
};

export default function ManageCategories() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleCleared, setToggleCleared] = useState(false);
  const [displayOrders, setDisplayOrders] = useState({});

  const adminUserFromStore = useSelector((state) => state.adminAuth?.adminUser);
  const adminUserName = useMemo(() => {
    if (adminUserFromStore?.UserName) return adminUserFromStore.UserName;
    try {
      const stored = localStorage.getItem('user');
      const parsed = stored ? JSON.parse(stored) : null;
      return parsed?.UserName || parsed?.UserFullName || "Admin";
    } catch { return "Admin"; }
  }, [adminUserFromStore]);

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000
  });

  const { data: categoryData, refetch, isLoading, isFetching } = useGetAllCategoriesQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  useEffect(() => {
    if (categoryData?.data) {
      const initialOrders = {};
      categoryData.data.forEach(item => {
        initialOrders[item.CategoryID] = item.DisplayOrder;
      });
      setDisplayOrders(initialOrders);
    }
  }, [categoryData]);

  const handleDisplayOrderChange = useCallback((id, value) => {
    setDisplayOrders(prev => ({ ...prev, [id]: value === "" ? "" : parseInt(value, 10) }));
  }, []);

  const handleApiAction = async (actionPromise, successMsg, onSuccessCallback) => {
    try {
      const res = await actionPromise;
      let isSuccess = false;
      let msg = successMsg;
      if (Array.isArray(res)) {
        isSuccess = res.every(r => (typeof r === 'object' ? r.success !== false : true));
      } else {
        isSuccess = typeof res === 'object' ? res.success !== false : true;
        msg = typeof res === 'object' ? res.message : successMsg;
      }
      if (isSuccess || !res.error) {
        toast.success(msg || successMsg);
        if (onSuccessCallback) onSuccessCallback();
        await refetch();
      } else {
        toast.error(msg || "Operation failed.");
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleUpdateDisplayOrder = async () => {
    const changedEntries = Object.entries(displayOrders).filter(([id, val]) => {
      const original = categoryData?.data?.find(c => c.CategoryID === parseInt(id))?.DisplayOrder;
      return val != original;
    });
    if (changedEntries.length === 0) return toast.error("No changes detected in display orders.");
    if (!confirm("Are you sure you want to update the display orders?")) return;

    const actionPromise = Promise.all(changedEntries.map(([id, val]) => {
      const item = categoryData.data.find(c => c.CategoryID === parseInt(id));
      return updateCategory({
        id: parseInt(id),
        ...item,
        DisplayOrder: val === "" ? item.DisplayOrder : parseInt(val, 10),
        UpdatedBy: adminUserName
      }).unwrap();
    }));

    await handleApiAction(actionPromise, "Display orders updated successfully");
  };

  const handleDelete = async (row) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    const actionPromise = deleteCategory(row.CategoryID).unwrap();
    await handleApiAction(actionPromise, "Category deleted successfully.");
  };

  const handleStatusUpdate = async (row, targetStatus) => {
    const actionPromise = updateCategory({
      id: row.CategoryID,
      ...row,
      ActiveStatus: targetStatus,
      UpdatedBy: adminUserName
    }).unwrap();
    await handleApiAction(actionPromise, "Category status updated successfully.");
  };

  const columns = useMemo(() => [
    {
      name: "Category Name",
      selector: (row) => row.CategoryName,
      sortable: true,
      cell: (row, index) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="user-image" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
            <div className="user-image-none" style={{ width: "100%", height: "100%" }}>{index + 1}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{row.CategoryName}</span>
          </div>
        </div>
      ),
      width: "75%",
    },
    {
      name: "Display Order",
      selector: (row) => row.DisplayOrder,
      cell: (row) => (
        <input
          type="number"
          value={displayOrders[row.CategoryID] !== undefined ? displayOrders[row.CategoryID] : ""}
          onChange={(e) => handleDisplayOrderChange(row.CategoryID, e.target.value)}
          className="form-control"
          style={{ width: "65px", textAlign: "center", border: "1px solid #ddd", borderRadius: "4px" }}
        />
      ),
      sortable: true,
      width: "130px",
    },
    {
      name: "Status",
      cell: (row) => (
        <>
          <span style={{ color: row.ActiveStatus ? "green" : "red" }}>{row.ActiveStatus ? "Active" : "Inactive"}</span>
          <button
            className="approve-btn"
            style={{ color: row.ActiveStatus ? "red" : "green", marginLeft: "12px" }}
          >
            {/* {row.ActiveStatus ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15l-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152l2.758 3.15a1.2 1.2 0 0 1 0 1.698" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 7L9 19l-5.5-5.5l1.41-1.41L9 16.17L19.59 5.59z" />
              </svg>
            )} */}
          </button>
        </>
      ),
      width: "120px",
    },
    {
      name: "Action",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href={`/cubastion-admin/add-category?ID=${row.CategoryID}`} className="edit-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <g fill="currentColor">
                <path fillRule="evenodd" d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z" clipRule="evenodd" />
                <path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z" />
              </g>
            </svg>
          </Link>
          <button onClick={() => handleDelete(row)} className="approve-btn" style={{ color: "#dc3545", padding: "0" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      ),
      width: "120px",
    },
  ], [displayOrders, handleDisplayOrderChange]);

  const subHeaderComponent = useMemo(() => (
    <div className="subheader-container">
      <div className="colA">
        <select
          value={selectedOption}
          onChange={(e) => { setSelectedOption(e.target.value); }}
          className="dropdown"
        >
          <option value="">Select Status</option>
          <option value="1">Active</option>
          <option value="0">Inactive</option>
        </select>
        <input
          type="text"
          placeholder="Search Keywords"
          value={filterText}
          onChange={(e) => { setFilterText(e.target.value); }}
          className="searchinput"
        />
      </div>
      <div className="colB">
        <button
          className="update-display"
          onClick={handleUpdateDisplayOrder}
          style={{ marginRight: '10px', background: '#d56a0f', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Update Display
        </button>
        <Link href={"/cubastion-admin/add-category"} className="addnew-btn" style={{ width: "auto", padding: "0 15px" }}>
          <span>+</span> Add New
        </Link>
      </div>
    </div>
  ), [selectedOption, filterText, handleUpdateDisplayOrder]);

  const tableData = useMemo(() => {
    const rawData = categoryData?.data || [];
    return rawData.filter((item) => {
      const searchText = filterText.toLowerCase();
      const matchesText = item.CategoryName?.toLowerCase().includes(searchText);
      const matchesOption = !selectedOption || item.ActiveStatus.toString() === selectedOption;
      return matchesText && matchesOption;
    });
  }, [categoryData, filterText, selectedOption]);

  const SkeletonLoader = useCallback(() => (
    <div>{[...Array(10)].map((_, i) => (<ServiceSkeleton key={i} />))}</div>
  ), []);

  return (
    <main>
      <DataTable
        title="Manage Categories"
        columns={columns}
        data={tableData}
        striped
        pagination
        highlightOnHover
        subHeader
        subHeaderComponent={subHeaderComponent}
        progressPending={isLoading || isFetching}
        progressComponent={<SkeletonLoader />}
        responsive
        noDataComponent={<div style={{ padding: '15px', textAlign: 'center' }}>{categoryData?.message || "No data available"}</div>}
        customStyles={customStyles}
      />
    </main>
  );
}
