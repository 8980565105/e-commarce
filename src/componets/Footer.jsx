// "use client";
// import React, { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   Mail,
//   Phone,
//   RefreshCcw,
//   Truck,
//   Headphones,
//   BadgePercent,
// } from "lucide-react";

// export default function Footer() {
//   const [collections, setCollections] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchCollections = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch("/api/admin/collection", {
//           method: "GET",
//           cache: "no-store",
//         });

//         const result = await res.json();

//         if (result.success && Array.isArray(result.data)) {
//           setCollections(result.data.slice(0, 5));
//         } else {
//         }
//       } catch (error) {
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCollections();
//   }, []);

//   return (
//     <footer className="w-full font-sans">
//       <div className="bg-white py-12 border-b border-gray-100">
//         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
//           <ServiceItem
//             icon={<RefreshCcw size={32} />}
//             title="7 - Day Returns"
//             desc="Free Shipping With easy returns."
//           />
//           <ServiceItem
//             icon={<Truck size={32} />}
//             title="Free Delivery"
//             desc="NO extra costs, just the Price pay."
//           />
//           <ServiceItem
//             icon={<Headphones size={32} />}
//             title="24/7 Support"
//             desc="24/7 support, always here for you."
//           />
//           <ServiceItem
//             icon={<BadgePercent size={32} />}
//             title="Member Discounts"
//             desc="10% discount across categories"
//           />
//         </div>
//       </div>

//       <div className="bg-[#0F172A] text-white pt-16 pb-8 px-6 md:px-12 lg:px-24">
//         <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
//           <div className="space-y-6">
//             <div className="w-152px h-32px">
//               <Link href="/">
//                 <img src="/img/Logo white.png" alt="logo" className="" />
//               </Link>
//             </div>
//             <p className="text-gray-400 text-sm">
//               Typically, clothing is made of fabrics or textiles, but over time
//               it has included garments made from....
//             </p>
//             <div className="space-y-3">
//               <ContactLink icon={<Mail size={18} />} text="fesona@gmail.com" />
//               <ContactLink icon={<Phone size={18} />} text="+91 784 247 0154" />
//             </div>
//           </div>

//           <div>
//             <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
//               Shop
//             </h3>
//             <ul className="space-y-4 text-gray-400 text-sm">
//               {loading ? (
//                 [...Array(5)].map((_, i) => (
//                   <li
//                     key={i}
//                     className="h-4 w-24 bg-slate-800 animate-pulse rounded"
//                   ></li>
//                 ))
//               ) : collections.length > 0 ? (
//                 collections.map((item) => (
//                   <li key={item._id}>
//                     <Link
//                       href={`/collection/${item._id}`}
//                       className="hover:text-[#FF4D59] transition-colors capitalize block"
//                     >
//                       {item.name || item.title}
//                     </Link>
//                   </li>
//                 ))
//               ) : (
//                 <li className="text-gray-500 text-xs">No collections found</li>
//               )}
//             </ul>
//           </div>

//           <div>
//             <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
//               Information
//             </h3>
//             <ul className="space-y-4 text-gray-400 text-sm">
//               <FooterLink href="/contact" label="Contact Us" />
//               <FooterLink href="/about" label="About Us" />
//               <FooterLink href="/blog" label="Blog" />
//               <FooterLink href="/privacy" label="Legal & Privacy" />
//               <FooterLink href="/faq" label="FAQs" />
//             </ul>
//           </div>

//           <div className="space-y-6">
//             <h3 className="text-lg font-bold uppercase tracking-wider">
//               Newsletter
//             </h3>
//             <div className="relative flex items-center">
//               <input
//                 type="email"
//                 placeholder="Email Address"
//                 className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 px-6 text-xs focus:outline-none focus:border-[#FF4D59] transition-all"
//               />
//               <button className="absolute right-1 bg-[#FF4D59] hover:bg-[#e64550] px-6 py-2 rounded-full text-[10px] font-bold transition-colors">
//                 SEND
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="mt-16 pt-8 border-t border-slate-800 text-center text-gray-500 text-xs">
//           <p>© {new Date().getFullYear()} Fesona. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }


// const ServiceItem = ({ icon, title, desc }) => (
//   <div className="flex flex-col items-center text-center space-y-2 group">
//     <div className="text-[#FF4D59] transition-transform duration-300">
//       {icon}
//     </div>
//     <h4 className="text-sm font-bold text-gray-900">{title}</h4>
//     <p className="text-xs text-gray-500">{desc}</p>
//   </div>
// );

