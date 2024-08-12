import staffpaymentModel from "@/models/staffpayment";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";

// Middleware for setting CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, PUT, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

// Handle CORS preflight requests
export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  return setCORSHeaders(response);
}

// Create a new staff payment
export async function POST(request: Request) {
  try {
    const {
      staffName,
      date,
      amount,
      things,
      monthsSelected,
      otherCoach,
      billNo,
      year,
    } = await request.json();

    await connectDB();
    const newExpenditure = await staffpaymentModel.create({
      staffName,
      date,
      amount,
      things,
      months: monthsSelected,
      otherCoach,
      billNo,
      year,
    });

    let response = NextResponse.json(
      { message: "Staff Payment Created", data: newExpenditure },
      { status: 201 }
    );
    return setCORSHeaders(response);
  } catch (error) {
    console.error("Failed to create staff payment:", error.message);
    let response = NextResponse.json(
      { message: "Failed to create staff payment", error: error.message },
      { status: 500 }
    );
    return setCORSHeaders(response);
  }
}

// Retrieve all staff payments
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const staff = searchParams.get("staff");
    const year = searchParams.get("year");

    let filter = {};
    if (staff) {
      filter = { ...filter, staffName: staff };
    }
    if (year) {
      filter = { ...filter, year: year };
    }

    const expenditures = await staffpaymentModel.find(filter);

    let response = NextResponse.json({ expenditures }, { status: 200 });
    return setCORSHeaders(response);
  } catch (error) {
    console.error("Failed to retrieve staff payments:", error.message);
    let response = NextResponse.json(
      { message: "Failed to retrieve staff payments", error: error.message },
      { status: 500 }
    );
    return setCORSHeaders(response);
  }
}

// Delete a staff payment
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    await connectDB();
    const deletedExpenditure = await staffpaymentModel.findByIdAndDelete(id);

    if (!deletedExpenditure) {
      let response = NextResponse.json(
        { message: "Staff Payment not found" },
        { status: 404 }
      );
      return setCORSHeaders(response);
    }

    let response = NextResponse.json(
      { message: "Staff Payment Deleted" },
      { status: 200 }
    );
    return setCORSHeaders(response);
  } catch (error) {
    console.error("Failed to delete staff payment:", error.message);
    let response = NextResponse.json(
      { message: "Failed to delete staff payment", error: error.message },
      { status: 500 }
    );
    return setCORSHeaders(response);
  }
}

// Update a staff payment
export async function PUT(request: Request) {
  try {
    const { id, ...updateData } = await request.json();

    await connectDB();
    const updatedExpenditure = await staffpaymentModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedExpenditure) {
      let response = NextResponse.json(
        { message: "Staff Payment not found" },
        { status: 404 }
      );
      return setCORSHeaders(response);
    }

    let response = NextResponse.json(
      { message: "Staff Payment Updated", data: updatedExpenditure },
      { status: 200 }
    );
    return setCORSHeaders(response);
  } catch (error) {
    console.error("Failed to update staff payment:", error.message);
    let response = NextResponse.json(
      { message: "Failed to update staff payment", error: error.message },
      { status: 500 }
    );
    return setCORSHeaders(response);
  }
}
