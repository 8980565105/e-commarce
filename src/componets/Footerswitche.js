"use client";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function LayoutSwitcher({ children }) {
  const pathname = usePathname();

  const isAdminPage = pathname.startsWith("/admin");

  return (
    <>
      <main>{children}</main>

      {!isAdminPage && <Footer />}
    </>
  );
}
