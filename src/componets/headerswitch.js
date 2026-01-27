
"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserHeader from "./UserHeader";

export default function HeaderSwitcher() {
  const pathname = usePathname();
  const [role, setRole] = useState(null); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem("userToken");
      if (savedUser) {
        try {
          const userData = JSON.parse(savedUser);
          setRole(userData.role || "user");
        } catch (e) {
          setRole("user");
        }
      } else {
        setRole("user");
      }
      setLoading(false); 
    };

    checkAuth();
  }, [pathname]);

  if (loading) return null;

  if (pathname.startsWith("/admin")) {
    return null; 
  }


  return <UserHeader />;
}