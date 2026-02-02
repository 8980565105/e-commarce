import React from "react";

export const metadata = {
  title: "About | Online Store",
  description: "Explore our abot.",
};

export default function Layout({ children }) {
  return (
    <section className="collections-container">
      {children}
    </section>
  );
}