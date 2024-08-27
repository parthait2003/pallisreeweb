import { NextResponse } from "next/server";
import noticeModel from "@/models/notice";
import connectDB from "@/config/database";
import { ObjectId } from "mongodb";

// Set CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, PUT, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// Handle GET request - Retrieve a single notice by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Validate the ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Invalid notice ID" },
        { status: 400 }
      );
    }

    const notice = await noticeModel.findById(params.id).populate("trainees");
    if (!notice) {
      return NextResponse.json(
        { message: "Notice not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json({ notice }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to retrieve notice:", error.message, error.stack);
    let response = NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// Handle PUT request - Update a specific notice by ID
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const updateData = await req.json();
    await connectDB();

    // Validate the ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Invalid notice ID" },
        { status: 400 }
      );
    }

    const updatedNotice = await noticeModel.findByIdAndUpdate(
      params.id,
      updateData,
      {
        new: true,
      }
    );

    if (!updatedNotice) {
      return NextResponse.json(
        { message: "Notice not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json(
      { message: "Notice Updated", notice: updatedNotice },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update notice:", error.message, error.stack);
    let response = NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// Handle DELETE request - Delete a specific notice by ID
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    // Validate the ID format
    if (!ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { message: "Invalid notice ID" },
        { status: 400 }
      );
    }

    const deletedNotice = await noticeModel.findByIdAndDelete(params.id);

    if (!deletedNotice) {
      return NextResponse.json(
        { message: "Notice not found" },
        { status: 404 }
      );
    }

    let response = NextResponse.json(
      { message: "Notice Deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete notice:", error.message, error.stack);
    let response = NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
