import donationModel from "@/models/donation";
import connectDB from "@/config/database";
import { NextResponse, NextRequest } from "next/server";

// Function to set CORS headers
async function setCORSHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, PUT, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  console.log("OPTIONS request received");
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle POST request to create a new donation
export async function POST(request) {
  console.log("POST request received");
  try {
    const requestBody = await request.json();
    console.log("Request body:", requestBody);

    let {
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
    } = requestBody;

    await connectDB();

    // Find the maximum billNo and increment it
    const latestDonation = await donationModel
      .findOne()
      .sort({ billNo: -1 })
      .exec();
    const newBillNo = latestDonation ? latestDonation.billNo + 1 : 80009;

    const newDonation = await donationModel.create({
      billNo: newBillNo,
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
    });

    let response = NextResponse.json(
      { message: "Donation Created" },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create donation:", error);

    let response;
    if (error.name === "ValidationError") {
      response = NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    } else {
      response = NextResponse.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    setCORSHeaders(response);
    return response;
  }
}

// Handle GET request to fetch all donations
export async function GET() {
  console.log("GET request received");
  try {
    await connectDB();
    const donations = await donationModel.find();

    let response = NextResponse.json({ donations }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get donations:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
