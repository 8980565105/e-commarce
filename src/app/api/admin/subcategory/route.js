import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";

import Collection from "../../../../models/collection";

export async function POST(req) {
  try {
    await connectMongoDB();
    const { collectionId, subcategoryName } = await req.json();

    if (!collectionId || !subcategoryName) {
      return NextResponse.json(
        { error: "Details adhuri che" },
        { status: 400 },
      );
    }

    // ID mujab find karo ane subcategories array ma push karo
    const updated = await Collection.findByIdAndUpdate(
      collectionId,
      { $push: { subcategories: { name: subcategoryName } } },
      { new: true },
    );

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await connectMongoDB();

    const collections = await Collection.find();

    // 🔥 Flatten subcategories for dropdown
    const subcategories = [];

    collections.forEach((collection) => {
      collection.subcategories.forEach((sub) => {
        subcategories.push({
          _id: sub._id,
          title: sub.name,
          collectionId: collection._id,
          collectionTitle: collection.title,
        });
      });
    });

    return NextResponse.json({
      success: true,
      data: subcategories,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}