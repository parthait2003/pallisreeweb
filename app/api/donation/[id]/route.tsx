import connectDB from "@/config/database";
import Donation from "@/models/donation";
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

export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const donation = await Donation.findById(id);

    if (!donation) {
      let response = NextResponse.json(
        { message: "Donation not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    let response = NextResponse.json({ donation }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get donation:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const {
      type,
      name,
      date,
      purpose,
      amount,
      paymentType,
      transactionNo,
      utrNo,
      chequeNo,
      draftNo,
      billNo,
    } = await request.json();

    await connectDB();
    const updatedDonation = await Donation.findByIdAndUpdate(
      id,
      {
        type,
        name,
        date,
        purpose,
        amount,
        paymentType,
        transactionNo,
        utrNo,
        chequeNo,
        draftNo,
        billNo,
      },
      { new: true }
    );

    if (!updatedDonation) {
      let response = NextResponse.json(
        { message: "Donation not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    let response = NextResponse.json(
      { message: "Donation updated", updatedDonation },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update donation:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// DELETE method to delete a donation by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const deletedDonation = await Donation.findByIdAndDelete(id);

    if (!deletedDonation) {
      let response = NextResponse.json(
        { message: "Donation not found" },
        { status: 404 }
      );
      setCORSHeaders(response);
      return response;
    }

    let response = NextResponse.json(
      { message: "Donation Deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete donation:", error);
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
