import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";

export async function GET(req) {
  try {
    await connectMongoDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const category = searchParams.get("category");
    const sort = searchParams.get("sort");
    const search = searchParams.get("search");


    if (id) {
      const product = await Product.findOne({
        _id: id,
        status: true, 
      }).populate("category");

      if (!product) {
        return NextResponse.json(
          { success: false, error: "Product not found or inactive" },
          { status: 404 }
        );
      }

      return NextResponse.json({ success: true, data: product });
    }

    let query = { status: true }; 

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sort === "price-low") sortOptions = { price: 1 };
    if (sort === "price-high") sortOptions = { price: -1 };

    const products = await Product.find(query)
      .populate("category")
      .sort(sortOptions);

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    console.error("User Product Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

