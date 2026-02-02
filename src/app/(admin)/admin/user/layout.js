import React from "react";

export const metadata = {
  title: "All User | Online Store",
  description: "Explore our user.",
};

export default function Layout({ children }) {
  return (
    <section className="collections-container">
      {children}
    </section>
  );
}