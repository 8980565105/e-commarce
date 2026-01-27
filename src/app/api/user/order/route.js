import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../../lib/db";
import Order from "@/models/order";

export async function GET() {
  try {
    await connectMongoDB();

    const orders = await Order.find({}).sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: orders,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Order Fetch Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "order not found",
      },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  await connectMongoDB();
  const data = await req.json();

  const order = await Order.create({
    customerInfo: data.customerInfo,
    items: data.items,
    totalAmount: data.totalAmount,
  });

  return NextResponse.json({
    success: true,
    orderId: order._id,
  });
}
