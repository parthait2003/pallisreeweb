import expenditureModel from "@/models/expenditure";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

// Utility function to set CORS headers on the response
function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, PUT, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle OPTIONS preflight requests
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle POST requests to create a new expenditure
export async function POST(request: Request) {
  try {
    const { expenditures, description, date, amount, document, things } = await request.json();

    await connectDB(); // Connect to the database

    // Find the maximum existing billNo
    const lastExpenditure = await expenditureModel.findOne().sort({ billNo: -1 });
    const newBillNo = lastExpenditure ? lastExpenditure.billNo + 1 : 100000;

    // Create a new expenditure with the generated billNo
    const newExpenditure = await expenditureModel.create({
      expenditures,
      description,
      date,
      amount,
      document,
      things,
      billNo: newBillNo,
    });

    let response = NextResponse.json(
      { message: "Expenditure Created", newExpenditure },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create expenditure:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// Handle GET requests to retrieve expenditures
export async function GET() {
  try {
    await connectDB(); // Connect to the database
    const expenditures = await expenditureModel.find();

    let response = NextResponse.json({ expenditures }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get expenditures:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
