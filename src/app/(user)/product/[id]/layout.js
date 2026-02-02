import React from "react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  try {
    const response = await fetch(`${baseUrl}/api/user/product`, {
      next: { revalidate: 0 },
    });

    if (!response.ok) return { title: "Product Not Found" };
    const resData = await response.json();
    const productsArray = Array.isArray(resData)
      ? resData
      : resData.data || resData.products || [];

    const product = productsArray.find((p) => {
      const pId = p._id?.toString() || p.id?.toString();
      return pId === id;
    });

    if (!product) {
      return { title: "Product Details | Online Store" };
    }
    const productName = product.name || product.title || "Product";
    return {
      title: `${productName} | Online Store`,
      description: `Buy ${productName} online.`,
    };
  } catch (error) {
    return { title: "Online Store" };
  }
}

export default async function ProductLayout({ children }) {
  return <>{children}</>;
}
