import noticeModel from "@/models/notice"; // Update the model import to your Notice model
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, PUT, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

export async function POST(request: Request) {
  try {
    const requestBody = await request.json();
    console.log("Received POST request data:", requestBody); // Logging the POST data

    await connectDB();
    const newNotice = await noticeModel.create(requestBody); // Use the notice model for creation

    let response = NextResponse.json(
      { message: "Notice Created" }, // Adjust the success message
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create notice:", error); // Adjust error logging
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

export async function GET() {
  try {
    await connectDB();
    const notices = await noticeModel.find(); // Fetch all notices

    let response = NextResponse.json({ notices }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get notices:", error); // Adjust error logging
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

// Implement DELETE and PUT methods if needed
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json(); // Assuming the request contains the ID of the notice to delete
    await connectDB();
    await noticeModel.findByIdAndDelete(id);

    let response = NextResponse.json(
      { message: "Notice Deleted" },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete notice:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}

export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json(); // Extracting the ID and update data from the request
    await connectDB();
    const updatedNotice = await noticeModel.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    let response = NextResponse.json(
      { message: "Notice Updated", notice: updatedNotice },
      { status: 200 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update notice:", error);
    let response = NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
    setCORSHeaders(response);
    return response;
  }
}
