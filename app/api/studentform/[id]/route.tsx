import connectDB from "@/config/database";
import Student from "@/models/studentform";
import { NextRequest, NextResponse } from "next/server";

// Utility function to set CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS, PUT"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle CORS preflight requests
export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle GET requests to retrieve a student by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json({ student }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle PUT requests to update a student by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
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
      extraPractice,
      document,
      adhar,
      joiningdate,
      traineeType, // Ensure traineeType is received in the request body
    } = await request.json();

    // Check if traineeType is provided in the update request
    if (!traineeType) {
      return NextResponse.json(
        { message: "Missing traineeType field" },
        { status: 400 }
      );
    }

    await connectDB();

    // Update the student record with all fields, including traineeType
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
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
        extraPractice,
        document,
        adhar,
        joiningdate,
        traineeType, // Update the traineeType field
      },
      { new: true } // Return the updated document after modification
    );

    if (!updatedStudent) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json(
      { message: "Student updated successfully", updatedStudent },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Handle DELETE requests to delete a student by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { message: "Missing student ID" },
        { status: 400 }
      );
    }

    await connectDB();
    const result = await Student.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json(
        { message: "Student not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json(
      { message: "Student deleted successfully" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete student:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
