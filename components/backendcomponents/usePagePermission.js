import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminStaticData from "@/components/backendcomponents/AdminStaticData.json";

export function usePagePermission() {
  const pathname = usePathname();
  const [pagePermission, setPagePermission] = useState({
    PageID: 0,
    CanRead: 0,
    CanWrite: 0,
    CanDelete: 0,
    CanAdd: 0,
  });

  const getSlug = (url) => {
    if (!url) return "";
    const clean = url.split("?")[0].replace(/\/$/, "");
    return clean.split("/").pop() || "";
  };

  const refetchCheckData = () => {
    // This was used for RTK Query refetch, now we can just re-read localStorage if needed
    // or trigger a state update in the component using this hook.
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const storedUser = userStr ? JSON.parse(userStr) : null;
    if (!storedUser) return;

    const storedPermissions = [...(storedUser.permissions || [])];
    const Menu = AdminStaticData.Menu.items;

    const currentSlug = getSlug(pathname);

    const findPage = (items) => {
      for (const item of items) {
        const urlSlug = getSlug(item.url);
        const addUrlSlug = getSlug(item.addurl);

        if (urlSlug === currentSlug || addUrlSlug === currentSlug) {
          return item;
        }

        if (item.MoreItem) {
          const subPage = findPage(item.MoreItem);
          if (subPage) return subPage;
        }
      }
      return null;
    };

    const currentPage = findPage(Menu);

    if (currentPage) {
      if (storedUser?.RoleID === 1) { // Assuming RoleID 1 is Super Admin
        setPagePermission({
          PageID: currentPage.PageID,
          CanRead: 1,
          CanWrite: 1,
          CanDelete: 1,
          CanAdd: 1,
        });
      } else {
        const perm = storedPermissions.find(
          (p) => Number(p.PageID) === Number(currentPage.PageID)
        );

        setPagePermission({
          PageID: currentPage.PageID,
          CanRead: perm?.CanRead ?? 0,
          CanWrite: perm?.CanWrite ?? 0,
          CanDelete: perm?.CanDelete ?? 0,
          CanAdd: perm?.CanAdd ?? 0,
        });
      }
    }
  }, [pathname]);

  return { pagePermission, refetchCheckData };
}
