import React from "react";

export async function generateMetadata({ params }) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/admin/collection`,
    );
    const resData = await response.json();

    const collectionsArray = Array.isArray(resData)
      ? resData
      : resData.data || resData.collections || [];

    const currentCollection = collectionsArray.find((item) => item._id === id);

    const categoryName =
      currentCollection?.name || currentCollection?.title || "Category";

    const displayTitle =
      categoryName && typeof categoryName === "string"
        ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1)
        : "Collection";

    return {
      title: `${displayTitle} Collection | Online Store`,
      description: `Explore our exclusive ${displayTitle} collection.`,
    };
  } catch (error) {
    return { title: "Collection | Online Store" };
  }
}

export default async function CategoryLayout({ children }) {
  return <>{children}</>;
}
