// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   Menu,
//   X,
//   ShoppingCart,
//   LayoutDashboard,
//   PackagePlus,
//   Users,
//   Package,
//   Folders,
//   LogOut,
//   Mail,
// } from "lucide-react";

// export default function AdminLayout({ children }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const menuItems = [
//     {
//       id: "dashboard",
//       label: "Dashboard",
//       path: "/admin/dashboard",
//       icon: <LayoutDashboard size={20} />,
//     },
//     {
//       id: "users",
//       label: "Users",
//       path: "/admin/user",
//       icon: <Users size={20} />,
//     },
//     {
//       id: "order",
//       label: "Orders",
//       path: "/admin/order",
//       icon: <ShoppingCart size={20} />,
//     },
//     {
//       id: "blog",
//       label: "Blogs",
//       path: "/admin/blog",
//       icon: <PackagePlus size={20} />,
//     },

// {
//   [
//     {
//       id: "category",
//       label: "Category",
//       path: "/admin/category",
//       icon: <PackagePlus size={20} />,
//     },{
//       id: "subcategory",
//       label: "Subcategory",
//       path: "/admin/subcategory",
//       icon: <PackagePlus size={20} />,
//     }
//   ]
// },

//     {
//       id: "allcollection",
//       label: "categoreis",
//       path: "/admin/allcollection",
//       icon: <Folders size={20} />,
//     },
//     {
//       id: "allproduct",
//       label: "Products",
//       path: "/admin/allproduct",
//       icon: <Package size={20} />,
//     },
//     {
//       id: "contact",
//       label: "Contact",
//       path: "/admin/contact",
//       icon: <Mail size={20}/>

//     }
//   ];

//   const toggleSidebar = () => setIsOpen(!isOpen);

//   const handleLogout = () => {
//     localStorage.removeItem("userToken");
//     document.cookie =
//       "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
//     toast.success("Logged out successfully");
//     router.push("/login");
//     router.refresh();
//   };

//   return (
//     <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
//           onClick={toggleSidebar}
//         />
//       )}

//       <aside
//         className={`
//         fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
//         ${isOpen ? "translate-x-0" : "-translate-x-full"}
//       `}
//       >
//         <div className="flex items-center justify-between p-6 border-b border-slate-700">
//           <Link href="/admin/dashboard">
//             <span className="text-xl font-black tracking-tighter text-white">
//               ADMIN PANEL
//             </span>
//           </Link>
//           <button
//             className="lg:hidden text-slate-400 hover:text-white"
//             onClick={toggleSidebar}
//           >
//             <X size={24} />
//           </button>
//         </div>

//         <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
//           {menuItems.map((item) => {
//             const isActive = pathname === item.path;
//             return (
//               <Link
//                 key={item.id}
//                 href={item.path}
//                 onClick={() => setIsOpen(false)}
//               >
//                 <div
//                   className={`
//                   flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
//                   ${
//                     isActive
//                       ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
//                       : "text-slate-400 hover:bg-slate-800 hover:text-white"
//                   }
//                 `}
//                 >
//                   {item.icon}
//                   <span className="font-semibold text-[15px]">
//                     {item.label}
//                   </span>
//                 </div>
//               </Link>
//             );
//           })}
//         </nav>

//         <div className="p-4 border-t border-slate-700">
//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-[15px]"
//           >
//             <LogOut size={20} />
//             Logout
//           </button>
//         </div>
//       </aside>

//       {/* --- Main Content Area --- */}
//       <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
//         <header className="flex lg:hidden items-center justify-between bg-blue-600 px-5 py-4 shadow-md z-30">
//           <button onClick={toggleSidebar} className="text-white p-1">
//             <Menu size={28} />
//           </button>
//           <span className="text-white font-bold tracking-wider">
//             ADMIN PANEL
//           </span>
//           <div className="w-8"></div>
//         </header>

//         <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
//           {children}
//         </div>
//       </main>
//     </div>
//   );
// }

"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Menu,
  X,
  ShoppingCart,
  LayoutDashboard,
  PackagePlus,
  Users,
  Package,
  Folders,
  LogOut,
  Mail,
  ChevronDown,
  Layers,
  Grid,
} from "lucide-react";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isCatOpen, setIsCatOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("userToken");
    document.cookie =
      "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    toast.success("Logged out successfully");
    router.push("/login");
    router.refresh();
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="flex h-screen bg-[#F8F9FA] overflow-hidden font-sans">
      <Toaster position="top-right" />

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-[#1E293B] text-white transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <Link href="/admin/dashboard">
            <span className="text-xl font-black tracking-tighter text-white">
              ADMIN PANEL
            </span>
          </Link>
          <button
            className="lg:hidden text-slate-400 hover:text-white"
            onClick={toggleSidebar}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          <NavItem
            href="/admin/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            active={isActive("/admin/dashboard")}
          />

          <NavItem
            href="/admin/user"
            icon={<Users size={20} />}
            label="Users"
            active={isActive("/admin/user")}
          />

          <div>
            <button
              onClick={() => setIsCatOpen(!isCatOpen)}
              className={`flex items-center justify-between w-full px-4 py-3 rounded-xl transition-all duration-200 ${
                pathname.includes("category")
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-4">
                <Layers size={20} />
                <span className="font-semibold text-[15px]">Management</span>
              </div>
              <ChevronDown
                size={18}
                className={`transition-transform ${isCatOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isCatOpen && (
              <div className="mt-2 ml-6 space-y-1 border-l border-slate-700">
                <NavItem
                  href="/admin/allcollection"
                  icon={<Grid size={18} />}
                  label="Category"
                  active={isActive("/admin/collection")}
                  sub
                />
                <NavItem
                  href="/admin/subcategory"
                  icon={<Grid size={18} />}
                  label="Subcategory"
                  active={isActive("/admin/subcategory")}
                  sub
                />
              </div>
            )}
          </div>

          <NavItem
            href="/admin/order"
            icon={<ShoppingCart size={20} />}
            label="Orders"
            active={isActive("/admin/order")}
          />
          <NavItem
            href="/admin/blog"
            icon={<PackagePlus size={20} />}
            label="Blogs"
            active={isActive("/admin/blog")}
          />
          <NavItem
            href="/admin/allproduct"
            icon={<Package size={20} />}
            label="Products"
            active={isActive("/admin/allproduct")}
          />
          <NavItem
            href="/admin/contact"
            icon={<Mail size={20} />}
            label="Contact"
            active={isActive("/admin/contact")}
          />
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all font-bold text-[15px]"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="flex lg:hidden items-center justify-between bg-[#1E293B] px-5 py-4 shadow-md z-30">
          <button onClick={toggleSidebar} className="text-white p-1">
            <Menu size={28} />
          </button>
          <span className="text-white font-bold tracking-wider">
            ADMIN PANEL
          </span>
          <div className="w-8"></div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavItem({ href, icon, label, active, sub = false }) {
  return (
    <Link href={href}>
      <div
        className={`
        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200
        ${sub ? "ml-4" : ""}
        ${
          active
            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
            : "text-slate-400 hover:bg-slate-800 hover:text-white"
        }
      `}
      >
        {icon}
        <span className="font-semibold text-[15px]">{label}</span>
      </div>
    </Link>
  );
}