// const ContactLink = ({ icon, text }) => (
//   <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer w-fit">
//     <span className="text-[#FF4D59]">{icon}</span>
//     <span className="text-sm">{text}</span>
//   </div>
// );

// const FooterLink = ({ href, label }) => (
//   <li>
//     <Link
//       href={href}
//       className="hover:text-[#FF4D59] transition-colors inline-block"
//     >
//       {label}
//     </Link>
//   </li>
// );

"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  RefreshCcw,
  Truck,
  Headphones,
  BadgePercent,
} from "lucide-react";

export default function Footer() {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/collection", {
          method: "GET",
          cache: "no-store",
        });

        const result = await res.json();

        // status === true હોય તેવા જ ડેટા ફિલ્ટર કરવા
        if (result.success && Array.isArray(result.data)) {
          const activeData = result.data
            .filter((item) => item.status === true) // અહીં ફિલ્ટર લગાવ્યું છે
            .slice(0, 5); // માત્ર પહેલા 5 બતાવવા માટે
          
          setCollections(activeData);
        }
      } catch (error) {
        console.error("Footer fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCollections();
  }, []);

  return (
    <footer className="w-full font-sans">
      {/* Service Items Section */}
      <div className="bg-white py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <ServiceItem
            icon={<RefreshCcw size={32} />}
            title="7 - Day Returns"
            desc="Free Shipping With easy returns."
          />
          <ServiceItem
            icon={<Truck size={32} />}
            title="Free Delivery"
            desc="NO extra costs, just the Price pay."
          />
          <ServiceItem
            icon={<Headphones size={32} />}
            title="24/7 Support"
            desc="24/7 support, always here for you."
          />
          <ServiceItem
            icon={<BadgePercent size={32} />}
            title="Member Discounts"
            desc="10% discount across categories"
          />
        </div>
      </div>

      {/* Main Footer Section */}
      <div className="bg-[#0F172A] text-white pt-16 pb-8 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <div className="w-38">
              <Link href="/">
                <img src="/img/Logo white.png" alt="logo" className="h-8 object-contain" />
              </Link>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Typically, clothing is made of fabrics or textiles, but over time
              it has included garments made from various materials.
            </p>
            <div className="space-y-3">
              <ContactLink icon={<Mail size={18} />} text="fesona@gmail.com" />
              <ContactLink icon={<Phone size={18} />} text="+91 784 247 0154" />
            </div>
          </div>

          {/* Dynamic Shop Links (Filtered by Status) */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              {loading ? (
                // Skeleton Loading
                [...Array(5)].map((_, i) => (
                  <li
                    key={i}
                    className="h-4 w-24 bg-slate-800 animate-pulse rounded"
                  ></li>
                ))
              ) : collections.length > 0 ? (
                collections.map((item) => (
                  <li key={item._id}>
                    <Link
                      href={`/collection/${item._id}`}
                      className="hover:text-[#FF4D59] transition-colors capitalize block"
                    >
                      {item.name || item.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-gray-500 text-xs">No active collections</li>
              )}
            </ul>
          </div>

          {/* Static Info Links */}
          <div>
            <h3 className="text-lg font-bold mb-6 uppercase tracking-wider">
              Information
            </h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <FooterLink href="/contact" label="Contact Us" />
              <FooterLink href="/about" label="About Us" />
              <FooterLink href="/blog" label="Blog" />
              <FooterLink href="/privacy" label="Legal & Privacy" />
              <FooterLink href="/faq" label="FAQs" />
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold uppercase tracking-wider">
              Newsletter
            </h3>
            <div className="relative flex items-center">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 px-6 text-xs focus:outline-none focus:border-[#FF4D59] transition-all"
              />
              <button className="absolute right-1 bg-[#FF4D59] hover:bg-[#e64550] px-6 py-2 rounded-full text-[10px] font-bold transition-colors">
                SEND
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-slate-800 text-center text-gray-500 text-xs">
          <p>© {new Date().getFullYear()} Fesona. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

// Helper Components
const ServiceItem = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center space-y-2 group">
    <div className="text-[#FF4D59] transition-transform duration-300">
      {icon}
    </div>
    <h4 className="text-sm font-bold text-gray-900">{title}</h4>
    <p className="text-xs text-gray-500">{desc}</p>
  </div>
);

const ContactLink = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors cursor-pointer w-fit">
    <span className="text-[#FF4D59]">{icon}</span>
    <span className="text-sm">{text}</span>
  </div>
);

const FooterLink = ({ href, label }) => (
  <li>
    <Link
      href={href}
      className="hover:text-[#FF4D59] transition-colors inline-block"
    >
      {label}
    </Link>
  </li>
);