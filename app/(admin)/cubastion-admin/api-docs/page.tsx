"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCheckLoginQuery } from "@/store/backendSlice/authAPISlice";
import ApiDocsSwagger from "@/components/backendcomponents/ApiDocsSwagger";
import Pageloading from "../Pageloading";

export default function AdminApiDocsPage() {
  const router = useRouter();
  const { data: checkData, isSuccess: isAuthCheckSuccess, isLoading } =
    useCheckLoginQuery(undefined, { refetchOnMountOrArgChange: true });

  useEffect(() => {
    if (isAuthCheckSuccess && !checkData?.loggedIn) {
      router.replace("/cubastion-admin/login");
    }
  }, [isAuthCheckSuccess, checkData?.loggedIn, router]);

  if (isLoading || !checkData?.loggedIn) {
    return <Pageloading />;
  }

  return (
    <main className="api-docs-main">
      <div className="main-wrap api-docs-page">
        <div className="page-title-row">
          <h1>API Documentation</h1>
          <p>Swagger UI for internal admin use. Requests use your current login token.</p>
        </div>
        <ApiDocsSwagger />
      </div>
    </main>
  );
}
