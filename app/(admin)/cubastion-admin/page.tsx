"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Pageloading from "./Pageloading";

export default function CubastionAdminIndexPage() {
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    const loginTimestamp = localStorage.getItem("loginTimestamp");
    const oneDayMs = 24 * 60 * 60 * 1000;
    const sessionValid =
      user &&
      loginTimestamp &&
      Date.now() - parseInt(loginTimestamp, 10) <= oneDayMs;

    router.replace(sessionValid ? "/cubastion-admin/dashboard" : "/");
  }, [router]);

  return <Pageloading />;
}
