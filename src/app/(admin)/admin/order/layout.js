import React from "react";

export const metadata = {
  title: "All order | Online Store",
  description: "Explore our order.",
};

export default function Layout({ children }) {
  return (
    <section className="collections-container">
      {children}
    </section>
  );
}