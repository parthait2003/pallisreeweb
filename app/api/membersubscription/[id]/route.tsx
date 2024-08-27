import connectDB from "@/config/database";
import Subscription from "@/models/membersubscription";
import { NextRequest, NextResponse } from "next/server";

// Function to set CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS, PUT"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// OPTIONS method to handle CORS preflight requests
export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// GET method to fetch a subscription by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const subscription = await Subscription.findById(id);

    if (!subscription) {
      let response = NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    let response = NextResponse.json({ subscription }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get subscription:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// PUT method to update a subscription by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const {
      billNo,
      year,
      date,
      monthsSelected,
      subscriptionType,
      amount,
      paymentType,
      transactionNo,
      utrNo,
    } = await request.json();

    await connectDB();

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      id,
      {
        billNo,
        year,
        date,
        monthsSelected,
        subscriptionType,
        amount,
        paymentType,
        transactionNo,
        utrNo,
      },
      { new: true }
    );

    if (!updatedSubscription) {
      let response = NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    let response = NextResponse.json(
      { message: "Subscription updated", updatedSubscription },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update subscription:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}


// DELETE method to delete a subscription by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const deletedSubscription = await Subscription.findByIdAndDelete(id);

    if (!deletedSubscription) {
      let response = NextResponse.json(
        { message: "Subscription not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    let response = NextResponse.json(
      { message: "Subscription Deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete subscription:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// Add the new runtime configuration
export const runtime = "nodejs";
