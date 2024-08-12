import connectDB from "@/config/database";
import Clubmember from "@/models/clubmember";
import { NextResponse } from "next/server";

async function setCORSHeaders(response) {
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "POST, GET, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return response;
}

export async function OPTIONS() {
  let response = NextResponse.json({}, { status: 200 });
  setCORSHeaders(response);
  return response;
}

export async function POST(request) {
  try {
    const {
      name,
      image,
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
    const newClubmember = new Clubmember({
      name,
      image,
      address,
      gender,
      dob,
      bloodgroup,
      phoneno,
      email,
      inducername,
      induceraddress,
      joiningdate,
    });

    const savedClubmember = await newClubmember.save();
    console.log("Saved clubmember:", savedClubmember);

    let response = NextResponse.json(
      { message: "Clubmember Created" },
      { status: 201 }
    );
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to create clubmember:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const clubmembers = await Clubmember.find();

    let response = NextResponse.json({ clubmembers });
    setCORSHeaders(response);
    return response;
  } catch (error) {
    console.error("Failed to get clubmembers:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
