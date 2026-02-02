import React from "react";

export const metadata = {
  title: "privecy Policy| Online Store",
  description: "Explore our abot.",
};

export default function Layout({ children }) {
  return (
    <section className="collections-container">
      {children}
    </section>
  );
}