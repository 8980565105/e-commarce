import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/db";
import Order from "@/models/order";

export async function POST(req) {
  try {
    await connectMongoDB();
    const data = await req.json();

    const isCOD = data.paymentMethod === "COD";

    const newOrder = new Order({
      customerInfo: {
        firstName: data.customerInfo.firstName,
        lastName: data.customerInfo.lastName,
        email: data.customerInfo.email,
        phone: data.customerInfo.phone,
        address: data.customerInfo.address,
        city: data.customerInfo.city,
        state: data.customerInfo.state,
        zip: data.customerInfo.zip,
      },
      items: data.items.map((item) => ({
        productId: item.productId,
        title: item.title,
        price: Number(item.price),
        quantity: Number(item.quantity),
        size: item.size || "N/A",
        color: item.color || "N/A",
        image: item.image,
      })),
      subtotal: Number(data.subtotal),
      shippingFee: Number(data.shippingFee || 0),
      tax: Number(data.tax || 0),
      totalAmount: Number(data.totalAmount),
      paymentDetails: {
        method: data.paymentMethod,
        status: isCOD ? "COD" : "Pending",
      },
      status: isCOD ? "Processing" : "Pending",
    });

    const savedOrder = await newOrder.save();

    return NextResponse.json(
      {
        success: true,
        message: "Order created successfully",
        orderId: savedOrder._id,
        status: savedOrder.status,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PUT(req) {
  try {
    await connectMongoDB();
    const { orderId, stripeId } = await req.json();

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          status: "Paid",
          "paymentDetails.status": "Paid",
          "paymentDetails.stripePaymentId": stripeId,
        },
      },
      { new: true },
    );

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

export async function GET(req) {
  try {
    await connectMongoDB();

    const orders = await Order.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: orders,
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: "Failed to fetch orders",
    }, { status: 500 });
  }
}