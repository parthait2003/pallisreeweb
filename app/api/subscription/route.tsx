import subscriptionModel from "@/models/subscription";
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
  await setCORSHeaders(response);
  return response;
}

// Handle GET request to fetch subscriptions
export async function GET(request) {
  console.log("GET request received");
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const traineeid = searchParams.get("traineeid");
    const year = searchParams.get("year");

    let subscriptions;
    if (traineeid && year) {
      subscriptions = await subscriptionModel.find({ traineeid, year });
    } else if (traineeid) {
      subscriptions = await subscriptionModel.find({ traineeid });
    } else {
      subscriptions = await subscriptionModel.find();
    }

    let response = NextResponse.json({ subscriptions }, { status: 200 });
    await setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get subscriptions:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    await setCORSHeaders(response);
    return response;
  }
}

// Handle POST request to create a new subscription
export async function POST(request) {
  console.log("POST request received");
  try {
    const requestBody = await request.json();
    console.log("Request body:", requestBody);

    let {
      billNo,
      trainee,
      traineeid,
      year,
      date,
      monthsSelected,
      extraPracticeMonthsSelected,
      subscriptionType,
      amount,
      paymentType,
      transactionNo,
      utrNo,
    } = requestBody;

    // Validate required fields
    if (!billNo || !trainee || !year || !date || !amount) {
      console.error("Validation Error: Missing required fields");
      let response = NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
      await setCORSHeaders(response);
      return response;
    }

    // Ensure monthsSelected, extraPracticeMonthsSelected, and subscriptionType are arrays of objects
    if (typeof monthsSelected === "string") {
      monthsSelected = JSON.parse(monthsSelected);
    }

    if (typeof extraPracticeMonthsSelected === "string") {
      extraPracticeMonthsSelected = JSON.parse(extraPracticeMonthsSelected);
    }

    if (typeof subscriptionType === "string") {
      subscriptionType = JSON.parse(subscriptionType);
    }

    await connectDB();
    const newSubscription = await subscriptionModel.create({
      billNo,
      trainee,
      traineeid,
      year,
      date,
      monthsSelected,
      extraPracticeMonthsSelected,
      subscriptionType,
      amount,
      paymentType,
      transactionNo,
      utrNo,
    });

    let response = NextResponse.json(
      { message: "Subscription Created" },
      { status: 201 }
    );
    await setCORSHeaders(response);
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

    await setCORSHeaders(response);
    return response;
  }
}
