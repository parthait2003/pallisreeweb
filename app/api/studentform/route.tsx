import studentformModel from "@/models/studentform";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

// Utility function to set CORS headers
function setCORSHeaders(response: NextResponse) {
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

// Utility function to check and format dates from ISO or DD/MM/YYYY
function formatDate(inputDate: string): string {
  const isoFormat = /^\d{4}-\d{2}-\d{2}$/; // Regex to check ISO format (YYYY-MM-DD)

  if (isoFormat.test(inputDate)) {
    // If it's in ISO format (YYYY-MM-DD), convert it to DD/MM/YYYY
    const [year, month, day] = inputDate.split("-");
    return `${day}/${month}/${year}`;
  }

  // If it's already in DD/MM/YYYY format, return as-is
  return inputDate;
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
      traineeType,
    } = await request.json();

    // Log all received data for debugging
    console.log({
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
      traineeType,
    });

    // Ensure required fields are present
    if (!name || !phoneno || !sportstype) {
      return NextResponse.json(
        {
          message:
            "Missing required fields: name, phoneno, sportstype, or traineeType",
        },
        { status: 400 }
      );
    }

    // Format dates to DD/MM/YYYY
    const formattedDate = formatDate(date);
    const formattedJoiningDate = formatDate(joiningdate);

    // Validate the date format (must be in DD/MM/YYYY format)
    const validDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (
      !validDateRegex.test(formattedDate) ||
      !validDateRegex.test(formattedJoiningDate)
    ) {
      return NextResponse.json(
        { message: "Invalid date format. Use DD/MM/YYYY" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectDB();

    // Create the new student form with formatted dates
    const newStudentForm = await studentformModel.create({
      image,
      sportstype,
      name,
      fathersname,
      guardiansname,
      guardiansoccupation,
      gender,
      address,
      phoneno: Number(phoneno), // Ensure phoneno is stored as a number
      date: formattedDate, // Store date as DD/MM/YYYY
      nameoftheschool,
      bloodgroup,
      document,
      adhar,
      extraPractice,
      joiningdate: formattedJoiningDate, // Store joiningdate as DD/MM/YYYY
      traineeType,
    });

    // Return success response
    const response = NextResponse.json(
      { message: "Student form created successfully", data: newStudentForm },
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

    // Format the dates before sending the response
    const formattedStudentForms = studentforms.map((form) => ({
      ...form._doc,
      date: form.date, // Format date to DD/MM/YYYY
      joiningdate: formatToDDMMYYYY(new Date(form.joiningdate)), // Format joiningdate to DD/MM/YYYY
    }));

    // Return the student forms in the response
    const response = NextResponse.json(
      { studentforms: formattedStudentForms },
      { status: 200 }
    );
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
