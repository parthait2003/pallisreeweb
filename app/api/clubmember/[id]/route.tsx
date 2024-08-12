import connectDB from "@/config/database";
import Clubmember from "@/models/clubmember";
import { NextRequest, NextResponse } from "next/server";

// Function to set CORS headers
async function setCORSHeaders(response: NextResponse) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'POST, GET, DELETE, OPTIONS, PUT');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// OPTIONS method to handle CORS preflight requests
export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

// GET method to retrieve a club member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const clubmember = await Clubmember.findById(id)
;

    if (!clubmember) {
      return NextResponse.json({ message: "Clubmember not found" }, { status: 404 });
    }

    let response = NextResponse.json({ clubmember }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get clubmember:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT method to update a club member by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const {
      name,
      address,
      gender,
      dob,
      bloodgroup,
      phoneno,
      email,
      inducername,
      induceraddress,
      joiningdate,
    } = await request.json();

    await connectDB();
    const updatedClubmember = await Clubmember.findByIdAndUpdate(
      id,
      {
        name,
        address,
        gender,
        dob,
        bloodgroup,
        phoneno,
        email,
        inducername,
        induceraddress,
        joiningdate,
      },
      { new: true }
    );

    if (!updatedClubmember) {
      return NextResponse.json({ message: "Clubmember not found" }, { status: 404 });
    }

    let response = NextResponse.json({ message: "Clubmember updated", updatedClubmember }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to update clubmember:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE method to delete a club member by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    await connectDB();
    const deletedClubmember = await Clubmember.findByIdAndDelete(id)
;

    if (!deletedClubmember) {
      return NextResponse.json({ message: "Clubmember not found" }, { status: 404 });
    }

    let response = NextResponse.json({ message: "Clubmember Deleted" }, { status: 200 });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to delete clubmember:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// Add the new runtime configuration
export const runtime = 'nodejs';