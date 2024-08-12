import subscriptionModel from "@/models/membersubscription";
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

// Handle POST request to create a new subscription
export async function POST(request) {
  console.log("POST request received");
  try {
    const requestBody = await request.json();
    console.log("Request body:", requestBody);

    let {
      billNo, // New field
      member,
      memberid,
      year,
      date,
      monthsSelected,

      subscriptionType,
      amount,
      paymentType, // New field
      transactionNo, // New field
      utrNo, // New field
    } = requestBody;

    // Validate required fields
    if (!billNo || !member || !year || !date || !amount) {
      console.error("Validation Error: Missing required fields");
      let response = NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
      setCORSHeaders(response);
      return response;
    }

    // Ensure monthsSelected, extraPracticeMonthsSelected, and subscriptionType are arrays of objects
    if (typeof monthsSelected === "string") {
      monthsSelected = JSON.parse(monthsSelected);
    }

    if (typeof subscriptionType === "string") {
      subscriptionType = JSON.parse(subscriptionType);
    }

    await connectDB();
    const newSubscription = await subscriptionModel.create({
      billNo, // New field
      member,
      memberid,
      year,
      date,
      monthsSelected,

      subscriptionType,
      amount,
      paymentType, // New field
      transactionNo, // New field
      utrNo, // New field
    });

    let response = NextResponse.json(
      { message: "Subscription Created" },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create subscription:", error);

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

// Handle GET request to fetch all subscriptions
export async function GET() {
  console.log("GET request received");
  try {
    await connectDB();
    const subscriptions = await subscriptionModel.find();

    let response = NextResponse.json({ subscriptions }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get subscriptions:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
