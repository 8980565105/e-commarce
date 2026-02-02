import React from "react";

export const metadata = {
  title: "Dashboard | Online Store",
  description: "Explore our Dashboard.",
};

export default function Layout({ children }) {
  return (
    <section className="collections-container">
      {children}
    </section>
  );
}