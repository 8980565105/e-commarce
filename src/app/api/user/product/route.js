import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Product from "@/models/product";

export async function GET(req) {
  try {
    await connectMongoDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const product = await Product.findOne({ _id: id, status: true }).populate(
        "category",
      );

      if (!product)
        return NextResponse.json(
          { success: false, error: "Not found" },
          { status: 404 },
        );

      const activeVariants = product.variants.filter((v) => v.stock > 0);

      const productObj = product.toObject();
      productObj.variants = activeVariants;

      return NextResponse.json({ success: true, data: productObj });
    }

    const products = await Product.find({ status: true })
      .populate("category")
      .sort({ createdAt: -1 });

    const filteredProducts = products
      .map((p) => {
        const obj = p.toObject();
        obj.variants = obj.variants.filter((v) => v.stock > 0);
        return obj;
      })
      .filter((p) => p.variants.length > 0);

    return NextResponse.json({ success: true, data: filteredProducts });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 },
    );
  }
}
