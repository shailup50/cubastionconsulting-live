'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";

import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import { useGetAllServicesQuery, useDeleteServiceMutation } from "@/store/backendSlice/serviceAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

const customStyles = {
  header: { style: { minHeight: '56px' } },
  headRow: { style: { borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: '#f1f1f1' } },
  rows: { style: { minHeight: '45px', paddingTop: '9px', paddingBottom: '9px' } },
  noData: { style: { padding: '28px', textAlign: 'center' } },
};

export default function ManageServices() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const { data: servicesResponse, isLoading, isFetching, refetch } = useGetAllServicesQuery(undefined, { refetchOnMountOrArgChange: true });
  const [deleteService] = useDeleteServiceMutation();

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await deleteService(id).unwrap();
      if (res.status || res.success) {
        toast.success(res.message || "Service deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const columns = useMemo(() => [
    {
      name: "Service Details",
      selector: (row) => row.ServiceName,
      sortable: true,
      cell: (row, index) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="user-image" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
            {row.ServiceImage ? (
              <img
                src={`/uploads/onlineImages/ServiceImages/${row.ServiceImage}`}
                alt="Service"
                style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                onError={(e) => { e.target.src = "/admin-assets/images/no-image.png"; }}
              />
            ) : (
              <div className="user-image-none" style={{ width: "100%", height: "100%" }}>{index + 1}</div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{row.ServiceName}</span>
          </div>
        </div>
      ),
      width: "88%",
    },
    {
      name: "Status",
      cell: (row) => (
        <span style={{ color: row.ActiveStatus ? "green" : "red", fontWeight: 500 }}>
          {row.ActiveStatus ? "Active" : "Inactive"}
        </span>
      ),
      width: "6%",
    },
    {
      name: "Action",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href={`/cubastion-admin/add-service?ID=${row.ServiceID}`} className="edit-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <g fill="currentColor">
                <path fillRule="evenodd" d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z" clipRule="evenodd" />
                <path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z" />
              </g>
            </svg>
          </Link>
          <button onClick={() => handleDelete(row.ServiceID)} className="approve-btn" style={{ color: "#dc3545", padding: "0" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      ),
      width: "6%",
    },
  ], []);

  const subHeaderComponent = useMemo(() => (
    <div className="subheader-container">
      <div className="colA">
        <input
          type="text"
          placeholder="Search Services"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="searchinput"
        />
      </div>
      <div className="colB">
        <Link href={"/cubastion-admin/add-service"} className="addnew-btn" style={{ width: "110px" }}>
          <span>+</span> Add New
        </Link>
      </div>
    </div>
  ), [filterText]);

  const SkeletonLoader = useCallback(() => (
    <div>{[...Array(10)].map((_, i) => (<ServiceSkeleton key={i} />))}</div>
  ), []);

  const tableData = useMemo(() => {
    const rawData = servicesResponse?.data || [];
    return rawData.filter((item) => {
      const searchText = filterText.toLowerCase();
      return (
        item.ServiceName?.toLowerCase().includes(searchText) ||
        item.ServiceNameURL?.toLowerCase().includes(searchText)
      );
    });
  }, [servicesResponse, filterText]);

  return (
    <main>
      <DataTable
        title="Manage Services"
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
        noDataComponent={<div style={{ padding: '15px', textAlign: 'center' }}>{servicesResponse?.message || "No data available"}</div>}
        customStyles={customStyles}
      />
    </main>
  );
}
