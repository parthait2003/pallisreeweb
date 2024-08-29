import { NextResponse } from "next/server";
import studentformModel from "@/models/studentform";
import connectDB from "@/config/database";

// Utility function to set CORS headers
function setCORSHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle POST requests to check if a trainee exists
export async function POST(request) {
  try {
    const { phoneno } = await request.json();

    // Connect to the database
    await connectDB();

    // Check if a trainee with the same phone number exists
    const traineeExists = await studentformModel.findOne({ phoneno });

    // If the trainee exists, return a response indicating so
    const response = traineeExists
      ? NextResponse.json({ exists: true, message: "Trainee already exists" }, { status: 200 })
      : NextResponse.json({ exists: false }, { status: 200 });
    
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to check trainee:", error.stack);
    const response = NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    setCORSHeaders(response);
    return response;
  }
}
