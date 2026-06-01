'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from 'next/navigation';
import DataTable from "react-data-table-component";
import Link from "next/link";
import toast from "react-hot-toast";
import "react-loading-skeleton/dist/skeleton.css";
import {
  useGetAllTrustedPartnersQuery,
  useDeleteTrustedPartnerMutation,
} from "@/store/backendSlice/trustedPartnerAPISlice";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import ServiceSkeleton from "@/components/backendcomponents/listskeleton";

const customStyles = {
  header: { style: { minHeight: '56px' } },
  headRow: { style: { borderTopStyle: 'solid', borderTopWidth: '1px', borderTopColor: '#f1f1f1' } },
  rows: { style: { minHeight: '45px', paddingTop: '9px', paddingBottom: '9px' } },
  noData: { style: { padding: '28px', textAlign: 'center' } },
};

export default function ManageTrustedPartners() {
  const router = useRouter();
  const [filterText, setFilterText] = useState("");

  const { data: checkData, isSuccess: isAuthCheckSuccess } = useCheckLoginQuery(undefined, {
    refetchOnMountOrArgChange: true,
    pollingInterval: 10000,
  });

  const { data: partnerData, isLoading, isFetching, refetch } = useGetAllTrustedPartnersQuery(
    undefined,
    { refetchOnMountOrArgChange: true },
  );
  const [deletePartner] = useDeleteTrustedPartnerMutation();

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.push("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData, router]);

  const handleDelete = async (id: any) => {
    if (!confirm("Are you sure you want to delete this trusted partner?")) return;
    try {
      const res = await deletePartner(id).unwrap();
      if (res.status || res.success) {
        toast.success(res.message || "Trusted partner deleted successfully");
        refetch();
      } else {
        toast.error(res.message || "Delete failed");
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const columns = useMemo(() => [
    {
      name: "Partner Name",
      selector: (row: any) => row.LogoName,
      sortable: true,
      cell: (row: any, index: number) => (
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div className="user-image" style={{ width: "40px", height: "40px", flexShrink: 0 }}>
            {row.LogoImage1 ? (
              <img
                src={`/uploads/onlineImages/LogoImages/${row.LogoImage1}`}
                alt="Trusted Partner"
                style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: "4px", backgroundColor: "#f8f9fa" }}
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => { (e.target as HTMLImageElement).src = "/admin-assets/images/no-image.png"; }}
              />
            ) : (
              <div className="user-image-none" style={{ width: "100%", height: "100%" }}>{index + 1}</div>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{row.LogoName}</span>
            <small style={{ color: "#666" }}>{row.LogoNameURL}</small>
          </div>
        </div>
      ),
      width: "84%",
    },
    {
      name: "Order",
      selector: (row: any) => row.DisplayOrder,
      sortable: true,
      width: "5%",
    },
    {
      name: "Action",
      cell: (row: any) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Link href={`/cubastion-admin/add-trusted-partner?ID=${row.LogoID}`} className="edit-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
              <g fill="currentColor">
                <path fillRule="evenodd" d="M13.198 1.22L3.12 11.298a1 1 0 0 0-.282.555l-.705 4.594a1 1 0 0 0 1.14 1.14l4.595-.705a1 1 0 0 0 .555-.281L18.501 6.523a1 1 0 0 0 0-1.414l-3.89-3.89a1 1 0 0 0-1.413 0M4.317 15.404l.448-2.924l9.14-9.14l2.475 2.476l-9.14 9.14z" clipRule="evenodd" />
                <path d="m11.442 5.247l1.06-1.061l3.242 3.24l-1.061 1.061z" />
              </g>
            </svg>
          </Link>
          <button onClick={() => handleDelete(row.LogoID)} className="approve-btn" style={{ color: "#dc3545", padding: "0" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
          </button>
        </div>
      ),
      width: "5%",
    },
  ], []);

  const subHeaderComponent = useMemo(() => (
    <div className="subheader-container">
      <div className="colA">
        <input
          type="text"
          placeholder="Search Trusted Partners"
          value={filterText}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFilterText(e.target.value)}
          className="searchinput"
        />
      </div>
      <div className="colB">
        <Link href="/cubastion-admin/add-trusted-partner" className="addnew-btn" style={{ width: "110px" }}>
          <span>+</span> Add New
        </Link>
      </div>
    </div>
  ), [filterText]);

  const SkeletonLoader = useCallback(() => (
    <div>{[...Array(10)].map((_, i) => (<ServiceSkeleton key={i} />))}</div>
  ), []);

  const tableData = useMemo(() => {
    const rawData = partnerData?.data || [];
    return rawData.filter((item: any) => {
      const searchText = filterText.toLowerCase();
      return (
        item.LogoName?.toLowerCase().includes(searchText) ||
        item.LogoNameURL?.toLowerCase().includes(searchText)
      );
    });
  }, [partnerData, filterText]);

  return (
    <main>
      <DataTable
        title="Manage Trusted Partners"
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
        noDataComponent={<div style={{ padding: '15px', textAlign: 'center' }}>{partnerData?.message || "No data available"}</div>}
        customStyles={customStyles}
      />
    </main>
  );
}
