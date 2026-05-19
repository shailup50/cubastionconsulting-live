'use client';
import AdminStaticData from './AdminStaticData.json';
import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { usePathname, useRouter } from 'next/navigation';
import Link from "next/link";
import { useLogoutMutation } from "../../store/backendSlice/authAPISlice";
import { useDispatch, useSelector } from "react-redux";
import { clearAdminUser } from "../../store/backendSlice/adminAuthReducer";

const ADMIN_MENU_ITEMS = AdminStaticData?.Menu?.items ?? [];

export default function SideNav() {
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const adminUserFromStore = useSelector((state) => state.adminAuth?.adminUser);
  const adminUserId = adminUserFromStore?.loginID ?? null;
  const [openIndex, setOpenIndex] = useState(null);
  const pathname = usePathname();
  const [allowedMenu, setAllowedMenu] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const userStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
    const storedUser = userStr ? JSON.parse(userStr) : null;
    const user = adminUserFromStore || storedUser;

    if (user && ADMIN_MENU_ITEMS.length > 0) {
      setAllowedMenu(ADMIN_MENU_ITEMS);
    } else {
      setAllowedMenu([]);
    }
  }, [pathname, adminUserId]);

  useEffect(() => {
    const visibleItems = ADMIN_MENU_ITEMS.filter((item) => item.Show === "1");
    visibleItems.forEach((item, index) => {
      const subItems = item.MoreItem?.filter((sub) => sub.Show === "1") || [];
      const subUrls = subItems.flatMap((sub) => [sub.url, sub.addurl]).filter(Boolean);
      if (subUrls.includes(pathname)) {
        setOpenIndex(index);
      }
    });
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
      dispatch(clearAdminUser());
      router.push("/cubastion-admin/login");
    } catch (error) {
      console.error("Logout error:", error);
      alert("Something went wrong while logging out.");
    }
  };

  return (
    <aside className="admin-sidebar">
      <div className="aside-wrap">
        <div className="aside-col">
          <ul className="Header_nav_Active">
            {allowedMenu
              .filter((item) => item.Show === "1")
              .map((item, index) => {
                const subItems =
                  item.MoreItem?.filter((sub) => sub.Show === "1") || [];
                const subUrls = subItems.flatMap((sub) => [sub.url, sub.addurl]) || [];
                const isActive =
                  pathname === item.url ||
                  pathname === item.addurl ||
                  subUrls.includes(pathname);
                const isDropdownOpen = openIndex === index;
                const hasSubmenu = subItems.length > 0;

                return (
                  <li key={item.PageID ?? index}>
                    <div
                      className={`nav-item-wrap ${hasSubmenu ? "hasDropdown" : ""}`}
                    >
                      <Link
                        href={hasSubmenu && item.url === "#" ? "#" : item.url}
                        className={isActive ? "active" : ""}
                        onClick={(e) => {
                          if (!hasSubmenu) return;
                          e.preventDefault();
                          setOpenIndex(isDropdownOpen ? null : index);
                        }}
                      >
                        {parse(item.icon)} {item.title}
                      </Link>
                    </div>

                    {hasSubmenu && (
                      <ul className={`aside-dropdown ${isDropdownOpen ? "open" : ""}`}>
                        {subItems.map((subItem, subIndex) => (
                          <li key={subItem.PageID ?? subIndex}>
                            <Link
                              href={subItem.url}
                              className={pathname === subItem.url ? "active" : ""}
                            >
                              {subItem.icon && parse(subItem.icon)}
                              {subItem.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            <li>
              <a
                onClick={() => {
                  const confirmed = confirm("Are you sure you want to log out?");
                  if (confirmed) handleLogout();
                }}
                style={{ cursor: "pointer" }}
              >
                <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' aria-hidden='true' role='img' className='iconify iconify--hugeicons' width='1em' height='1em' preserveAspectRatio='xMidYMid meet' viewBox='0 0 24 24' data-icon='hugeicons:logout-04'><path fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M7.023 5.5a9 9 0 1 0 9.953 0M12 2v8' color='currentColor'></path></svg>
                Log Out
              </a>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}
