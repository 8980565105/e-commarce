import React from "react";

export const metadata = {
  title: "All Product | Online Store",
  description: "Explore our wide range of premium collections.",
};

export default function Layout({ children }) {
  return (
    <section className="collections-container">
      {children}
    </section>
  );
}