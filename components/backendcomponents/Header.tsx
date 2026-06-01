"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
export default function Header() {
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    if (user) {
      setUserName(user.UserFullName || "");
      setUserRole(user.RoleID === 1 ? "Super Admin" : "Admin");
      setProfileImage(user.ProfileImage || "");
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  return (
    <>
      <link rel="stylesheet" href="/admin-assets/fonts/font.css" />
      <header>
        <div className="header-wrapper">
          <div className="colA">
            <a href="/cubastion-admin/dashboard" className="logo" style={{ padding: "11px" }}>
              <img src="/admin-assets/img/logo.svg" alt="cubastion" style={{ height: "43px" }} />
            </a>
          </div>
          <div className="colB">
            <ul>
              <li>
                <div className="dropdown-wrap inline-flex align-center">
                  <div className="user-ico">
                    {profileImage ? (
                      <img src={`/OnlineImages/AuthImages/${profileImage}`} alt={userName || "User"} className="user-image" />
                    ) : (
                      <div className="user-ico">
                        <span>{getInitials(userName)}</span>
                      </div>
                    )}
                  </div>
                  <div data-dropdown className="admin_de">
                    <span className="title">{userName || "Guest"}</span>
                    <span className="design-ekgrgb">{userRole || "Role"}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}
