import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AdminStaticData from "@/components/backendcomponents/AdminStaticData.json";

interface PagePermission {
  PageID: number;
  CanRead: number;
  CanWrite: number;
  CanDelete: number;
  CanAdd: number;
}

interface MenuItem {
  PageID: number;
  url: string;
  addurl: string;
  MoreItem?: MenuItem[];
}

export function usePagePermission() {
  const pathname = usePathname();
  const [pagePermission, setPagePermission] = useState<PagePermission>({
    PageID: 0,
    CanRead: 0,
    CanWrite: 0,
    CanDelete: 0,
    CanAdd: 0,
  });

  const getSlug = (url: string | undefined): string => {
    if (!url) return "";
    const clean = url.split("?")[0].replace(/\/$/, "");
    return clean.split("/").pop() || "";
  };

  const refetchCheckData = () => {
    // placeholder for potential refetch logic
  };

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const storedUser = userStr ? JSON.parse(userStr) : null;
    if (!storedUser) return;

    const storedPermissions = [...(storedUser.permissions || [])];
    const Menu = (AdminStaticData as any).Menu.items;

    const currentSlug = getSlug(pathname);

    const findPage = (items: MenuItem[]): MenuItem | null => {
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
      if (storedUser?.RoleID === 1) {
        setPagePermission({
          PageID: currentPage.PageID,
          CanRead: 1,
          CanWrite: 1,
          CanDelete: 1,
          CanAdd: 1,
        });
      } else {
        const perm = storedPermissions.find(
          (p: any) => Number(p.PageID) === Number(currentPage.PageID)
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
