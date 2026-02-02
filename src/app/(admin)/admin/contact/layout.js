import React from "react";

export const metadata = {
  title: "All Contact | Online Store",
  description: "Explore our contact.",
};

export default function Layout({ children }) {
  return (
    <section className="collections-container">
      {children}
    </section>
  );
}