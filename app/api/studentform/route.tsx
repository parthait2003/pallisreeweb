import studentformModel from "@/models/studentform";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

// Utility function to set CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Utility function to format a date to DD/MM/YYYY
function formatToDDMMYYYY(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  const response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle POST requests to create a new student form
export async function POST(request: Request) {
  try {
    const {
      image,
      sportstype,
      name,
      fathersname,
      guardiansname,
      guardiansoccupation,
      gender,
      address,
      phoneno,
      date,
      nameoftheschool,
      bloodgroup,
      document,
      adhar,
      extraPractice,
      joiningdate,
    } = await request.json();

    // Convert the input date to a UTC date by appending 'T00:00:00Z'
    const inputDate = new Date(`${date}T00:00:00Z`);
    const formattedDate = new Date(`${inputDate}T00:00:00Z`);

    // Connect to the database
    await connectDB();

    // Create the new student form
    const newStudentForm = await studentformModel.create({
      image,
      sportstype,
      name,
      fathersname,
      guardiansname,
      guardiansoccupation,
      gender,
      address,
      phoneno,
      date: formattedDate,
      nameoftheschool,
      bloodgroup,
      document,
      adhar,
      extraPractice,
      joiningdate,
    });

    // Return success response
    const response = NextResponse.json(
      { message: "Student form created", data: newStudentForm },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create student form:", error.stack);
    const response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// Handle GET requests to retrieve student forms
export async function GET() {
  try {
    // Connect to the database
    await connectDB();

    // Retrieve all student forms
    const studentforms = await studentformModel.find();

    // Return the student forms in the response
    const response = NextResponse.json({ studentforms }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get student forms:", error.stack);
    const response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
